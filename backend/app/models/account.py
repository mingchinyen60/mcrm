from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(50), default="OEM") # OEM, ODM, Distributor, R&D Partner, Tier-1 Subsystem
    industry = Column(String(100), default="Telecommunications") # 5G / Telecom, Aerospace & Defense, Datacenter / AI, Instrumentation
    tier = Column(String(20), default="Tier 2") # Tier 1, Tier 2, Strategic
    website = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    region = Column(String(50), default="North America") # North America, EMEA, APAC, Domestic
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    contacts = relationship("Contact", back_populates="account", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", foreign_keys="[Opportunity.account_id]", back_populates="account", cascade="all, delete-orphan")
