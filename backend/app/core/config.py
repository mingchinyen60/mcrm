from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "High-Precision Synology CRM"
    API_V1_STR: str = "/api/v1"
    
    # Defaults to SQLite if POSTGRES is not provided (ensures easy local testing and standalone runs)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./crm.db"
    )
    
    # CORS Origins (support Synology NAS LAN IP, localhost, reverse proxy domains)
    CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://192.168.1.224",
        "http://192.168.1.224:8080",
        "http://192.168.1.224:3000",
        "http://192.168.1.224:5173"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
