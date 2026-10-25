# Precision CRM: Synology NAS Operations & Deployment Guide

## 1. System Architecture & Topology

```
+----------------------------------------------------------------------------------------------------+
|                                    Synology NAS (192.168.1.224)                                    |
|                                                                                                    |
|   +--------------------------------------------------------------------------------------------+   |
|   |                       DSM Reverse Proxy / Web Station (HTTPS 443 / HTTP)                   |   |
|   +--------------------------------------------------------------------------------------------+   |
|                                                 |                                                  |
|                                    Internal Docker Bridge Network                                  |
|                                                 |                                                  |
|         +---------------------------------------+---------------------------------------+          |
|         |                                                                               |          |
|         v (Port 3000 -> 80)                                                             v (Port 8000)
|   +------------------------------------+                                  +--------------------+   |
|   |  crm_frontend                      |  ---- Proxy: /api/ -> :8000 ---> |  crm_backend       |   |
|   |  (React 18 + Vite + Tailwind CSS   |                                  |  (FastAPI REST     |   |
|   |   served by Nginx Alpine)          |                                  |   Python 3.11)     |   |
|   +------------------------------------+                                  +--------------------+   |
|                                                                                     |              |
|                                                                                     | Port 5432    |
|                                                                                     v              |
|                                                                           +--------------------+   |
|                                                                           |  crm_postgres      |   |
|                                                                           |  (PostgreSQL 16)   |   |
|                                                                           +--------------------+   |
|                                                                                     |              |
|                                                                           Persistent Mount Volumes |
|                                                                                     v              |
|   +--------------------------------------------------------------------------------------------+   |
|   |  Synology Shared Folders:                                                                  |   |
|   |  - /volume1/docker/crm/postgres_data  (PostgreSQL relational database)                     |   |
|   |  - /volume1/docker/crm/attachments    (Activity PDF meeting minutes & lab test reports)    |   |
|   |  (Protected by Synology Hyper Backup & Btrfs Snapshots)                                    |   |
|   +--------------------------------------------------------------------------------------------+   |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Prerequisites on Synology DSM

1. **Synology DSM Version:** DSM 7.2 or later.
2. **Container Manager:** Installed via DSM Package Center (replaces legacy Docker package).
3. **Storage Setup:**
   - Create the required directories in File Station:
     ```bash
     /volume1/docker/crm/
     /volume1/docker/crm/postgres_data/
     /volume1/docker/crm/attachments/
     ```
   - Ensure the `docker` user or administrators have read/write access to these directories.
   - Attachments uploaded to activities (meeting PDFs, test reports) are stored in `/volume1/docker/crm/attachments/`.
4. **Port Allocation Notice:**
   - Synology DSM internally listens on port `5432` for system PostgreSQL.
   - Precision CRM maps PostgreSQL to host port `5433` (`POSTGRES_PORT=5433` in `.env`) to guarantee zero conflict.

---

## 3. Step-by-Step Deployment Options

### Method A: Via DSM Container Manager GUI (Recommended)

1. **Upload Files:**
   - Open **File Station** on DSM.
   - Navigate to `/docker/crm/`.
   - Copy or extract the project directory contents (`docker-compose.yml`, `backend/`, `frontend/`, `.env`).
2. **Create Project in Container Manager:**
   - Open **Container Manager** in DSM.
   - Click **Project** in the left sidebar ➔ Click **Create**.
   - Project Name: `precision-crm`.
   - Path: Select `/docker/crm`.
   - Source: Choose **Use existing docker-compose.yml**.
   - Review settings and check **Build image immediately** (or click Next ➔ Done).
3. **Launch & Verification:**
   - Container Manager will build the backend, frontend, and start PostgreSQL.
   - Check the **Container** list: `crm_postgres`, `crm_backend`, and `crm_frontend` will be running.
   - Access the CRM interface at:
     ```
     http://192.168.1.224:3000
     ```
   - Access backend API documentation (Swagger UI) at:
     ```
     http://192.168.1.224:8000/docs
     ```

---

### Method B: Via Synology SSH Terminal & Interactive Scripts

1. Enable SSH in DSM: **Control Panel ➔ Terminal & SNMP ➔ Enable SSH service** (Port 22).
2. Connect to the NAS:
   ```bash
   ssh admin_user@192.168.1.224
   ```
3. Navigate to the project directory:
   ```bash
   cd /volume1/docker/crm
   ```
4. Copy `.env.example` to `.env` if not already present:
   ```bash
   cp .env.example .env
   ```
5. Launch Docker Compose:
   ```bash
   sudo docker compose up -d --build
   ```
6. Check service logs:
   ```bash
   sudo docker compose logs -f
   ```

### Method C: Automated Remote Deployment Script (`deploy_update.py`)
For remote deployments from Windows/macOS, use the updated `deploy_update.py` script. The script securely prompts for NAS credentials without storing them:
```bash
python deploy_update.py
```
Prompts:
```plaintext
Enter Synology NAS Host [192.168.1.224]: 192.168.1.224
Enter Synology NAS Username: mcatg
Enter Synology NAS Password: ********
```
The script automatically connects via SSH, unpacks the update package via `7z`, rebuilds containers via `docker-compose`, and reports live container health.

---

## 4. Reverse Proxy & SSL Configuration (DSM Control Panel)

To access your CRM securely via a clean domain name (e.g. `https://crm.yourdomain.synology.me`) without needing port `3000`:

1. Open DSM **Control Panel ➔ Login Portal ➔ Advanced ➔ Reverse Proxy**.
2. Click **Create**:
   - **Reverse Proxy Name:** `Precision CRM`
   - **Source:**
     - Protocol: `HTTPS`
     - Hostname: `crm.yourdomain.synology.me` (or `crm.local`)
     - Port: `443`
     - Enable HSTS (optional for HTTPS)
   - **Destination:**
     - Protocol: `HTTP`
     - Hostname: `localhost` (or `192.168.1.224`)
     - Port: `3000`
3. Under **Custom Header**:
   - Click **Create ➔ WebSocket** (auto-populates `Upgrade` and `Connection` headers).
4. Under **Security ➔ Certificate**:
   - Assign your Let's Encrypt or Synology DDNS certificate to this reverse proxy rule.
5. Click **Save**. The CRM is now accessible over HTTPS with SSL encryption.

---

## 5. Backup & Disaster Recovery (Synology Hyper Backup)

Because database data and uploaded files are stored in dedicated persistent volumes:

### Automated Daily Backup with Hyper Backup
1. Open **Hyper Backup** in DSM.
2. Click **+ ➔ Data backup task**.
3. Target: Choose your destination (Synology C2 Storage, external USB drive, or remote rsync/NAS).
4. Folders: Select:
   - `/volume1/docker/crm/postgres_data` (relational database)
   - `/volume1/docker/crm/attachments` (uploaded PDF meeting minutes, test reports)
   - `/volume1/docker/crm/docker-compose.yml` (orchestration definition)
5. Schedule: Set to run daily (e.g., at 03:00 AM).
6. Enable integrity check and client-side encryption as desired.

### Manual Database Dump via CLI
To take an instant SQL snapshot:
```bash
docker exec -t crm_postgres pg_dump -U crm_user -d crm_db > /volume1/docker/crm/crm_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Database Restore Procedure
To restore from an SQL dump:
```bash
cat backup_file.sql | docker exec -i crm_postgres psql -U crm_user -d crm_db
```

---

## 6. Automated Health Verification

The repository includes a fast automated integration test suite ([test_live_nas.py](backend/tests/test_live_nas.py)) that validates all endpoints in under 2 seconds:
```bash
pytest -v backend/tests/test_live_nas.py
```
Checks:
- Backend health & PostgreSQL 16 connectivity
- Nginx reverse proxy routing
- Frontend SPA serving
- Parallel project and distributor channel partner linkages
- Interaction history and PDF attachment uploads/downloads
- Excel export generation and batch import templates
