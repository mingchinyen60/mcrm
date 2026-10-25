from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.account import Account
from app.models.contact import Contact
from app.models.opportunity import Opportunity
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.get("", response_model=List[AccountResponse])
def get_accounts(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    industry: Optional[str] = None,
    tier: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Account)
    if search:
        query = query.filter(Account.name.ilike(f"%{search}%"))
    if industry:
        query = query.filter(Account.industry == industry)
    if tier:
        query = query.filter(Account.tier == tier)
    
    accounts = query.order_by(Account.name.asc()).offset(skip).limit(limit).all()
    
    # Enrich with counts
    result = []
    for acc in accounts:
        c_count = db.query(Contact).filter(Contact.account_id == acc.id).count()
        o_count = db.query(Opportunity).filter(Opportunity.account_id == acc.id).count()
        acc_dict = AccountResponse.model_validate(acc)
        acc_dict.contacts_count = c_count
        acc_dict.opportunities_count = o_count
        result.append(acc_dict)
    return result

@router.post("", response_model=AccountResponse, status_code=201)
def create_account(account_in: AccountCreate, db: Session = Depends(get_db)):
    account = Account(**account_in.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    res = AccountResponse.model_validate(account)
    res.contacts_count = 0
    res.opportunities_count = 0
    return res

@router.get("/{account_id}", response_model=AccountResponse)
def get_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    c_count = db.query(Contact).filter(Contact.account_id == account.id).count()
    o_count = db.query(Opportunity).filter(Opportunity.account_id == account.id).count()
    res = AccountResponse.model_validate(account)
    res.contacts_count = c_count
    res.opportunities_count = o_count
    return res

@router.put("/{account_id}", response_model=AccountResponse)
def update_account(account_id: int, account_in: AccountUpdate, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    update_data = account_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(account, field, value)
    
    db.commit()
    db.refresh(account)
    c_count = db.query(Contact).filter(Contact.account_id == account.id).count()
    o_count = db.query(Opportunity).filter(Opportunity.account_id == account.id).count()
    res = AccountResponse.model_validate(account)
    res.contacts_count = c_count
    res.opportunities_count = o_count
    return res

@router.delete("/{account_id}", status_code=204)
def delete_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return None
