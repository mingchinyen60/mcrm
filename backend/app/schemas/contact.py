from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactBase(BaseModel):
    account_id: int
    first_name: str
    last_name: str
    title: Optional[str] = None
    role_category: Optional[str] = "Engineering Lead"
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    is_primary: Optional[bool] = False
    notes: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    account_id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    title: Optional[str] = None
    role_category: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    is_primary: Optional[bool] = None
    notes: Optional[str] = None

class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    updated_at: datetime
    account_name: Optional[str] = None

    class Config:
        from_attributes = True
