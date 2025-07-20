from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.core.database import get_database
from app.models.schemas import Clip, ClipCreate, ClipUpdate, APIResponse, PaginatedResponse
from app.services.clip_service import ClipService
from app.services.ai_service import AIService

router = APIRouter()


@router.get("/", response_model=PaginatedResponse)
async def get_clips(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_database)
):
    """Get all clips with pagination and filtering"""
    try:
        clip_service = ClipService(db)
        clips, total = await clip_service.get_clips(
            page=page, 
            per_page=per_page, 
            status=status
        )
        
        return PaginatedResponse(
            items=clips,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=(total + per_page - 1) // per_page
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{clip_id}", response_model=Clip)
async def get_clip(
    clip_id: int,
    db: AsyncSession = Depends(get_database)
):
    """Get a specific clip by ID"""
    try:
        clip_service = ClipService(db)
        clip = await clip_service.get_clip(clip_id)
        
        if not clip:
            raise HTTPException(status_code=404, detail="Clip not found")
        
        return clip
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=APIResponse)
async def create_clip(
    clip_data: ClipCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_database)
):
    """Create a new clip"""
    try:
        clip_service = ClipService(db)
        clip = await clip_service.create_clip(clip_data)
        
        # Start background processing
        background_tasks.add_task(process_clip_background, clip.id, db)
        
        return APIResponse(
            success=True,
            message="Clip created successfully",
            data={"clip_id": clip.id}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload", response_model=APIResponse)
async def upload_clip(
    file: UploadFile = File(...),
    title: str = "Untitled Clip",
    background_tasks: BackgroundTasks = None,
    db: AsyncSession = Depends(get_database)
):
    """Upload a video file and create a clip"""
    try:
        # Validate file type
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        clip_service = ClipService(db)
        clip = await clip_service.upload_clip(file, title)
        
        # Start background processing
        if background_tasks:
            background_tasks.add_task(process_clip_background, clip.id, db)
        
        return APIResponse(
            success=True,
            message="Clip uploaded successfully",
            data={"clip_id": clip.id}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{clip_id}", response_model=APIResponse)
async def update_clip(
    clip_id: int,
    clip_update: ClipUpdate,
    db: AsyncSession = Depends(get_database)
):
    """Update a clip"""
    try:
        clip_service = ClipService(db)
        clip = await clip_service.update_clip(clip_id, clip_update)
        
        if not clip:
            raise HTTPException(status_code=404, detail="Clip not found")
        
        return APIResponse(
            success=True,
            message="Clip updated successfully",
            data=clip
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{clip_id}", response_model=APIResponse)
async def delete_clip(
    clip_id: int,
    db: AsyncSession = Depends(get_database)
):
    """Delete a clip"""
    try:
        clip_service = ClipService(db)
        success = await clip_service.delete_clip(clip_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Clip not found")
        
        return APIResponse(
            success=True,
            message="Clip deleted successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{clip_id}/generate-metadata", response_model=APIResponse)
async def generate_metadata(
    clip_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_database)
):
    """Generate AI metadata for a clip"""
    try:
        # Start background task for AI metadata generation
        background_tasks.add_task(generate_metadata_background, clip_id, db)
        
        return APIResponse(
            success=True,
            message="Metadata generation started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{clip_id}/detect-highlights", response_model=APIResponse)
async def detect_highlights(
    clip_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_database)
):
    """Detect highlights in a clip using AI"""
    try:
        # Start background task for highlight detection
        background_tasks.add_task(detect_highlights_background, clip_id, db)
        
        return APIResponse(
            success=True,
            message="Highlight detection started"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Background task functions
async def process_clip_background(clip_id: int, db: AsyncSession):
    """Background task to process a newly uploaded clip"""
    try:
        ai_service = AIService()
        
        # Detect highlights
        await ai_service.detect_highlights(clip_id)
        
        # Generate metadata
        await ai_service.generate_metadata(clip_id)
        
        # Generate thumbnail
        await ai_service.generate_thumbnail(clip_id)
        
    except Exception as e:
        # Log error and update clip status
        print(f"Error processing clip {clip_id}: {e}")


async def generate_metadata_background(clip_id: int, db: AsyncSession):
    """Background task for AI metadata generation"""
    try:
        ai_service = AIService()
        await ai_service.generate_metadata(clip_id)
    except Exception as e:
        print(f"Error generating metadata for clip {clip_id}: {e}")


async def detect_highlights_background(clip_id: int, db: AsyncSession):
    """Background task for highlight detection"""
    try:
        ai_service = AIService()
        await ai_service.detect_highlights(clip_id)
    except Exception as e:
        print(f"Error detecting highlights for clip {clip_id}: {e}")
