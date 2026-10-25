from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    opportunity_id: int
    account_id: Optional[int] = None
    contact_id: Optional[int] = None
    activity_type: Optional[str] = "Meeting"
    activity_date: str
    title: str
    attendees: Optional[str] = None
    summary: str
    action_items: Optional[str] = None
    follow_up_date: Optional[str] = None
    attachment_path: Optional[str] = None
    attachment_name: Optional[str] = None
    attachment_size: Optional[int] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    opportunity_id: Optional[int] = None
    account_id: Optional[int] = None
    contact_id: Optional[int] = None
    activity_type: Optional[str] = None
    activity_date: Optional[str] = None
    title: Optional[str] = None
    attendees: Optional[str] = None
    summary: Optional[str] = None
    action_items: Optional[str] = None
    follow_up_date: Optional[str] = None
    attachment_path: Optional[str] = None
    attachment_name: Optional[str] = None
    attachment_size: Optional[int] = None

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime
    updated_at: datetime
    contact_name: Optional[str] = None
    account_name: Optional[str] = None

    class Config:
        from_attributes = True
