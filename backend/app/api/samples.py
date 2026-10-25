from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.sample import SampleRequest
from app.models.opportunity import Opportunity
from app.models.tech_spec import TechnicalSpec
from app.schemas.sample import SampleRequestCreate, SampleRequestUpdate, SampleRequestResponse

router = APIRouter(prefix="/samples", tags=["Samples"])

@router.get("", response_model=List[SampleRequestResponse])
def get_samples(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    opportunity_id: Optional[int] = None,
    test_phase: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SampleRequest)
    if status:
        query = query.filter(SampleRequest.status == status)
    if opportunity_id:
        query = query.filter(SampleRequest.opportunity_id == opportunity_id)
    if test_phase:
        query = query.filter(SampleRequest.test_phase == test_phase)
    if search:
        query = query.filter(
            (SampleRequest.sample_batch_code.ilike(f"%{search}%")) |
            (SampleRequest.tracking_number.ilike(f"%{search}%"))
        )
        
    samples = query.order_by(SampleRequest.created_at.desc()).offset(skip).limit(limit).all()
    res = []
    for s in samples:
        item = SampleRequestResponse.model_validate(s)
        if s.opportunity:
            item.opportunity_title = s.opportunity.title
            if s.opportunity.account:
                item.account_name = s.opportunity.account.name
        if s.tech_spec:
            item.part_number = s.tech_spec.part_number
        res.append(item)
    return res

@router.post("", response_model=SampleRequestResponse, status_code=201)
def create_sample(sample_in: SampleRequestCreate, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == sample_in.opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=400, detail="Opportunity not found")
    
    # Auto-fill tech_spec from opportunity if not provided
    sample_data = sample_in.model_dump()
    if not sample_data.get("tech_spec_id") and opp.tech_spec_id:
        sample_data["tech_spec_id"] = opp.tech_spec_id
        
    sample = SampleRequest(**sample_data)
    db.add(sample)
    db.commit()
    db.refresh(sample)
    
    item = SampleRequestResponse.model_validate(sample)
    item.opportunity_title = opp.title
    if opp.account:
        item.account_name = opp.account.name
    if sample.tech_spec:
        item.part_number = sample.tech_spec.part_number
    return item

@router.get("/{sample_id}", response_model=SampleRequestResponse)
def get_sample(sample_id: int, db: Session = Depends(get_db)):
    sample = db.query(SampleRequest).filter(SampleRequest.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Sample request not found")
        
    item = SampleRequestResponse.model_validate(sample)
    if sample.opportunity:
        item.opportunity_title = sample.opportunity.title
        if sample.opportunity.account:
            item.account_name = sample.opportunity.account.name
    if sample.tech_spec:
        item.part_number = sample.tech_spec.part_number
    return item

@router.put("/{sample_id}", response_model=SampleRequestResponse)
def update_sample(sample_id: int, sample_in: SampleRequestUpdate, db: Session = Depends(get_db)):
    sample = db.query(SampleRequest).filter(SampleRequest.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Sample request not found")
        
    update_data = sample_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sample, field, value)
        
    db.commit()
    db.refresh(sample)
    
    item = SampleRequestResponse.model_validate(sample)
    if sample.opportunity:
        item.opportunity_title = sample.opportunity.title
        if sample.opportunity.account:
            item.account_name = sample.opportunity.account.name
    if sample.tech_spec:
        item.part_number = sample.tech_spec.part_number
    return item

@router.delete("/{sample_id}", status_code=204)
def delete_sample(sample_id: int, db: Session = Depends(get_db)):
    sample = db.query(SampleRequest).filter(SampleRequest.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Sample request not found")
    db.delete(sample)
    db.commit()
    return None
