from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    title = Column(String(100), nullable=True) # e.g. Chief Hardware Architect, Senior RF Engineer, Sourcing Director
    role_category = Column(String(50), default="Engineering Lead") # Engineering Lead, Procurement, Executive, FAE
    email = Column(String(150), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    linkedin = Column(String(255), nullable=True)
    is_primary = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    account = relationship("Account", back_populates="contacts")
    opportunities = relationship("Opportunity", back_populates="primary_contact")
