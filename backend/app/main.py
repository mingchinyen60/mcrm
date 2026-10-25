from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from app.core.config import settings
from app.core.database import Base, engine
from app.api import accounts, contacts, tech_specs, opportunities, samples, dashboard, activities, imports, exports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS project_code VARCHAR(50);"))
            conn.execute(text("ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS partner_account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL;"))
            conn.execute(text("ALTER TABLE activities ADD COLUMN IF NOT EXISTS attachment_path VARCHAR(500);"))
            conn.execute(text("ALTER TABLE activities ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);"))
            conn.execute(text("ALTER TABLE activities ADD COLUMN IF NOT EXISTS attachment_size INTEGER;"))
    except Exception as e:
        print(f"Schema migration check: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Custom Self-Hosted CRM for High-Precision Frequency Control & Engineering Design Wins on Synology NAS",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": settings.DATABASE_URL.split(":")[0] # e.g. sqlite or postgresql
    }

# Include API Routers
app.include_router(accounts.router, prefix=settings.API_V1_STR)
app.include_router(contacts.router, prefix=settings.API_V1_STR)
app.include_router(tech_specs.router, prefix=settings.API_V1_STR)
app.include_router(opportunities.router, prefix=settings.API_V1_STR)
app.include_router(samples.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(activities.router, prefix=settings.API_V1_STR)
app.include_router(imports.router, prefix=settings.API_V1_STR)
app.include_router(exports.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
