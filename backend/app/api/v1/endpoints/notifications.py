"""
ClipConductor AI - Notification API Endpoints
API endpoints for testing and managing notifications
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.notification_service import NotificationService

router = APIRouter()


class NotificationTestRequest(BaseModel):
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    discord_webhook: Optional[str] = None
    slack_webhook: Optional[str] = None


class NotificationConfigRequest(BaseModel):
    platform: str  # telegram, discord, slack
    config: Dict[str, str]


class ClipNotificationRequest(BaseModel):
    clip_info: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None
    platforms: Optional[List[str]] = ["telegram"]


@router.post("/test")
async def test_notifications(request: NotificationTestRequest):
    """Test notification services with provided credentials"""
    try:
        async with NotificationService() as notifier:
            results = await notifier.test_notifications(
                telegram_token=request.telegram_bot_token,
                telegram_chat=request.telegram_chat_id,
                discord_webhook=request.discord_webhook,
                slack_webhook=request.slack_webhook
            )
        
        return {
            "success": True,
            "results": results,
            "message": "Notification tests completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error testing notifications: {str(e)}")


@router.post("/send-clip")
async def send_clip_notification(request: ClipNotificationRequest):
    """Send notification for a processed clip"""
    try:
        async with NotificationService() as notifier:
            await notifier.notify_clip_processed(
                clip_info=request.clip_info,
                metadata=request.metadata,
                platforms=request.platforms
            )
        
        return {
            "success": True,
            "message": "Clip notification sent",
            "platforms": request.platforms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending notification: {str(e)}")


@router.post("/send-error")
async def send_error_notification(error_type: str, details: str, platforms: Optional[List[str]] = ["telegram"]):
    """Send error notification"""
    try:
        async with NotificationService() as notifier:
            await notifier.notify_error(
                error_type=error_type,
                details=details,
                platforms=platforms
            )
        
        return {
            "success": True,
            "message": "Error notification sent",
            "platforms": platforms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending notification: {str(e)}")


@router.post("/send-stats")
async def send_stats_notification(stats: Dict[str, Any], platforms: Optional[List[str]] = ["telegram"]):
    """Send daily statistics notification"""
    try:
        async with NotificationService() as notifier:
            await notifier.notify_daily_stats(
                stats=stats,
                platforms=platforms
            )
        
        return {
            "success": True,
            "message": "Stats notification sent",
            "platforms": platforms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending notification: {str(e)}")


@router.get("/health")
async def notifications_health():
    """Check notification service health"""
    try:
        async with NotificationService() as notifier:
            has_telegram = bool(notifier.telegram_bot_token and notifier.telegram_chat_id)
            has_discord = bool(notifier.discord_webhook)
            has_slack = bool(notifier.slack_webhook)
        
        return {
            "success": True,
            "status": "healthy",
            "configured_services": {
                "telegram": has_telegram,
                "discord": has_discord,
                "slack": has_slack
            }
        }
    except Exception as e:
        return {
            "success": False,
            "status": "unhealthy",
            "error": str(e)
        }
