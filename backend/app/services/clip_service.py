from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from typing import List, Optional, Tuple
from fastapi import UploadFile
import os
import shutil
from datetime import datetime
from app.models.database import Clip as ClipModel
from app.models.schemas import ClipCreate, ClipUpdate, Clip
from app.core.config import settings


class ClipService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_clips(
        self, 
        page: int = 1, 
        per_page: int = 20, 
        status: Optional[str] = None
    ) -> Tuple[List[Clip], int]:
        """Get clips with pagination and filtering"""
        offset = (page - 1) * per_page
        
        query = select(ClipModel)
        if status:
            query = query.where(ClipModel.status == status)
        
        # Get total count
        count_result = await self.db.execute(select(func.count(ClipModel.id)))
        total = count_result.scalar()
        
        # Get paginated results
        query = query.offset(offset).limit(per_page).order_by(ClipModel.created_at.desc())
        result = await self.db.execute(query)
        clips = result.scalars().all()
        
        return [Clip.from_orm(clip) for clip in clips], total
    
    async def get_clip(self, clip_id: int) -> Optional[Clip]:
        """Get a specific clip by ID"""
        result = await self.db.execute(select(ClipModel).where(ClipModel.id == clip_id))
        clip = result.scalar_one_or_none()
        
        if clip:
            return Clip.from_orm(clip)
        return None
    
    async def create_clip(self, clip_data: ClipCreate) -> Clip:
        """Create a new clip"""
        clip = ClipModel(
            title=clip_data.title,
            description=clip_data.description,
            file_path=clip_data.file_path,
            original_file_path=clip_data.original_file_path,
            status="processing",
            owner_id=1  # TODO: Get from authentication
        )
        
        self.db.add(clip)
        await self.db.commit()
        await self.db.refresh(clip)
        
        return Clip.from_orm(clip)
    
    async def upload_clip(self, file: UploadFile, title: str) -> Clip:
        """Upload and save a video file"""
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(settings.OUTPUT_DIRECTORY, "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Create clip record
        clip_data = ClipCreate(
            title=title,
            file_path=file_path,
            original_file_path=file_path
        )
        
        clip = await self.create_clip(clip_data)
        
        # Update file size
        await self.db.execute(
            update(ClipModel)
            .where(ClipModel.id == clip.id)
            .values(file_size=file_size)
        )
        await self.db.commit()
        
        return clip
    
    async def update_clip(self, clip_id: int, clip_update: ClipUpdate) -> Optional[Clip]:
        """Update a clip"""
        # Get existing clip
        result = await self.db.execute(select(ClipModel).where(ClipModel.id == clip_id))
        clip = result.scalar_one_or_none()
        
        if not clip:
            return None
        
        # Update fields
        update_data = clip_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(clip, field, value)
        
        clip.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(clip)
        
        return Clip.from_orm(clip)
    
    async def delete_clip(self, clip_id: int) -> bool:
        """Delete a clip"""
        result = await self.db.execute(
            delete(ClipModel).where(ClipModel.id == clip_id)
        )
        await self.db.commit()
        
        return result.rowcount > 0
    
    async def get_clip_file_path(self, clip_id: int) -> Optional[str]:
        """Get the file path for a clip"""
        result = await self.db.execute(
            select(ClipModel.file_path).where(ClipModel.id == clip_id)
        )
        file_path = result.scalar_one_or_none()
        return file_path
