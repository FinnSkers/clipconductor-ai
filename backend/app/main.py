from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import logging
from app.core.config import settings
from app.api.v1.endpoints import ai
# from app.api.v1.router import api_router


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting ClipConductor AI Backend")
    yield
    logger.info("Shutting down ClipConductor AI Backend")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered gaming content creation and distribution platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", settings.HOST]
)

# Include API router (temporarily disabled)
# app.include_router(api_router, prefix=settings.API_V1_STR)

# Add AI endpoints
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI"])

# Add Clips endpoints  
try:
    from app.api.v1.endpoints import clips_new
    app.include_router(clips_new.router, prefix=f"{settings.API_V1_STR}/clips", tags=["Clips"])
    logger.info("Clips monitoring endpoints enabled")
except ImportError as e:
    logger.warning(f"Clips monitoring disabled: {e}")

# Add Notification endpoints
try:
    from app.api.v1.endpoints import notifications
    app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])
    logger.info("Notification endpoints enabled")
except ImportError as e:
    logger.warning(f"Notifications disabled: {e}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api": settings.API_V1_STR
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
