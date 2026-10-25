from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class SampleRequest(Base):
    __tablename__ = "sample_requests"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    tech_spec_id = Column(Integer, ForeignKey("technical_specs.id", ondelete="SET NULL"), nullable=True)
    
    sample_batch_code = Column(String(50), nullable=False) # e.g. "SMP-2025-001"
    quantity = Column(Integer, default=5)
    
    # Status Lifecycle: requested -> preparing -> dispatched -> delivered -> testing -> passed -> revision_needed -> rejected
    status = Column(String(50), default="requested", index=True)
    
    carrier = Column(String(50), default="DHL Express")
    tracking_number = Column(String(100), nullable=True)
    dispatch_date = Column(String(20), nullable=True) # YYYY-MM-DD
    delivery_date = Column(String(20), nullable=True) # YYYY-MM-DD
    
    # Engineering Evaluation & Customer Feedback
    test_phase = Column(String(20), default="EVT") # EVT, DVT, PVT
    lab_test_results = Column(Text, nullable=True) # Phase noise verified, frequency stability vs temp logs, etc.
    customer_feedback = Column(Text, nullable=True)
    next_action = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="samples")
    tech_spec = relationship("TechnicalSpec", back_populates="samples")
