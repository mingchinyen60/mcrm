import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os
import io

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.database import Base, get_db
from app.models.account import Account

# Use an in-memory SQLite database with StaticPool so all connections share the same memory DB
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_create_and_get_account():
    payload = {
        "name": "Acme Aerospace",
        "type": "OEM",
        "industry": "Aerospace & Defense",
        "tier": "Tier 1",
        "website": "https://acme.example.com",
        "region": "North America"
    }
    create_res = client.post("/api/v1/accounts", json=payload)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["name"] == "Acme Aerospace"
    account_id = data["id"]

    get_res = client.get(f"/api/v1/accounts/{account_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Acme Aerospace"

def test_create_tech_spec_and_opportunity():
    acc_res = client.post("/api/v1/accounts", json={"name": "Telecom Test Corp"})
    acc_id = acc_res.json()["id"]

    spec_payload = {
        "part_number": "OCXO-TEST-001",
        "category": "OCXO",
        "nominal_frequency": "10.000 MHz",
        "frequency_stability": "±0.1 ppb",
        "package_type": "HC40",
        "phase_noise_100hz": -142.5
    }
    spec_res = client.post("/api/v1/tech-specs", json=spec_payload)
    assert spec_res.status_code == 201
    spec_id = spec_res.json()["id"]

    opp_payload = {
        "title": "5G Master Clock Win",
        "account_id": acc_id,
        "tech_spec_id": spec_id,
        "stage": "2_tech_discovery",
        "estimated_revenue": 500000.0,
        "confidence_percentage": 50
    }
    opp_res = client.post("/api/v1/opportunities", json=opp_payload)
    assert opp_res.status_code == 201
    opp_id = opp_res.json()["id"]

    patch_res = client.patch(f"/api/v1/opportunities/{opp_id}/stage?stage=3_sample_evaluation")
    assert patch_res.status_code == 200
    assert patch_res.json()["stage"] == "3_sample_evaluation"

    sample_payload = {
        "opportunity_id": opp_id,
        "tech_spec_id": spec_id,
        "sample_batch_code": "SMP-TEST-99",
        "quantity": 5,
        "status": "testing"
    }
    sample_res = client.post("/api/v1/samples", json=sample_payload)
    assert sample_res.status_code == 201
    assert sample_res.json()["sample_batch_code"] == "SMP-TEST-99"

def test_dashboard_metrics():
    res = client.get("/api/v1/dashboard/metrics")
    assert res.status_code == 200
    metrics = res.json()
    assert "total_accounts" in metrics
    assert "stage_breakdown" in metrics
    assert "total_pipeline_value" in metrics

# =========================================================================
# AUDIT TESTS FOR 4 NEW FEATURES
# =========================================================================

def test_feature1_multi_project_and_channel_partner():
    """Audit Feature 1: Multi-project tracking & Partner Account ID."""
    # 1. Create OEM and Distributor
    oem_res = client.post("/api/v1/accounts", json={"name": "Ericsson Networks", "type": "OEM"})
    disti_res = client.post("/api/v1/accounts", json={"name": "Arrow Electronics", "type": "Distributor"})
    oem_id = oem_res.json()["id"]
    disti_id = disti_res.json()["id"]

    # 2. Create Opportunity linking to both OEM and Channel Partner with Project Code
    opp_payload = {
        "title": "O-RAN DU Baseband Timing",
        "project_code": "PRJ-5G-DU-01",
        "account_id": oem_id,
        "partner_account_id": disti_id,
        "stage": "2_tech_discovery",
        "estimated_revenue": 750000.0,
        "confidence_percentage": 60
    }
    opp_res = client.post("/api/v1/opportunities", json=opp_payload)
    assert opp_res.status_code == 201
    data = opp_res.json()
    assert data["project_code"] == "PRJ-5G-DU-01"
    assert data["partner_account_id"] == disti_id
    assert data["partner_account_name"] == "Arrow Electronics"
    opp_id = data["id"]

    # 3. Test filtering by partner_account_id
    filter_res = client.get(f"/api/v1/opportunities?partner_account_id={disti_id}")
    assert filter_res.status_code == 200
    assert len(filter_res.json()) >= 1
    assert filter_res.json()[0]["id"] == opp_id

    # 4. Test searching by project_code
    search_res = client.get("/api/v1/opportunities?search=PRJ-5G-DU")
    assert search_res.status_code == 200
    assert len(search_res.json()) >= 1
    assert search_res.json()[0]["project_code"] == "PRJ-5G-DU-01"

    # 5. Invalid partner account returns 400
    bad_opp = {
        "title": "Invalid Partner Opp",
        "account_id": oem_id,
        "partner_account_id": 999999
    }
    bad_res = client.post("/api/v1/opportunities", json=bad_opp)
    assert bad_res.status_code == 400
    assert "Partner/Distributor" in bad_res.json()["detail"]

def test_feature2_activities_and_meeting_details():
    """Audit Feature 2: Interaction History, Meeting Minutes, and Action Items."""
    # 1. Setup account & opp
    acc_res = client.post("/api/v1/accounts", json={"name": "Nokia Mobile Networks"})
    acc_id = acc_res.json()["id"]
    opp_res = client.post("/api/v1/opportunities", json={"title": "Nokia 5G BBU Clock", "account_id": acc_id})
    opp_id = opp_res.json()["id"]

    # 2. Create Activity
    act_payload = {
        "opportunity_id": opp_id,
        "activity_type": "Lab Visit",
        "activity_date": "2026-10-25",
        "title": "Espoo Lab Phase Noise Bench Review",
        "attendees": "Mikko (Nokia), Dave (FAE)",
        "summary": "Verified -145 dBc/Hz @ 100Hz phase noise floor in temperature chamber.",
        "action_items": "Submit revised soldering profile",
        "follow_up_date": "2026-10-31"
    }
    act_res = client.post("/api/v1/activities", json=act_payload)
    assert act_res.status_code == 201
    act_data = act_res.json()
    assert act_data["activity_type"] == "Lab Visit"
    assert act_data["summary"].startswith("Verified")
    assert act_data["account_name"] == "Nokia Mobile Networks"
    act_id = act_data["id"]

    # 3. Verify Opportunity enrichment has latest_activity and activities_count
    opp_check = client.get(f"/api/v1/opportunities/{opp_id}")
    assert opp_check.status_code == 200
    assert opp_check.json()["activities_count"] == 1
    assert "Lab Visit" in opp_check.json()["latest_activity"]

    # 4. List activities filtered by opportunity_id
    list_res = client.get(f"/api/v1/activities?opportunity_id={opp_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # 4b. Upload PDF Attachment to activity
    pdf_dummy_bytes = b"%PDF-1.4 dummy meeting minutes test content"
    att_files = {"file": ("meeting_notes.pdf", io.BytesIO(pdf_dummy_bytes), "application/pdf")}
    att_res = client.post(f"/api/v1/activities/{act_id}/attachment", files=att_files)
    assert att_res.status_code == 200
    assert att_res.json()["attachment_name"] == "meeting_notes.pdf"
    assert att_res.json()["attachment_size"] == len(pdf_dummy_bytes)

    # 4c. Download Attachment
    dl_res = client.get(f"/api/v1/activities/{act_id}/attachment")
    assert dl_res.status_code == 200
    assert dl_res.content == pdf_dummy_bytes
    assert "application/pdf" in dl_res.headers.get("content-type", "")

    # 5. Delete activity
    del_res = client.delete(f"/api/v1/activities/{act_id}")
    assert del_res.status_code == 204

def test_feature3_batch_upload_templates_and_import():
    """Audit Feature 3: Batch Upload Templates and CSV / Excel parsing."""
    # 1. Check template endpoints for accounts, contacts, and tech_specs
    for entity in ["accounts", "contacts", "tech_specs"]:
        csv_tpl = client.get(f"/api/v1/imports/template/{entity}?format=csv")
        assert csv_tpl.status_code == 200
        assert "text/csv" in csv_tpl.headers["content-type"]

        xlsx_tpl = client.get(f"/api/v1/imports/template/{entity}?format=excel")
        assert xlsx_tpl.status_code == 200
        assert "openxmlformats" in xlsx_tpl.headers["content-type"]

    # 2. Upload CSV batch of accounts
    csv_content = (
        "name,type,industry,tier,region,website,phone,email,address,notes\n"
        "Batch OEM Alpha,OEM,Aerospace & Defense,Tier 1,North America,https://alpha.com,+123,a@a.com,Denver,Notes Alpha\n"
        "Batch Disti Beta,Distributor,Distribution,Tier 2,EMEA,https://beta.com,+456,b@b.com,Munich,Notes Beta\n"
    )
    files = {"file": ("accounts.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    upload_res = client.post("/api/v1/imports/accounts", files=files)
    assert upload_res.status_code == 200
    assert upload_res.json()["created_count"] == 2
    assert upload_res.json()["success"] is True

    # 3. Upload CSV batch of tech_specs
    spec_csv = (
        "part_number,category,nominal_frequency,frequency_stability,package_type,supply_voltage,output_logic,jitter_spec,phase_noise_10hz,phase_noise_100hz,phase_noise_1khz,phase_noise_10khz,phase_noise_100khz,phase_noise_1mhz,target_application,description\n"
        "OCXO-BATCH-01,OCXO,10.000 MHz,±0.1 ppb,HC40,3.3V,CMOS,< 40 fs,-115,-140,-158,-165,-168,-170,IEEE 1588 PTP,Batch imported spec\n"
    )
    spec_files = {"file": ("specs.csv", io.BytesIO(spec_csv.encode("utf-8")), "text/csv")}
    spec_upload_res = client.post("/api/v1/imports/tech-specs", files=spec_files)
    assert spec_upload_res.status_code == 200
    assert spec_upload_res.json()["created_count"] == 1

def test_feature4_exports_excel_and_csv():
    """Audit Feature 4: Excel and CSV export generation and formatting."""
    # Seed one account and opp to have exportable rows
    acc_res = client.post("/api/v1/accounts", json={"name": "Export Test OEM"})
    client.post("/api/v1/opportunities", json={"title": "Export Test Opp", "account_id": acc_res.json()["id"]})

    endpoints = ["opportunities", "accounts", "tech-specs", "samples"]
    for ep in endpoints:
        # Excel
        res_excel = client.get(f"/api/v1/exports/{ep}?format=excel")
        assert res_excel.status_code == 200
        assert "openxmlformats" in res_excel.headers["content-type"]
        assert len(res_excel.content) > 1000 # Excel file binary bytes

        # CSV
        res_csv = client.get(f"/api/v1/exports/{ep}?format=csv")
        assert res_csv.status_code == 200
        assert "text/csv" in res_csv.headers["content-type"]
        assert len(res_csv.content) > 10
