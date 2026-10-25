from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.account import Account
from app.models.opportunity import Opportunity
from app.models.sample import SampleRequest
from app.schemas.dashboard import DashboardMetrics, PipelineStageCount

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_accounts = db.query(Account).count()
    total_opps = db.query(Opportunity).count()
    
    # Calculate pipeline values
    opps = db.query(Opportunity).all()
    total_pipeline_val = sum(o.estimated_revenue or 0.0 for o in opps if o.stage != "closed_lost")
    total_weighted_val = sum((o.estimated_revenue or 0.0) * ((o.confidence_percentage or 0) / 100.0) for o in opps if o.stage != "closed_lost")
    
    design_wins_count = db.query(Opportunity).filter(Opportunity.stage == "4_design_win").count()
    mass_production_count = db.query(Opportunity).filter(Opportunity.stage == "5_mass_production").count()
    active_samples_count = db.query(SampleRequest).filter(SampleRequest.status.notin_(["passed", "rejected"])).count()
    
    # Stage breakdown
    stages = ["1_lead", "2_tech_discovery", "3_sample_evaluation", "4_design_win", "5_mass_production", "closed_lost"]
    breakdown = []
    for s in stages:
        stage_opps = [o for o in opps if o.stage == s]
        breakdown.append(PipelineStageCount(
            stage=s,
            count=len(stage_opps),
            total_value=sum(o.estimated_revenue or 0.0 for o in stage_opps)
        ))
        
    # Recent opps
    recent_opps = db.query(Opportunity).order_by(Opportunity.updated_at.desc()).limit(5).all()
    recent_opps_data = []
    for o in recent_opps:
        recent_opps_data.append({
            "id": o.id,
            "title": o.title,
            "account_name": o.account.name if o.account else "N/A",
            "stage": o.stage,
            "estimated_revenue": o.estimated_revenue,
            "confidence_percentage": o.confidence_percentage,
            "updated_at": o.updated_at.isoformat() if o.updated_at else None
        })
        
    # Recent samples
    recent_samples = db.query(SampleRequest).order_by(SampleRequest.created_at.desc()).limit(5).all()
    recent_samples_data = []
    for s in recent_samples:
        recent_samples_data.append({
            "id": s.id,
            "sample_batch_code": s.sample_batch_code,
            "status": s.status,
            "quantity": s.quantity,
            "account_name": s.opportunity.account.name if s.opportunity and s.opportunity.account else "N/A",
            "part_number": s.tech_spec.part_number if s.tech_spec else "N/A",
            "created_at": s.created_at.isoformat() if s.created_at else None
        })
        
    return DashboardMetrics(
        total_accounts=total_accounts,
        total_opportunities=total_opps,
        total_pipeline_value=total_pipeline_val,
        total_weighted_value=total_weighted_val,
        design_wins_count=design_wins_count,
        mass_production_count=mass_production_count,
        active_samples_count=active_samples_count,
        stage_breakdown=breakdown,
        recent_opportunities=recent_opps_data,
        recent_samples=recent_samples_data
    )
