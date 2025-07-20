"""
ClipConductor AI - Clips API Endpoints
API endpoints for managing and processing gaming clips
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.clips_monitor import ClipsMonitor

router = APIRouter()

class ClipProcessRequest(BaseModel):
    limit: Optional[int] = 5

class ClipScanResponse(BaseModel):
    success: bool
    total_clips: int
    clips: List[Dict[str, Any]]

class ClipProcessResponse(BaseModel):
    success: bool
    processed_count: int
    results: List[Dict[str, Any]]


@router.get("/scan", response_model=ClipScanResponse)
async def scan_outplayed_clips():
    """Scan the Outplayed folder for gaming clips"""
    try:
        monitor = ClipsMonitor()
        clips = await monitor.scan_existing_clips()
        
        return ClipScanResponse(
            success=True,
            total_clips=len(clips),
            clips=clips
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scanning clips: {str(e)}")


@router.post("/process", response_model=ClipProcessResponse)
async def process_clips_batch(request: ClipProcessRequest):
    """Process a batch of clips with AI metadata generation"""
    try:
        monitor = ClipsMonitor()
        results = await monitor.process_clip_batch(limit=request.limit)
        
        return ClipProcessResponse(
            success=True,
            processed_count=len(results),
            results=results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing clips: {str(e)}")


@router.get("/stats")
async def get_clip_stats():
    """Get statistics about available clips"""
    try:
        monitor = ClipsMonitor()
        clips = await monitor.scan_existing_clips()
        
        # Group by game
        games = {}
        total_size = 0
        
        for clip in clips:
            game = clip.get("game_name", "Unknown")
            if game not in games:
                games[game] = {"count": 0, "size": 0}
            games[game]["count"] += 1
            games[game]["size"] += clip.get("file_size", 0)
            total_size += clip.get("file_size", 0)
        
        return {
            "success": True,
            "total_clips": len(clips),
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "games": games
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")


@router.get("/health")
async def clips_health_check():
    """Check clips monitoring service health"""
    try:
        monitor = ClipsMonitor()
        path_exists = monitor.outplayed_path.exists()
        
        if path_exists:
            # Quick scan to verify accessibility
            clips = await monitor.scan_existing_clips()
            clips_count = len(clips)
        else:
            clips_count = 0
        
        return {
            "success": True,
            "outplayed_path": str(monitor.outplayed_path),
            "path_exists": path_exists,
            "clips_available": clips_count,
            "status": "healthy" if path_exists else "path_not_found"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "status": "unhealthy"
        }
