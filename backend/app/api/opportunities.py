from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.opportunity import Opportunity
from app.models.account import Account
from app.models.contact import Contact
from app.models.tech_spec import TechnicalSpec
from app.models.sample import SampleRequest
from app.models.activity import Activity
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate, OpportunityResponse

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

def enrich_opportunity(o: Opportunity, db: Session) -> OpportunityResponse:
    item = OpportunityResponse.model_validate(o)
    if o.account:
        item.account_name = o.account.name
    if o.partner_account:
        item.partner_account_name = o.partner_account.name
    if o.primary_contact:
        item.contact_name = f"{o.primary_contact.first_name} {o.primary_contact.last_name}"
    if o.tech_spec:
        item.part_number = o.tech_spec.part_number
        
    item.active_samples_count = db.query(SampleRequest).filter(
        SampleRequest.opportunity_id == o.id,
        SampleRequest.status.notin_(["passed", "rejected"])
    ).count()

    item.activities_count = db.query(Activity).filter(Activity.opportunity_id == o.id).count()
    latest = db.query(Activity).filter(Activity.opportunity_id == o.id).order_by(Activity.activity_date.desc()).first()
    if latest:
        item.latest_activity = f"{latest.activity_type} ({latest.activity_date}): {latest.title}"

    return item

@router.get("", response_model=List[OpportunityResponse])
def get_opportunities(
    skip: int = 0,
    limit: int = 100,
    stage: Optional[str] = None,
    account_id: Optional[int] = None,
    partner_account_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)
    if stage:
        query = query.filter(Opportunity.stage == stage)
    if account_id:
        query = query.filter(Opportunity.account_id == account_id)
    if partner_account_id:
        query = query.filter(Opportunity.partner_account_id == partner_account_id)
    if search:
        query = query.filter(
            (Opportunity.title.ilike(f"%{search}%")) |
            (Opportunity.project_code.ilike(f"%{search}%")) |
            (Opportunity.target_application.ilike(f"%{search}%"))
        )
    
    opps = query.order_by(Opportunity.updated_at.desc()).offset(skip).limit(limit).all()
    return [enrich_opportunity(o, db) for o in opps]

@router.post("", response_model=OpportunityResponse, status_code=201)
def create_opportunity(opp_in: OpportunityCreate, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == opp_in.account_id).first()
    if not account:
        raise HTTPException(status_code=400, detail="Account not found")
        
    if opp_in.partner_account_id:
        partner = db.query(Account).filter(Account.id == opp_in.partner_account_id).first()
        if not partner:
            raise HTTPException(status_code=400, detail="Partner/Distributor account not found")
    
    opp = Opportunity(**opp_in.model_dump())
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return enrich_opportunity(opp, db)

@router.get("/{opp_id}", response_model=OpportunityResponse)
def get_opportunity(opp_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return enrich_opportunity(opp, db)

@router.put("/{opp_id}", response_model=OpportunityResponse)
def update_opportunity(opp_id: int, opp_in: OpportunityUpdate, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    update_data = opp_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(opp, field, value)
        
    db.commit()
    db.refresh(opp)
    return enrich_opportunity(opp, db)

@router.patch("/{opp_id}/stage", response_model=OpportunityResponse)
def update_opportunity_stage(opp_id: int, stage: str, db: Session = Depends(get_db)):
    valid_stages = ["1_lead", "2_tech_discovery", "3_sample_evaluation", "4_design_win", "5_mass_production", "closed_lost"]
    if stage not in valid_stages:
        raise HTTPException(status_code=400, detail=f"Invalid stage. Must be one of {valid_stages}")
        
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    opp.stage = stage
    db.commit()
    db.refresh(opp)
    return enrich_opportunity(opp, db)

@router.delete("/{opp_id}", status_code=204)
def delete_opportunity(opp_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opp)
    db.commit()
    return None
