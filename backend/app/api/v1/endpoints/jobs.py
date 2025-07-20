from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_database

router = APIRouter()


@router.get("/")
async def get_jobs(db: AsyncSession = Depends(get_database)):
    """Get all processing jobs"""
    return {"message": "Processing jobs - Coming soon"}


@router.get("/{job_id}")
async def get_job(job_id: int, db: AsyncSession = Depends(get_database)):
    """Get specific processing job"""
    return {"message": f"Job {job_id} - Coming soon"}


@router.post("/{job_id}/cancel")
async def cancel_job(job_id: int, db: AsyncSession = Depends(get_database)):
    """Cancel a processing job"""
    return {"message": f"Cancelling job {job_id} - Coming soon"}


@router.get("/clip/{clip_id}")
async def get_clip_jobs(clip_id: int, db: AsyncSession = Depends(get_database)):
    """Get all jobs for a specific clip"""
    return {"message": f"Jobs for clip {clip_id} - Coming soon"}
