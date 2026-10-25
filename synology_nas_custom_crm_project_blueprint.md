# Custom CRM Project Blueprint: Synology NAS & Antigravity 2

## 1. Project Overview & Infrastructure Target
* **Target Hardware:** Synology NAS (`192.168.1.224`)
* **Deployment Method:** Container Manager (Docker & Docker Compose)
* **Development Environment:** Google Antigravity 2 (Multi-agent local workspace orchestration)
* **Core Goal:** Build a custom, self-hosted CRM tailored for high-precision technical components, global account pipelines, and engineering design wins.

---

## 2. Infrastructure & Deployment Architecture
* **Web Server & Reverse Proxy:** Configured via DSM Web Station (Apache/Nginx) and Control Panel Reverse Proxy for clean internal/external routing.
* **Database Layer:** PostgreSQL or SQLite containerized on the NAS, ensuring isolated, persistent storage mapped to local Synology shared folders (e.g., `/docker/crm/data`) for automated `Hyper Backup` integration.
* **Application Stack:**
  * *Backend:* Python (FastAPI) or Node.js (Express) with RESTful APIs.
  * *Frontend:* Modern responsive UI (React / Vite or Next.js with Tailwind CSS) optimized for rapid data entry and pipeline tracking.

---

## 3. Custom CRM Data Schema & Business Logic
Unlike generic commercial templates, this CRM is designed with specialized metadata structures:
* **Accounts & Organizations:** Enterprises, international distributors, and R&D manufacturing partners.
* **Contacts:** Engineering leads, procurement buyers, and executive decision-makers.
* **Opportunities / Pipelines:** Tracking design wins, custom R&D proposals, sample testing phases, and volume production forecasts.
* **Technical Parameters Tracker:** Specialized metadata fields for high-precision frequency control solutions (Phase Noise, Jitter, Frequency Stability, Package Types like HC40/CSAC, and target applications like IEEE 1588 PTP or 5G infrastructure).

---

## 4. Antigravity 2 Execution Roadmap
1. **Workspace Initialization:** Set up the local project folder and initialize the repository structure.
2. **Database & API Scaffolding:** Deploy subagents to build relational database models and core endpoints.
3. **Frontend Dashboard Generation:** Build a clean, lightning-fast pipeline and account management interface.
4. **Custom Skills & Deployment Scripting:** Package a `docker-compose.yml` and synchronization skill to seamlessly push builds to the Synology NAS (`192.168.1.224`).