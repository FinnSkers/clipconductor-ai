from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ClipStatus(str, Enum):
    PROCESSING = "processing"
    READY = "ready" 
    PUBLISHED = "published"
    ERROR = "error"


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class PublicationStatus(str, Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"


# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Clip Schemas
class ClipBase(BaseModel):
    title: str
    description: Optional[str] = None


class ClipCreate(ClipBase):
    file_path: str
    original_file_path: Optional[str] = None


class ClipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ClipStatus] = None
    ai_metadata: Optional[Dict[str, Any]] = None


class Clip(ClipBase):
    id: int
    file_path: str
    original_file_path: Optional[str] = None
    thumbnail_path: Optional[str] = None
    duration: Optional[int] = None
    file_size: Optional[int] = None
    status: ClipStatus
    game_detected: Optional[str] = None
    highlights_detected: Optional[Dict[str, Any]] = None
    ai_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int
    
    class Config:
        from_attributes = True


# Processing Job Schemas
class ProcessingJobBase(BaseModel):
    job_type: str


class ProcessingJobCreate(ProcessingJobBase):
    clip_id: int


class ProcessingJob(ProcessingJobBase):
    id: int
    clip_id: int
    status: JobStatus
    progress: int
    result_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Platform Credential Schemas
class PlatformCredentialBase(BaseModel):
    platform: str


class PlatformCredentialCreate(PlatformCredentialBase):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    credentials_data: Optional[Dict[str, Any]] = None


class PlatformCredential(PlatformCredentialBase):
    id: int
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    credentials_data: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int
    
    class Config:
        from_attributes = True


# Publication Schemas
class PublicationBase(BaseModel):
    platform: str
    scheduled_at: Optional[datetime] = None


class PublicationCreate(PublicationBase):
    clip_id: int


class Publication(PublicationBase):
    id: int
    clip_id: int
    platform_post_id: Optional[str] = None
    status: PublicationStatus
    published_at: Optional[datetime] = None
    platform_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# API Response Schemas
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int


# AI Generation Request Schemas
class AIMetadataRequest(BaseModel):
    clip_id: int
    game_title: Optional[str] = None
    platform_specific: Optional[List[str]] = None


class AIMetadataResponse(BaseModel):
    title: str
    description: str
    hashtags: List[str]
    thumbnail_suggestions: List[str]
    platform_optimizations: Dict[str, Dict[str, Any]]
