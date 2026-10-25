from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.contact import Contact
from app.models.account import Account
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.get("", response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    account_id: Optional[int] = None,
    role_category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Contact)
    if account_id:
        query = query.filter(Contact.account_id == account_id)
    if role_category:
        query = query.filter(Contact.role_category == role_category)
    if search:
        query = query.filter(
            (Contact.first_name.ilike(f"%{search}%")) |
            (Contact.last_name.ilike(f"%{search}%")) |
            (Contact.email.ilike(f"%{search}%"))
        )
    
    contacts = query.order_by(Contact.last_name.asc()).offset(skip).limit(limit).all()
    res = []
    for c in contacts:
        item = ContactResponse.model_validate(c)
        if c.account:
            item.account_name = c.account.name
        res.append(item)
    return res

@router.post("", response_model=ContactResponse, status_code=201)
def create_contact(contact_in: ContactCreate, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == contact_in.account_id).first()
    if not account:
        raise HTTPException(status_code=400, detail="Account not found")
    
    contact = Contact(**contact_in.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    res = ContactResponse.model_validate(contact)
    res.account_name = account.name
    return res

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    res = ContactResponse.model_validate(contact)
    if contact.account:
        res.account_name = contact.account.name
    return res

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: int, contact_in: ContactUpdate, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    update_data = contact_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact, field, value)
        
    db.commit()
    db.refresh(contact)
    res = ContactResponse.model_validate(contact)
    if contact.account:
        res.account_name = contact.account.name
    return res

@router.delete("/{contact_id}", status_code=204)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return None
