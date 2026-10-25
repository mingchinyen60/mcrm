from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class OpportunityBase(BaseModel):
    title: str
    project_code: Optional[str] = None
    account_id: int
    partner_account_id: Optional[int] = None
    primary_contact_id: Optional[int] = None
    tech_spec_id: Optional[int] = None
    stage: Optional[str] = "1_lead"
    estimated_revenue: Optional[float] = 0.0
    annual_volume_units: Optional[int] = 0
    currency: Optional[str] = "USD"
    confidence_percentage: Optional[int] = 20
    target_mp_date: Optional[str] = None
    target_application: Optional[str] = "IEEE 1588 PTP"
    description: Optional[str] = None
    competitor_notes: Optional[str] = None

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    project_code: Optional[str] = None
    account_id: Optional[int] = None
    partner_account_id: Optional[int] = None
    primary_contact_id: Optional[int] = None
    tech_spec_id: Optional[int] = None
    stage: Optional[str] = None
    estimated_revenue: Optional[float] = None
    annual_volume_units: Optional[int] = None
    currency: Optional[str] = None
    confidence_percentage: Optional[int] = None
    target_mp_date: Optional[str] = None
    target_application: Optional[str] = None
    description: Optional[str] = None
    competitor_notes: Optional[str] = None

class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: datetime
    account_name: Optional[str] = None
    partner_account_name: Optional[str] = None
    contact_name: Optional[str] = None
    part_number: Optional[str] = None
    active_samples_count: Optional[int] = 0
    activities_count: Optional[int] = 0
    latest_activity: Optional[str] = None

    class Config:
        from_attributes = True
