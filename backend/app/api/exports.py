import io
import csv
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from app.core.database import get_db
from app.models.opportunity import Opportunity
from app.models.account import Account
from app.models.contact import Contact
from app.models.tech_spec import TechnicalSpec
from app.models.sample import SampleRequest
from app.models.activity import Activity

router = APIRouter(prefix="/exports", tags=["Data Exports & Downloads"])

def create_styled_excel(sheet_title: str, headers: list, rows: list) -> io.BytesIO:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = sheet_title

    # Header style
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1F497D", end_color="1F497D", fill_type="solid")
    center_align = Alignment(horizontal="center", vertical="center")
    
    ws.append(headers)
    for col_num in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_num)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align

    for r in rows:
        ws.append(r)

    # Adjust column widths
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 40)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output

def create_csv_response(headers: list, rows: list) -> io.BytesIO:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(headers)
    for r in rows:
        writer.writerow(r)
    output.seek(0)
    return io.BytesIO(output.getvalue().encode("utf-8-sig"))

@router.get("/opportunities")
def export_opportunities(format: str = Query("excel", pattern="^(excel|csv)$"), db: Session = Depends(get_db)):
    headers = [
        "Opp ID", "Project Code", "Opportunity Title", "End Customer OEM", "Channel Partner / Disti",
        "Part Number", "Design Phase Stage", "Revenue ($ USD)", "Confidence %", "Target MP Date",
        "Application", "Active Samples", "Total Interactions", "Latest Interaction", "Last Updated"
    ]
    opps = db.query(Opportunity).order_by(Opportunity.updated_at.desc()).all()
    rows = []
    for o in opps:
        partner_name = o.partner_account.name if o.partner_account else "Direct"
        part = o.tech_spec.part_number if o.tech_spec else "N/A"
        samples_cnt = db.query(SampleRequest).filter(SampleRequest.opportunity_id == o.id, SampleRequest.status.notin_(["passed", "rejected"])).count()
        acts_cnt = db.query(Activity).filter(Activity.opportunity_id == o.id).count()
        latest = db.query(Activity).filter(Activity.opportunity_id == o.id).order_by(Activity.activity_date.desc()).first()
        latest_str = f"{latest.activity_type} ({latest.activity_date}): {latest.title}" if latest else "No interactions logged"
        
        rows.append([
            o.id,
            o.project_code or "N/A",
            o.title,
            o.account.name if o.account else "N/A",
            partner_name,
            part,
            o.stage,
            o.estimated_revenue or 0.0,
            f"{o.confidence_percentage}%",
            o.target_mp_date or "TBD",
            o.target_application or "",
            samples_cnt,
            acts_cnt,
            latest_str,
            o.updated_at.strftime("%Y-%m-%d %H:%M") if o.updated_at else ""
        ])

    if format == "excel":
        file_bytes = create_styled_excel("Design Programs", headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=crm_design_programs_pipeline.xlsx"}
        )
    else:
        file_bytes = create_csv_response(headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=crm_design_programs_pipeline.csv"}
        )

@router.get("/accounts")
def export_accounts(format: str = Query("excel", pattern="^(excel|csv)$"), db: Session = Depends(get_db)):
    headers = [
        "Account ID", "Organization Name", "Account Type", "Industry", "Tier", 
        "Region", "Website", "Phone", "Email", "Headquarters Address", "Contacts Count", "Active Opps Count"
    ]
    accounts = db.query(Account).order_by(Account.name.asc()).all()
    rows = []
    for a in accounts:
        c_count = db.query(Contact).filter(Contact.account_id == a.id).count()
        o_count = db.query(Opportunity).filter(Opportunity.account_id == a.id).count()
        rows.append([
            a.id, a.name, a.type, a.industry, a.tier, a.region,
            a.website or "", a.phone or "", a.email or "", a.address or "",
            c_count, o_count
        ])

    if format == "excel":
        file_bytes = create_styled_excel("Accounts Directory", headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=crm_accounts_directory.xlsx"}
        )
    else:
        file_bytes = create_csv_response(headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=crm_accounts_directory.csv"}
        )

@router.get("/tech-specs")
def export_tech_specs(format: str = Query("excel", pattern="^(excel|csv)$"), db: Session = Depends(get_db)):
    headers = [
        "Part Number", "Oscillator Type", "Nominal Freq", "Stability", "Package",
        "Phase Noise 10Hz", "100Hz", "1kHz", "10kHz", "100kHz", "1MHz",
        "Jitter Spec", "Supply Voltage", "Output Logic", "Temp Range", "Application", "Datasheet URL"
    ]
    specs = db.query(TechnicalSpec).order_by(TechnicalSpec.part_number.asc()).all()
    rows = []
    for s in specs:
        rows.append([
            s.part_number, s.category, s.nominal_frequency, s.frequency_stability, s.package_type,
            s.phase_noise_10hz or "-", s.phase_noise_100hz or "-", s.phase_noise_1khz or "-",
            s.phase_noise_10khz or "-", s.phase_noise_100khz or "-", s.phase_noise_1mhz or "-",
            s.jitter_spec or "", s.supply_voltage or "", s.output_logic or "",
            s.operating_temp_range or "", s.target_application or "", s.datasheet_url or ""
        ])

    if format == "excel":
        file_bytes = create_styled_excel("Frequency Components", headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=crm_technical_specifications.xlsx"}
        )
    else:
        file_bytes = create_csv_response(headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=crm_technical_specifications.csv"}
        )

@router.get("/samples")
def export_samples(format: str = Query("excel", pattern="^(excel|csv)$"), db: Session = Depends(get_db)):
    headers = [
        "Sample Batch Code", "Opportunity Title", "End Customer OEM", "Component Part Number",
        "Test Phase (EVT/DVT)", "Status", "Quantity (pcs)", "Carrier", "Tracking Number",
        "Dispatch Date", "Delivery Date", "Lab Test Results", "Customer Feedback", "Next Action"
    ]
    samples = db.query(SampleRequest).order_by(SampleRequest.created_at.desc()).all()
    rows = []
    for s in samples:
        opp_title = s.opportunity.title if s.opportunity else "N/A"
        acc_name = s.opportunity.account.name if s.opportunity and s.opportunity.account else "N/A"
        part = s.tech_spec.part_number if s.tech_spec else "N/A"
        rows.append([
            s.sample_batch_code, opp_title, acc_name, part, s.test_phase, s.status, s.quantity,
            s.carrier or "", s.tracking_number or "", s.dispatch_date or "", s.delivery_date or "",
            s.lab_test_results or "", s.customer_feedback or "", s.next_action or ""
        ])

    if format == "excel":
        file_bytes = create_styled_excel("Sample Evaluations", headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=crm_sample_evaluations.xlsx"}
        )
    else:
        file_bytes = create_csv_response(headers, rows)
        return StreamingResponse(
            file_bytes,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=crm_sample_evaluations.csv"}
        )
