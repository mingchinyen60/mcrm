from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import uuid
from app.core.database import get_db
from app.models.activity import Activity
from app.models.opportunity import Opportunity
from app.models.contact import Contact
from app.models.account import Account
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse

router = APIRouter(prefix="/activities", tags=["Activities & Interactions"])

# Attachment Storage Location
ATTACHMENTS_DIR = os.getenv(
    "ATTACHMENTS_DIR",
    "/app/attachments" if os.path.isdir("/app") else os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "attachments"))
)
os.makedirs(ATTACHMENTS_DIR, exist_ok=True)

@router.get("", response_model=List[ActivityResponse])
def get_activities(
    skip: int = 0,
    limit: int = 100,
    opportunity_id: Optional[int] = None,
    account_id: Optional[int] = None,
    activity_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if opportunity_id:
        query = query.filter(Activity.opportunity_id == opportunity_id)
    if account_id:
        query = query.filter(Activity.account_id == account_id)
    if activity_type:
        query = query.filter(Activity.activity_type == activity_type)
        
    activities = query.order_by(Activity.activity_date.desc(), Activity.created_at.desc()).offset(skip).limit(limit).all()
    res = []
    for a in activities:
        item = ActivityResponse.model_validate(a)
        if a.contact:
            item.contact_name = f"{a.contact.first_name} {a.contact.last_name}"
        if a.account:
            item.account_name = a.account.name
        elif a.opportunity and a.opportunity.account:
            item.account_name = a.opportunity.account.name
        res.append(item)
    return res

@router.post("", response_model=ActivityResponse, status_code=201)
def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == activity_in.opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=400, detail="Opportunity not found")
        
    data = activity_in.model_dump()
    # Auto-link account from opportunity if not explicitly provided
    if not data.get("account_id") and opp.account_id:
        data["account_id"] = opp.account_id
        
    activity = Activity(**data)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    
    item = ActivityResponse.model_validate(activity)
    if activity.contact:
        item.contact_name = f"{activity.contact.first_name} {activity.contact.last_name}"
    if activity.account:
        item.account_name = activity.account.name
    elif opp.account:
        item.account_name = opp.account.name
    return item

@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity record not found")
    item = ActivityResponse.model_validate(activity)
    if activity.contact:
        item.contact_name = f"{activity.contact.first_name} {activity.contact.last_name}"
    if activity.account:
        item.account_name = activity.account.name
    return item

@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(activity_id: int, activity_in: ActivityUpdate, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity record not found")
        
    update_data = activity_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)
        
    db.commit()
    db.refresh(activity)
    
    item = ActivityResponse.model_validate(activity)
    if activity.contact:
        item.contact_name = f"{activity.contact.first_name} {activity.contact.last_name}"
    if activity.account:
        item.account_name = activity.account.name
    return item

@router.delete("/{activity_id}", status_code=204)
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity record not found")
    if activity.attachment_path and os.path.exists(activity.attachment_path):
        try:
            os.remove(activity.attachment_path)
        except Exception:
            pass
    db.delete(activity)
    db.commit()
    return None

@router.post("/{activity_id}/attachment", response_model=ActivityResponse)
async def upload_activity_attachment(activity_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity record not found")

    # Clean old file if replacing
    if activity.attachment_path and os.path.exists(activity.attachment_path):
        try:
            os.remove(activity.attachment_path)
        except Exception:
            pass

    safe_name = os.path.basename(file.filename or "attachment.pdf").replace(" ", "_")
    unique_filename = f"act_{activity_id}_{uuid.uuid4().hex[:8]}_{safe_name}"
    target_path = os.path.join(ATTACHMENTS_DIR, unique_filename)

    contents = await file.read()
    with open(target_path, "wb") as f:
        f.write(contents)

    activity.attachment_path = target_path
    activity.attachment_name = file.filename
    activity.attachment_size = len(contents)

    db.commit()
    db.refresh(activity)

    item = ActivityResponse.model_validate(activity)
    if activity.contact:
        item.contact_name = f"{activity.contact.first_name} {activity.contact.last_name}"
    if activity.account:
        item.account_name = activity.account.name
    return item

@router.get("/{activity_id}/attachment")
def download_activity_attachment(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity or not activity.attachment_path:
        raise HTTPException(status_code=404, detail="No attachment associated with this activity")

    if not os.path.exists(activity.attachment_path):
        raise HTTPException(status_code=404, detail="Attachment file not found on disk")

    media_type = "application/pdf" if (activity.attachment_name and activity.attachment_name.lower().endswith(".pdf")) else "application/octet-stream"
    return FileResponse(
        path=activity.attachment_path,
        filename=activity.attachment_name or "attachment.pdf",
        media_type=media_type
    )

@router.delete("/{activity_id}/attachment", response_model=ActivityResponse)
def remove_activity_attachment(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity record not found")

    if activity.attachment_path and os.path.exists(activity.attachment_path):
        try:
            os.remove(activity.attachment_path)
        except Exception:
            pass

    activity.attachment_path = None
    activity.attachment_name = None
    activity.attachment_size = None
    db.commit()
    db.refresh(activity)

    item = ActivityResponse.model_validate(activity)
    if activity.contact:
        item.contact_name = f"{activity.contact.first_name} {activity.contact.last_name}"
    if activity.account:
        item.account_name = activity.account.name
    return item
