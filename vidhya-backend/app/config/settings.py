"""
app/config/settings.py  -  Application Settings
Reads from .env file using Pydantic BaseSettings.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Server
    PORT        : int = 5000
    ENVIRONMENT : str = "development"

    # MongoDB
    MONGODB_URI : str = "mongodb://localhost:27017/vidhya"

    # JWT
    JWT_SECRET      : str = "change_this_in_production"
    JWT_ALGORITHM   : str = "HS256"
    JWT_EXPIRES_DAYS: int = 7

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""

    # File Uploads
    MAX_FILE_SIZE_MB: int = 5

    # Rate Limiting
    RATE_LIMIT: str = "100/minute"

    # CORS — comma-separated list of allowed frontend origins
    CLIENT_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
