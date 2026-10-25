import io
import pytest
import httpx
import openpyxl

NAS_BACKEND = "http://192.168.1.224:8000"
NAS_FRONTEND = "http://192.168.1.224:3000"
TIMEOUT = 5.0

@pytest.fixture(scope="session")
def client():
    with httpx.Client(timeout=TIMEOUT) as c:
        yield c

def test_01_backend_health(client):
    """Verify backend health and DB connection."""
    res = client.get(f"{NAS_BACKEND}/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "postgresql" in data["database"]

def test_02_nginx_reverse_proxy(client):
    """Verify Nginx reverse proxy forwards /api/health to backend on port 3000."""
    res = client.get(f"{NAS_FRONTEND}/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_03_frontend_spa_serving(client):
    """Verify Nginx serves the React/Vite single page app index.html."""
    res = client.get(f"{NAS_FRONTEND}/")
    assert res.status_code == 200
    assert "text/html" in res.headers.get("content-type", "")
    assert "<title>" in res.text

def test_04_dashboard_metrics(client):
    """Verify dashboard metrics aggregates accounts and pipeline value."""
    res = client.get(f"{NAS_BACKEND}/api/v1/dashboard/metrics")
    assert res.status_code == 200
    data = res.json()
    assert data["total_accounts"] >= 5
    assert data["total_opportunities"] >= 5
    assert data["total_pipeline_value"] > 0
    assert len(data["stage_breakdown"]) >= 5

def test_05_parallel_projects_and_channel_partners(client):
    """Verify parallel projects on a single account with distributor partner linkage."""
    # Find Ericsson account
    accounts_res = client.get(f"{NAS_BACKEND}/api/v1/accounts")
    assert accounts_res.status_code == 200
    accounts = accounts_res.json()
    ericsson = next((a for a in accounts if "Ericsson" in a["name"]), None)
    assert ericsson is not None, "Ericsson account should exist"

    # Query opportunities for Ericsson
    opps_res = client.get(f"{NAS_BACKEND}/api/v1/opportunities?account_id={ericsson['id']}")
    assert opps_res.status_code == 200
    opps = opps_res.json()
    assert len(opps) >= 2, f"Expected at least 2 parallel projects for Ericsson, got {len(opps)}"

    # Check project codes and distributor linkage
    project_codes = [o.get("project_code") for o in opps if o.get("project_code")]
    assert len(project_codes) >= 2, f"Expected project codes, got: {project_codes}"
    
    # Verify partner account name is populated (e.g. Arrow Electronics)
    partners = [o.get("partner_account_name") for o in opps if o.get("partner_account_name")]
    assert len(partners) > 0, "Expected partner distributor linkage"
    assert any("Arrow" in str(p) for p in partners), f"Expected Arrow partner, got {partners}"

def test_06_interaction_history_timeline(client):
    """Verify activity timeline logging and retrieval."""
    res = client.get(f"{NAS_BACKEND}/api/v1/activities")
    assert res.status_code == 200
    activities = res.json()
    assert len(activities) >= 1, "Expected activity timeline logs"

    first = activities[0]
    assert "activity_type" in first
    assert "title" in first
    assert "summary" in first
    assert "action_items" in first
    assert "opportunity_id" in first

def test_07_excel_template_downloads(client):
    """Verify downloadable Excel (.xlsx) and CSV templates."""
    # Excel template
    res_excel = client.get(f"{NAS_BACKEND}/api/v1/imports/template/accounts?format=excel")
    assert res_excel.status_code == 200
    assert "openxmlformats" in res_excel.headers.get("content-type", "")
    assert len(res_excel.content) > 1000

    # Parse with openpyxl to ensure valid XLSX structure
    wb = openpyxl.load_workbook(io.BytesIO(res_excel.content))
    ws = wb.active
    headers = [cell.value for cell in ws[1]]
    assert "name" in headers
    assert "type" in headers

    # CSV template
    res_csv = client.get(f"{NAS_BACKEND}/api/v1/imports/template/contacts?format=csv")
    assert res_csv.status_code == 200
    assert "text/csv" in res_csv.headers.get("content-type", "")
    assert "first_name" in res_csv.text

def test_08_excel_data_exports(client):
    """Verify exporting live CRM records to Excel workbook."""
    res = client.get(f"{NAS_BACKEND}/api/v1/exports/opportunities?format=excel")
    assert res.status_code == 200
    assert "openxmlformats" in res.headers.get("content-type", "")
    assert len(res.content) > 2000

    # Parse exported workbook and verify content
    wb = openpyxl.load_workbook(io.BytesIO(res.content))
    ws = wb.active
    headers = [cell.value for cell in ws[1]]
    assert "Opp ID" in headers
    assert "Project Code" in headers
    assert "Channel Partner / Disti" in headers
    assert ws.max_row >= 2, "Expected at least 1 exported opportunity row"

def test_09_post_new_activity_interaction(client):
    """Test dynamically adding a new interaction log to an existing opportunity."""
    opps_res = client.get(f"{NAS_BACKEND}/api/v1/opportunities")
    assert opps_res.status_code == 200
    opps = opps_res.json()
    assert len(opps) > 0
    opp = opps[0]

    payload = {
        "opportunity_id": opp["id"],
        "account_id": opp["account_id"],
        "activity_type": "Video Conference",
        "activity_date": "2026-10-25",
        "title": "Live NAS Automated Test - Executive Strategy Alignment",
        "attendees": "Lead QA Architect, Principal FAE",
        "summary": "Automated verification call confirming pipeline metrics and specs.",
        "action_items": "Deploy automated nightly test probe.",
        "follow_up_date": "2026-11-01"
    }

    res = client.post(f"{NAS_BACKEND}/api/v1/activities", json=payload)
    assert res.status_code == 201
    created = res.json()
    assert created["id"] > 0
    assert created["title"] == payload["title"]

def test_10_upload_pdf_attachment_to_live_activity(client):
    """Test uploading and downloading a PDF file attachment to a live activity on the NAS."""
    acts_res = client.get(f"{NAS_BACKEND}/api/v1/activities")
    assert acts_res.status_code == 200
    activities = acts_res.json()
    assert len(activities) > 0
    target_act = activities[0]

    # Upload PDF
    pdf_content = b"%PDF-1.4 Synology Live Attachment Test Content"
    files = {"file": ("test_report_live.pdf", io.BytesIO(pdf_content), "application/pdf")}
    up_res = client.post(f"{NAS_BACKEND}/api/v1/activities/{target_act['id']}/attachment", files=files)
    assert up_res.status_code == 200
    act_data = up_res.json()
    assert act_data["attachment_name"] == "test_report_live.pdf"
    assert act_data["attachment_size"] == len(pdf_content)

    # Download PDF back and verify contents
    dl_res = client.get(f"{NAS_BACKEND}/api/v1/activities/{target_act['id']}/attachment")
    assert dl_res.status_code == 200
    assert dl_res.content == pdf_content
    assert "application/pdf" in dl_res.headers.get("content-type", "")

def test_11_account_opportunities_with_open_closed_status(client):
    """Test querying opportunities per account and filtering by open/closed status."""
    accs_res = client.get(f"{NAS_BACKEND}/api/v1/accounts")
    assert accs_res.status_code == 200
    accounts = accs_res.json()
    ericsson = next((a for a in accounts if "Ericsson" in a["name"]), None)
    assert ericsson is not None

    opps_res = client.get(f"{NAS_BACKEND}/api/v1/opportunities?account_id={ericsson['id']}")
    assert opps_res.status_code == 200
    opps = opps_res.json()
    assert len(opps) >= 2

    # Separate into open vs closed
    open_opps = [o for o in opps if o["stage"] != "closed_lost"]
    closed_opps = [o for o in opps if o["stage"] == "closed_lost"]
    assert len(open_opps) >= 1
