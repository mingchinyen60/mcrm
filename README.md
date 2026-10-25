# Precision CRM for Synology NAS 🚀

A modern, high-precision self-hosted Customer Relationship Management (CRM) platform engineered specifically for **frequency control components**, **timing devices** (OCXOs, TCXOs, CSACs, VCXOs), and **multi-stage engineering design-win pipelines** running containerized on **Synology NAS (Container Manager / Docker Compose)**.

---

## 📸 Key Capabilities & Features

### 1. 🔀 Multi-Project Parallel Tracking & Channel Partner Linkage
- **Parallel Programs per Account:** Major telecom OEMs (e.g., Ericsson, Nokia) run multiple concurrent hardware designs in parallel (e.g. `PRJ-5G-DU-01` DU Master Clock and `PRJ-5G-RU-02` Massive MIMO Radio Unit).
- **Distributor & Sales Rep Integration:** First-class relationship linking OEMs to authorized distributors (e.g. Arrow Electronics, Avnet) for supply chain fulfillment, buffer stock tracking, and commission allocation.

### 2. 🎯 Dedicated "Opportunities" View
- **Pull-down Filters:** Sort and isolate programs by **Milestone Stage**, **Customer OEM Accounts**, or **Sales Channel Partner**.
- **Sort Controls:** Order by Estimated Program Value ($ USD), Annual Unit Demand, Confidence %, or Last Updated Date.
- **One-Click Export:** Download the currently filtered table directly to **Microsoft Excel (`.xlsx`)** or **CSV**.

### 3. 📝 Smart Activity Timeline & PDF Document Attachments
- **Chronological Audit Trail:** Captures meeting minutes, lab visits, phone calls, and video conferences.
- **PDF & Document Attachments:** Drag-and-drop `.pdf` files (meeting minutes, thermal test reports, RF spectrum plots) stored securely on persistent Synology storage (`/volume1/docker/crm/attachments/`).
- **In-Browser Viewing:** Click **View PDF** to open documents directly in your browser.

### 4. 🏢 Expandable Accounts & OEMs View
- **Accordion Drawers:** Click **Opps (N)** on any account row to expand an inline drawer showing all related projects.
- **Status Filter Checkboxes:** Toggle `[x] Open` and `[x] Closed` checkboxes to view active programs, closed-lost RFPs, or both simultaneously.

### 5. ⚡ Specialized Frequency Control Parameters Catalog
- **RF & Timing Parameters:** Stores discrete **Phase Noise profiles** at standard offset frequencies (`@ 10Hz`, `100Hz`, `1kHz`, `10kHz`, `100kHz`, `1MHz` in dBc/Hz), **RMS Phase Jitter** (fs), **Frequency Stability** (ppb/ppm), supply voltages, and package footprints (`HC40`, `CSAC`, `SMD 7050`, etc.).

### 6. 📦 Sample Request & Lab Evaluation Tracker
- **Hardware Qualification Lifecycle:** Tracks physical test batches through **EVT**, **DVT**, and **PVT** validation phases with carrier tracking numbers (DHL, FedEx, UPS) and customer lab sign-off notes for AVL approval.

### 7. 📥 Batch Upload Templates & Export Engine
- **Pre-filled Templates:** Generates downloadable `.xlsx` and `.csv` templates with column validation for Accounts, Contacts, and Technical Specs.
- **Multi-Table Exports:** One-click Excel workbooks styled with openpyxl for financial reporting.

---

## 🏛️ System Architecture

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

## 🚀 Quickstart Deployment on Synology NAS

### 1. Prerequisites
- Synology DSM 7.2+ with **Container Manager** installed.
- Ensure the following folders exist in File Station:
  ```bash
  /volume1/docker/crm/
  /volume1/docker/crm/postgres_data/
  /volume1/docker/crm/attachments/
  ```

### 2. Launch with Container Manager
1. Copy or upload the repository contents to `/volume1/docker/crm/`.
2. Open **Container Manager** ➔ **Project** ➔ **Create**.
3. Point to `/volume1/docker/crm/` and select **Use existing docker-compose.yml**.
4. Click **Build and Start**.

### 3. Launch via SSH Terminal
```bash
cd /volume1/docker/crm
cp .env.example .env
sudo docker compose up -d --build
```

### 4. Access URLs
- **Web Interface:** `http://<NAS_IP>:3000`
- **Interactive API Docs (Swagger):** `http://<NAS_IP>:8000/docs`
- **PostgreSQL Database:** `<NAS_IP>:5433` (mapped from 5432 to avoid DSM conflict)

---

## 🧪 Automated Testing

Precision CRM includes automated unit and live integration test suites using `pytest` and `httpx`:

```bash
# Run local unit tests (mock DB)
pytest -v backend/tests/test_api.py

# Run live integration tests against Synology NAS (192.168.1.224)
pytest -v backend/tests/test_live_nas.py
```

---

## 🔒 Security Best Practices
- **Zero Hardcoded Credentials:** Deployment utilities prompt interactively for credentials using `getpass.getpass()`.
- **Environment Isolation:** Secrets are kept strictly in `.env` (which is excluded from version control via `.gitignore`).

---

## 📚 Documentation
- [USER_MANUAL.md](USER_MANUAL.md) — Comprehensive user manual and workflow guide.
- [OPERATIONS.md](OPERATIONS.md) — Synology DSM operational procedures, Hyper Backup setup, and SSL reverse proxy guide.
