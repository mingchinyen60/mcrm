from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True)
    contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True)

    # Activity Type: Meeting (F2F), Phone Call, Video Conference, Email, Lab Visit, Tech Review, Quote/RFP
    activity_type = Column(String(50), default="Meeting", index=True)
    activity_date = Column(String(30), nullable=False) # e.g. "2026-10-25" or ISO string
    title = Column(String(200), nullable=False) # e.g. "Stockholm R&D Lab - Phase Noise Floor Review"
    attendees = Column(String(255), nullable=True) # e.g. "Lars Lindqvist (Ericsson), Dave (FAE)"
    
    summary = Column(Text, nullable=False) # Meeting minutes, technical discussion, customer feedback
    action_items = Column(Text, nullable=True) # Follow-up deliverables
    follow_up_date = Column(String(30), nullable=True) # Due date for action items

    # Attachment Support (PDF, meeting minutes, test reports, datasheets)
    attachment_path = Column(String(500), nullable=True)
    attachment_name = Column(String(255), nullable=True)
    attachment_size = Column(Integer, nullable=True) # in bytes

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="activities")
    contact = relationship("Contact")
    account = relationship("Account")
