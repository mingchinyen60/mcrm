from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.tech_spec import TechnicalSpec
from app.schemas.tech_spec import TechnicalSpecCreate, TechnicalSpecUpdate, TechnicalSpecResponse

router = APIRouter(prefix="/tech-specs", tags=["Technical Specs"])

@router.get("", response_model=List[TechnicalSpecResponse])
def get_technical_specs(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    package_type: Optional[str] = None,
    target_application: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(TechnicalSpec)
    if category:
        query = query.filter(TechnicalSpec.category == category)
    if package_type:
        query = query.filter(TechnicalSpec.package_type == package_type)
    if target_application:
        query = query.filter(TechnicalSpec.target_application == target_application)
    if search:
        query = query.filter(
            (TechnicalSpec.part_number.ilike(f"%{search}%")) |
            (TechnicalSpec.nominal_frequency.ilike(f"%{search}%")) |
            (TechnicalSpec.description.ilike(f"%{search}%"))
        )
    return query.order_by(TechnicalSpec.part_number.asc()).offset(skip).limit(limit).all()

@router.post("", response_model=TechnicalSpecResponse, status_code=201)
def create_technical_spec(spec_in: TechnicalSpecCreate, db: Session = Depends(get_db)):
    existing = db.query(TechnicalSpec).filter(TechnicalSpec.part_number == spec_in.part_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Part number already exists")
    
    spec = TechnicalSpec(**spec_in.model_dump())
    db.add(spec)
    db.commit()
    db.refresh(spec)
    return spec

@router.get("/{spec_id}", response_model=TechnicalSpecResponse)
def get_technical_spec(spec_id: int, db: Session = Depends(get_db)):
    spec = db.query(TechnicalSpec).filter(TechnicalSpec.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Technical specification not found")
    return spec

@router.put("/{spec_id}", response_model=TechnicalSpecResponse)
def update_technical_spec(spec_id: int, spec_in: TechnicalSpecUpdate, db: Session = Depends(get_db)):
    spec = db.query(TechnicalSpec).filter(TechnicalSpec.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Technical specification not found")
    
    update_data = spec_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(spec, field, value)
        
    db.commit()
    db.refresh(spec)
    return spec

@router.delete("/{spec_id}", status_code=204)
def delete_technical_spec(spec_id: int, db: Session = Depends(get_db)):
    spec = db.query(TechnicalSpec).filter(TechnicalSpec.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Technical specification not found")
    db.delete(spec)
    db.commit()
    return None
