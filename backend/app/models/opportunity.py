from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False) # e.g. "Next-Gen 5G O-RAN Baseband Unit PTP Master Clock"
    project_code = Column(String(50), nullable=True, index=True) # e.g. "PRJ-5G-DU-01"
    
    # End-Customer Account (e.g. Ericsson, Nokia OEM)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    
    # Channel Partner (Distributor / Sales Rep / ODM, e.g. Arrow, Avnet, Celestica)
    partner_account_id = Column(Integer, ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True)

    primary_contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True)
    tech_spec_id = Column(Integer, ForeignKey("technical_specs.id", ondelete="SET NULL"), nullable=True)

    # 5 High-Tech Design-Win Stages
    # 1_lead: Initial inquiry or account lead
    # 2_tech_discovery: Engineering requirements alignment, RFP/Spec matching
    # 3_sample_evaluation: EVT/DVT testing at customer lab
    # 4_design_win: Formally approved on customer Bill of Materials (BOM) / PVT
    # 5_mass_production: Sustained commercial shipments (MP)
    # closed_lost: Lost or disqualified
    stage = Column(String(50), default="1_lead", index=True)

    estimated_revenue = Column(Float, default=0.0) # Estimated total program value ($ USD)
    annual_volume_units = Column(Integer, default=0) # Estimated annual unit demand
    currency = Column(String(10), default="USD")
    confidence_percentage = Column(Integer, default=20) # 10% - 100%
    target_mp_date = Column(String(20), nullable=True) # e.g. "2025-Q4" or "2026-06"
    
    target_application = Column(String(100), default="IEEE 1588 PTP")
    description = Column(Text, nullable=True)
    competitor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    account = relationship("Account", foreign_keys=[account_id], back_populates="opportunities")
    partner_account = relationship("Account", foreign_keys=[partner_account_id])
    primary_contact = relationship("Contact", back_populates="opportunities")
    tech_spec = relationship("TechnicalSpec", back_populates="opportunities")
    samples = relationship("SampleRequest", back_populates="opportunity", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="opportunity", cascade="all, delete-orphan")
