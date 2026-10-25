from pydantic import BaseModel
from typing import Dict, List, Any

class PipelineStageCount(BaseModel):
    stage: str
    count: int
    total_value: float

class DashboardMetrics(BaseModel):
    total_accounts: int
    total_opportunities: int
    total_pipeline_value: float
    total_weighted_value: float
    design_wins_count: int
    mass_production_count: int
    active_samples_count: int
    stage_breakdown: List[PipelineStageCount]
    recent_opportunities: List[Dict[str, Any]]
    recent_samples: List[Dict[str, Any]]
