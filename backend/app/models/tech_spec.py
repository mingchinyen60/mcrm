from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class TechnicalSpec(Base):
    __tablename__ = "technical_specs"

    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(50), default="OCXO") # OCXO, TCXO, CSAC / Atomic, VCXO, Crystal Resonator
    description = Column(Text, nullable=True)
    
    # Core High-Precision RF / Frequency Attributes
    nominal_frequency = Column(String(50), nullable=False) # e.g. "10.000 MHz", "100.000 MHz", "122.88 MHz"
    frequency_stability = Column(String(50), nullable=False) # e.g. "±0.1 ppb", "±0.5 ppm"
    
    # Detailed Phase Noise Profile (dBc/Hz)
    phase_noise_10hz = Column(Float, nullable=True) # e.g. -115.0
    phase_noise_100hz = Column(Float, nullable=True) # e.g. -140.0
    phase_noise_1khz = Column(Float, nullable=True) # e.g. -158.0
    phase_noise_10khz = Column(Float, nullable=True) # e.g. -165.0
    phase_noise_100khz = Column(Float, nullable=True) # e.g. -168.0
    phase_noise_1mhz = Column(Float, nullable=True) # e.g. -170.0
    
    # Timing & Jitter
    jitter_spec = Column(String(50), nullable=True) # e.g. "< 50 fs RMS (12kHz to 20MHz)"
    
    # Electrical & Mechanical
    supply_voltage = Column(String(20), default="3.3V") # 3.3V, 5.0V, 12.0V
    output_logic = Column(String(30), default="CMOS") # CMOS, LVPECL, LVDS, Clipped Sine, Sine Wave
    package_type = Column(String(50), default="SMD 7050") # HC40, CSAC, SMD 7050, SMD 5032, SMD 3225, DIP-14
    operating_temp_range = Column(String(50), default="-40°C to +85°C")
    
    # Target Application
    target_application = Column(String(100), default="5G Infrastructure") # IEEE 1588 PTP, 5G Infrastructure, Radar/Aerospace, Datacenter AI Timing
    datasheet_url = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    opportunities = relationship("Opportunity", back_populates="tech_spec")
    samples = relationship("SampleRequest", back_populates="tech_spec")
