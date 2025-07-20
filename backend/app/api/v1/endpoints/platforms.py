from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()

SUPPORTED_PLATFORMS = ["youtube", "tiktok", "instagram", "twitter", "discord"]


@router.get("/")
async def get_platforms():
    """Get all supported platforms"""
    return {
        "platforms": SUPPORTED_PLATFORMS,
        "message": "Supported social media platforms"
    }


@router.post("/{platform}/auth")
async def authenticate_platform(platform: str):
    """Authenticate with a social media platform"""
    if platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(status_code=400, detail="Platform not supported")
    
    return {"message": f"{platform.title()} authentication - Coming soon"}


@router.post("/{platform}/publish")
async def publish_to_platform(platform: str, clip_id: int):
    """Publish a clip to a specific platform"""
    if platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(status_code=400, detail="Platform not supported")
    
    return {
        "message": f"Publishing clip {clip_id} to {platform.title()} - Coming soon"
    }


@router.get("/{platform}/status")
async def get_platform_status(platform: str):
    """Get platform authentication status"""
    if platform not in SUPPORTED_PLATFORMS:
        raise HTTPException(status_code=400, detail="Platform not supported")
    
    return {
        "platform": platform,
        "authenticated": False,
        "message": "Status check - Coming soon"
    }
