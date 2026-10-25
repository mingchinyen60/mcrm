# Precision CRM: User Manual & Workflow Guide

## Welcome to Precision CRM
**Precision CRM** is a self-hosted customer relationship management system engineered specifically for high-precision technical components, frequency control timing devices (OCXOs, TCXOs, CSACs, VCXOs), and multi-stage engineering design-win pipelines running natively on **Synology NAS (`192.168.1.224`)**.

---

## 1. System Navigation & Architecture Overview

The left navigation sidebar provides one-click access to all primary functional modules:

| Icon | Module | Core Functionality |
| :--- | :--- | :--- |
| 📊 | **Dashboard** | Executive KPIs, total pipeline value, weighted revenue forecasts, and active sample counts. |
| 🔀 | **Design-Win Pipeline** | Visual Kanban board tracking opportunities through 5 high-tech engineering milestones. |
| 🎯 | **Opportunities** | Comprehensive list view with pull-down filtering by stage, OEM accounts, sales channels, and export. |
| 🏢 | **Accounts & OEMs** | Tiered database of telecommunication OEMs, hyperscale ODMs, with expandable parallel project drawers. |
| 👥 | **Contacts & Engineers** | Directory of hardware architects, RF designers, procurement managers, and executives. |
| ⚡ | **Technical Specs** | Frequency control catalog with phase noise profiles (dBc/Hz), jitter, and packages. |
| 📦 | **Sample Tracker** | Evaluation lifecycle tracking for sample batches sent to customer labs (EVT/DVT/PVT). |

The top navigation bar displays the current Synology NAS host status (`192.168.1.224`), LAN security zone indicator, and Hyper Backup status badge.

---

## 2. Accounts & Global OEMs Management

### Adding a New Account
1. Click **Accounts & OEMs** in the sidebar.
2. Click **+ New Account** in the top right.
3. Fill in:
   - **Company Name:** e.g., *Ericsson Mobile Networks*, *Nokia*, *Celestica*, *Keysight Technologies*.
   - **Account Type:** Select `OEM`, `ODM`, `Distributor`, or `R&D Partner`.
   - **Account Tier:** Choose `Strategic`, `Tier 1`, or `Tier 2`.
   - **Industry:** e.g., *Telecommunications*, *Datacenter / AI*, *Aerospace & Defense*, *Instrumentation*.
   - **Region:** *North America*, *EMEA*, *APAC*, or *Domestic*.
   - Optional: Website URL, phone, address, and strategic notes.
4. Click **Save Account**.

### Searching & Filtering
- Use the real-time search bar to locate companies by name or strategic notes.
- Use the **All Industries** or **All Tiers** dropdowns to filter high-priority target accounts.

### Expandable Account Opportunities (Open / Closed Status Filters)
Large accounts frequently run multiple projects in parallel. Every account row includes an **Opps (N)** toggle button:
1. Click **Opps (N)** on any account row to expand an inline drawer showing all projects linked to that organization.
2. Use the **Status Filter Checkboxes** to tailor your view:
   - `[x] Open (N)`: Displays active pipeline programs (Leads, Tech Discovery, Sample Eval, Design-Win, Mass Production).
   - `[x] Closed (N)`: Displays closed-lost or disqualified RFPs for post-mortem analysis.
   - Select both checkboxes to view full historical engagement.
3. Each project card displays the **Project Code**, title, stage badge, revenue, volume, distributor partner, and activity count.

---

## 3. Managing Contacts & Engineering Decision-Makers

High-tech component sales depend on tracking both technical architects and commercial buyers:

1. Click **Contacts & Engineers** in the sidebar.
2. Click **+ New Contact**.
3. Select the associated company from the **Account** dropdown.
4. Specify the contact's **Role Category**:
   - **Engineering Lead:** Chief Hardware Architects, RF Timing Engineers (key technical decision-makers).
   - **Procurement:** Sourcing directors, component buyers (handle contracts and commercial pricing).
   - **Executive:** VP of Engineering, Sourcing VP.
   - **FAE:** Field Application Engineers.
5. Check **Set as primary account contact** if this person is your main point of contact.
6. Click **Save Contact**.

---

## 4. Technical Parameters Tracker (Frequency Components)

Unlike standard commercial CRMs, Precision CRM includes first-class support for RF, timing, and oscillator parameters:

### Adding a Technical Component Specification
1. Click **Technical Specs** in the sidebar.
2. Click **+ New Specification**.
3. Enter primary specifications:
   - **Part Number:** e.g., `OCXO-10M-HC40-LP` or `TCXO-122M-7050-LJ`.
   - **Oscillator Type:** `OCXO`, `TCXO`, `CSAC / Atomic`, `VCXO`, or `Crystal Resonator`.
   - **Nominal Frequency:** e.g., `10.000 MHz`, `122.880 MHz`, `156.250 MHz`.
   - **Frequency Stability:** e.g., `±0.1 ppb`, `±0.28 ppm`.
   - **Package Type:** `HC40`, `CSAC`, `SMD 7050`, `SMD 5032`, `SMD 3225`, etc.
   - **Jitter Spec:** e.g., `< 35 fs RMS (12kHz to 20MHz)`.
4. Enter the **Phase Noise Profile** at standard offset frequencies:
   - `@ 10Hz` (dBc/Hz)
   - `@ 100Hz` (dBc/Hz)
   - `@ 1kHz` (dBc/Hz)
   - `@ 10kHz` (dBc/Hz)
   - `@ 100kHz` (dBc/Hz)
   - `@ 1MHz` (dBc/Hz)
5. Add target application (`IEEE 1588 PTP`, `5G Infrastructure`, `Datacenter AI Timing`) and direct datasheet URL.
6. Click **Save Spec**.

---

## 5. Design-Win Milestone Pipeline (Kanban Board)

The **Design-Win Pipeline** visualizes opportunities across five strict engineering milestones:

1. **1. Lead / Prospect:** Initial customer requirement or RFP identified.
2. **2. Tech Discovery:** Engineering alignment on socket specs, supply voltage, frequency stability, and thermal limits.
3. **3. Sample Evaluation (EVT/DVT):** Physical sample batch testing in customer laboratory chamber.
4. **4. Design Win (Approved BOM):** Formally selected and frozen on customer Bill of Materials (BOM) / PVT release.
5. **5. Mass Production (MP):** Commercial volume production shipments.
- **Closed / Lost:** Opportunity lost or disqualified with competitor reason notes.

Drag and drop cards across columns to advance milestones automatically.

---

## 6. Dedicated Opportunities View & Multi-Project Tracking

Navigate to **Opportunities** in the sidebar for a structured, filterable list of all customer programs:

### Multi-Project Parallel Tracking (OEMs & Channel Reps/Distributors)
Large accounts (e.g. Ericsson, Nokia, Cisco) frequently run multiple parallel hardware designs concurrently through authorized sales representative firms or distributors (e.g. Arrow Electronics, Avnet, WPG):
- **Project Code:** Unique identifier (e.g., `PRJ-5G-DU-01`, `PRJ-5G-RU-02`).
- **End Customer OEM:** The ultimate equipment manufacturer locking the component onto their Bill of Materials (BOM).
- **Channel Partner / Disti / Rep:** The supply chain partner managing local logistics, buffer stock, and quoting.
- Opportunities display both the OEM and Distributor badge for immediate transparency.

### Dropdown Filtering & Sorting
- **Pull-down Stage Filter:** Quickly isolate programs in `Lead`, `Tech Discovery`, `Sample Eval`, `Design-Win`, `Mass Production`, or `Closed / Lost`.
- **Pull-down Account & OEM Filter:** Select any customer organization to view their full portfolio of parallel projects.
- **Pull-down Sales Channel Filter:** Filter by Direct engagement or specific distributor partners (e.g. *Arrow Electronics*, *Avnet*).
- **Sort Options:** Order by Estimated Revenue ($), Annual Volume, Confidence %, or Last Updated Date.
- **Real-time Search:** Search across title, project code, part number, and application.
- **Export Current View:** Click **Export Excel** or **Export CSV** in the top-right toolbar to download the filtered table.

---

## 7. Interaction History, Meeting Minutes & PDF Attachments

Every opportunity includes a chronological audit trail capturing meetings, lab visits, and commercial negotiations:

1. In the **Opportunities** view, click **Activities (N)** on any program to expand its nested timeline drawer.
2. Click **+ Log Interaction** to record:
   - **Interaction Type:** `Meeting (F2F)`, `Lab On-site Visit`, `Video Conference`, `Phone Call`, `Email Exchange`, or `Tech Review`.
   - **Attendees:** Customer lead engineers, distributor FAEs, and internal team members.
   - **Meeting Minutes & Discussions:** Summary of holdover tests, phase noise reviews, thermal chambers, and pricing milestones.
   - **Action Items & Due Dates:** Concrete deliverables (e.g. *Ship 5 revised HC40 samples by Nov 10*).
   - **PDF & Document Attachments:** Drag and drop `.pdf`, `.doc`, or test report files (e.g., phase noise spectrum plots, customer meeting minutes, thermal shock test reports).
3. Attached documents are securely stored on the Synology NAS storage volume (`/volume1/docker/crm/attachments/`).
4. Click **View PDF** on any logged activity card to open and review the document directly in your browser.
5. If an activity was previously saved without an attachment, click **Attach PDF / Document** to upload one at any time.

---

## 8. Sample Request & Lab Evaluation Tracker

Tracking physical test samples is essential for closing design-in cycles:

1. Click **Sample Tracker** in the sidebar.
2. Click **+ New Sample Batch**.
3. Select the linked **Opportunity** and **Part Specification**.
4. Set:
   - **Sample Batch Code:** e.g., `SMP-2025-EVT-01`.
   - **Quantity:** Number of engineering samples shipped (e.g., 5 pcs).
   - **Test Phase:** `EVT` (Engineering Verification), `DVT` (Design Verification), or `PVT` (Production Verification).
   - **Carrier & Tracking Number:** e.g., DHL Express, FedEx Priority.
   - **Evaluation Status:** `Requested` ➔ `In Lab Prep` ➔ `Dispatched` ➔ `Customer Testing` ➔ `Passed` / `Revision Needed`.
5. Enter **Lab Test Results** (e.g., *Thermal drift measured at 1.1us holdover over 24h*) and **Customer Feedback**.
6. Click **Save Sample**.

---

## 9. Batch Uploads & Excel Templates

For fast onboarding and bulk updates, Precision CRM provides downloadable templates in both **Microsoft Excel (`.xlsx`)** and **CSV** formats:

### How to Batch Import:
1. Navigate to **Accounts & OEMs**, **Contacts & Engineers**, or **Technical Specs**.
2. Click the **Batch Upload** button in the header toolbar.
3. Click **Download Excel (.xlsx)** or **Download CSV** to obtain the official template with pre-filled headers and sample rows.
4. Fill in your component or customer records in Excel.
5. Drag and drop the saved file into the upload zone and click **Start Batch Import**.
6. The system automatically verifies fields, updates existing records, creates new entries, and displays a summary of imported rows.

---

## 10. Data Exports to Excel & CSV

Export real-time CRM intelligence at any time:
- **Design Programs Pipeline:** Click **Export Excel** on the Kanban Pipeline toolbar or Opportunities view to download a complete spreadsheet containing Project Codes, OEM Customers, Channel Reps, Part Numbers, Revenue ($), Confidence (%), Target MP Dates, and Latest Interactions.
- **Accounts & Organizations:** Download complete company directories with contact counts and active opportunity totals.
- **Technical Specifications Catalog:** Export full RF & timing specifications including discrete Phase Noise profiles (-10Hz to 1MHz), jitter, and operating temperature ranges.
- **Sample Evaluations:** Export physical sample qualification batches, tracking numbers, and lab validation results.

---

## 11. Executive Dashboard & Analytics

The **Dashboard** aggregates real-time intelligence across all programs:
- **Total Pipeline Value:** Cumulative potential revenue across all active design-in opportunities.
- **Weighted Forecast:** Value discounted by each opportunity's confidence percentage ($ \text{Revenue} \times \text{Confidence} \% $).
- **Design-Wins & Mass Production:** Ratio of BOM locks to ongoing volume shipments.
- **Active Samples in Lab:** Immediate count of sample batches currently undergoing customer lab qualification.
- **Pipeline Phase Distribution:** Visual breakdown of dollar value across each stage of the funnel.

---

## 12. Security & Credentials Management

- **Zero Hardcoded Secrets:** No passwords, access tokens, or Synology credentials are stored in git repositories or plain text source files.
- **Interactive Prompts:** CLI utilities (`deploy_update.py`, `ssh_deploy.py`, `migrate_db.py`) prompt for NAS credentials via standard masked input (`getpass.getpass()`) or environment variables (`NAS_USER`, `NAS_PASSWORD`).
- **Protected Environment File:** The local `.env` file is excluded via `.gitignore`, and only `.env.example` is committed to version control.
