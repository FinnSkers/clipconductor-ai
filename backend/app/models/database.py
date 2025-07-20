from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime


Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    clips = relationship("Clip", back_populates="owner")
    platform_credentials = relationship("PlatformCredential", back_populates="user")


class Clip(Base):
    __tablename__ = "clips"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    file_path = Column(String, nullable=False)
    original_file_path = Column(String)
    thumbnail_path = Column(String)
    duration = Column(Integer)  # in seconds
    file_size = Column(Integer)  # in bytes
    status = Column(String, default="processing")  # processing, ready, published, error
    game_detected = Column(String)
    highlights_detected = Column(JSON)
    ai_metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    owner = relationship("User", back_populates="clips")
    publications = relationship("Publication", back_populates="clip")
    processing_jobs = relationship("ProcessingJob", back_populates="clip")


class PlatformCredential(Base):
    __tablename__ = "platform_credentials"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)  # youtube, tiktok, instagram, twitter
    access_token = Column(Text)
    refresh_token = Column(Text)
    token_expires_at = Column(DateTime(timezone=True))
    credentials_data = Column(JSON)  # Store platform-specific credential data
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    user = relationship("User", back_populates="platform_credentials")


class Publication(Base):
    __tablename__ = "publications"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)
    platform_post_id = Column(String)  # The ID from the platform (YouTube video ID, etc.)
    status = Column(String, default="pending")  # pending, scheduled, published, failed
    scheduled_at = Column(DateTime(timezone=True))
    published_at = Column(DateTime(timezone=True))
    platform_data = Column(JSON)  # Store platform-specific response data
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    clip_id = Column(Integer, ForeignKey("clips.id"))
    
    # Relationships
    clip = relationship("Clip", back_populates="publications")


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String, nullable=False)  # highlight_detection, metadata_generation, thumbnail_creation
    status = Column(String, default="pending")  # pending, processing, completed, failed
    progress = Column(Integer, default=0)  # 0-100
    result_data = Column(JSON)
    error_message = Column(Text)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    clip_id = Column(Integer, ForeignKey("clips.id"))
    
    # Relationships
    clip = relationship("Clip", back_populates="processing_jobs")


class SystemConfig(Base):
    __tablename__ = "system_config"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    value = Column(JSON)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
