from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SampleRequestBase(BaseModel):
    opportunity_id: int
    tech_spec_id: Optional[int] = None
    sample_batch_code: str
    quantity: Optional[int] = 5
    status: Optional[str] = "requested"
    carrier: Optional[str] = "DHL Express"
    tracking_number: Optional[str] = None
    dispatch_date: Optional[str] = None
    delivery_date: Optional[str] = None
    test_phase: Optional[str] = "EVT"
    lab_test_results: Optional[str] = None
    customer_feedback: Optional[str] = None
    next_action: Optional[str] = None

class SampleRequestCreate(SampleRequestBase):
    pass

class SampleRequestUpdate(BaseModel):
    opportunity_id: Optional[int] = None
    tech_spec_id: Optional[int] = None
    sample_batch_code: Optional[str] = None
    quantity: Optional[int] = None
    status: Optional[str] = None
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    dispatch_date: Optional[str] = None
    delivery_date: Optional[str] = None
    test_phase: Optional[str] = None
    lab_test_results: Optional[str] = None
    customer_feedback: Optional[str] = None
    next_action: Optional[str] = None

class SampleRequestResponse(SampleRequestBase):
    id: int
    created_at: datetime
    updated_at: datetime
    opportunity_title: Optional[str] = None
    account_name: Optional[str] = None
    part_number: Optional[str] = None

    class Config:
        from_attributes = True
