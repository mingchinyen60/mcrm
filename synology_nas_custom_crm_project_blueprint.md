# Custom CRM Project Blueprint: Synology NAS & Antigravity 2

## 1. Project Overview & Infrastructure Target
* **Target Hardware:** Synology NAS (`192.168.1.224`)
* **Deployment Method:** Container Manager (Docker & Docker Compose)
* **Development Environment:** Google Antigravity 2 (Multi-agent local workspace orchestration)
* **Core Goal:** Build a custom, self-hosted CRM tailored for high-precision technical components, global account pipelines, engineering design wins, and channel partner networks.

---

## 2. Infrastructure & Deployment Architecture
* **Web Server & Reverse Proxy:** Configured via Nginx container and DSM Control Panel Reverse Proxy for clean internal/external routing.
* **Database Layer:** PostgreSQL 16 containerized on the NAS, ensuring isolated, persistent storage mapped to `/volume1/docker/crm/postgres_data` on host port `5433` for automated `Hyper Backup` integration.
* **Persistent Attachments Volume:** Mapped to `/volume1/docker/crm/attachments/` for storing customer meeting PDFs, lab test reports, and RF spectrum plots.
* **Application Stack:**
  * *Backend:* Python 3.11 with FastAPI, SQLAlchemy 2.0, Pydantic v2, and OpenPyXL for Excel generation.
  * *Frontend:* React 18, Vite, TypeScript, and Tailwind CSS with Lucide icons.

---

## 3. High-Precision Technical CRM Features & Capabilities
Unlike generic commercial templates, Precision CRM includes first-class engineering capabilities:
* **Accounts & Organizations:** Tier-1 telecommunication OEMs, ODMs, international distributors (Arrow, Avnet), and aerospace contractors.
* **Expandable Parallel Projects:** Interactive accordion on account rows with `[x] Open` and `[x] Closed` status checkboxes.
* **Dedicated Opportunities View:** Comprehensive list view with pull-down filters by stage, OEM accounts, sales channels, and one-click Excel/CSV export.
* **Interaction History & PDF Attachments:** Full activity timeline capturing phone calls, lab visits, and commercial terms, with drag-and-drop PDF attachments.
* **Technical Parameters Tracker:** Specialized metadata fields for high-precision frequency control solutions (Phase Noise dBc/Hz from 10Hz to 1MHz, Jitter, Frequency Stability, Package Types like HC40/CSAC/SMD7050).
* **Sample Testing & Lab Qualification:** Tracking sample batches through EVT, DVT, and PVT phases with AVL approval feedback.
* **Batch Import & Export Engine:** Pre-filled Excel and CSV templates with validation and multi-table data exports.

---

## 4. Antigravity 2 Execution Roadmap (Completed)
1. ✅ **Workspace Initialization:** Set up the local project folder and initialize the repository structure.
2. ✅ **Database & API Scaffolding:** Relational database models and RESTful endpoints created and verified.
3. ✅ **Frontend Dashboard & Kanban Pipeline:** Interactive Kanban milestone board, Opportunity view, and Account expanders built.
4. ✅ **QA Audit & Verification:** Automated unit test suite and live integration test suite (`test_live_nas.py`) running against Synology NAS (`192.168.1.224`).
5. ✅ **Live Deployment & GitHub Release:** Clean version control repository published at `https://github.com/mingchinyen60/mcrm`.
