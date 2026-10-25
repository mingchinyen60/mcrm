from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TechnicalSpecBase(BaseModel):
    part_number: str
    category: Optional[str] = "OCXO"
    description: Optional[str] = None
    nominal_frequency: str
    frequency_stability: str
    phase_noise_10hz: Optional[float] = None
    phase_noise_100hz: Optional[float] = None
    phase_noise_1khz: Optional[float] = None
    phase_noise_10khz: Optional[float] = None
    phase_noise_100khz: Optional[float] = None
    phase_noise_1mhz: Optional[float] = None
    jitter_spec: Optional[str] = None
    supply_voltage: Optional[str] = "3.3V"
    output_logic: Optional[str] = "CMOS"
    package_type: Optional[str] = "SMD 7050"
    operating_temp_range: Optional[str] = "-40°C to +85°C"
    target_application: Optional[str] = "5G Infrastructure"
    datasheet_url: Optional[str] = None

class TechnicalSpecCreate(TechnicalSpecBase):
    pass

class TechnicalSpecUpdate(BaseModel):
    part_number: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    nominal_frequency: Optional[str] = None
    frequency_stability: Optional[str] = None
    phase_noise_10hz: Optional[float] = None
    phase_noise_100hz: Optional[float] = None
    phase_noise_1khz: Optional[float] = None
    phase_noise_10khz: Optional[float] = None
    phase_noise_100khz: Optional[float] = None
    phase_noise_1mhz: Optional[float] = None
    jitter_spec: Optional[str] = None
    supply_voltage: Optional[str] = None
    output_logic: Optional[str] = None
    package_type: Optional[str] = None
    operating_temp_range: Optional[str] = None
    target_application: Optional[str] = None
    datasheet_url: Optional[str] = None

class TechnicalSpecResponse(TechnicalSpecBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
