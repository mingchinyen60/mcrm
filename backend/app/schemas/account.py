from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AccountBase(BaseModel):
    name: str
    type: Optional[str] = "OEM"
    industry: Optional[str] = "Telecommunications"
    tier: Optional[str] = "Tier 2"
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    region: Optional[str] = "North America"
    notes: Optional[str] = None

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    industry: Optional[str] = None
    tier: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    region: Optional[str] = None
    notes: Optional[str] = None

class AccountResponse(AccountBase):
    id: int
    created_at: datetime
    updated_at: datetime
    contacts_count: Optional[int] = 0
    opportunities_count: Optional[int] = 0

    class Config:
        from_attributes = True
