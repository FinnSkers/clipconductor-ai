from typing import Any, Dict, Optional
from pydantic import validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # App Settings
    APP_NAME: str = "ClipConductor AI"
    APP_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # Database Settings
    DATABASE_URL: Optional[str] = None
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "clipconductor"
    POSTGRES_PASSWORD: str = "clipconductor123"
    POSTGRES_DB: str = "clipconductor_ai"
    POSTGRES_PORT: int = 5432
    
    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # AI Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "deepseek-r1:latest"  # Using your available model
    YOLO_MODEL_PATH: str = "yolov8n.pt"
    
    # File Processing
    WATCH_DIRECTORIES: list = []
    OUTPUT_DIRECTORY: str = "output"
    MAX_FILE_SIZE_MB: int = 500
    
    # Platform API Keys (stored as environment variables)
    YOUTUBE_CLIENT_ID: Optional[str] = None
    YOUTUBE_CLIENT_SECRET: Optional[str] = None
    TIKTOK_CLIENT_KEY: Optional[str] = None
    TIKTOK_CLIENT_SECRET: Optional[str] = None
    INSTAGRAM_CLIENT_ID: Optional[str] = None
    INSTAGRAM_CLIENT_SECRET: Optional[str] = None
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_ACCESS_TOKEN: Optional[str] = None
    TWITTER_ACCESS_TOKEN_SECRET: Optional[str] = None
    
    # Notification Settings
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_CHAT_ID: Optional[str] = None
    SLACK_BOT_TOKEN: Optional[str] = None
    SLACK_CHANNEL: Optional[str] = None
    DISCORD_BOT_TOKEN: Optional[str] = None
    DISCORD_CHANNEL_ID: Optional[str] = None
    
    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        postgres_server = values.get('POSTGRES_SERVER', 'localhost')
        postgres_user = values.get('POSTGRES_USER', 'clipconductor')
        postgres_password = values.get('POSTGRES_PASSWORD', 'clipconductor123')
        postgres_port = values.get('POSTGRES_PORT', 5432)
        postgres_db = values.get('POSTGRES_DB', 'clipconductor_ai')
        return f"postgresql+asyncpg://{postgres_user}:{postgres_password}@{postgres_server}:{postgres_port}/{postgres_db}"
    
    @validator("WATCH_DIRECTORIES", pre=True)
    def parse_watch_directories(cls, v):
        if isinstance(v, str):
            return [dir.strip() for dir in v.split(",") if dir.strip()]
        return v or []
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
