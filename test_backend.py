#!/usr/bin/env python3
"""
Test script for ClipConductor AI Backend
Run this to verify the backend is working correctly
"""

import asyncio
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

try:
    from app.core.config import settings
    from app.main import app
    print("✅ Backend imports successful!")
    print(f"✅ App Name: {settings.APP_NAME}")
    print(f"✅ Version: {settings.APP_VERSION}")
    print(f"✅ Debug Mode: {settings.DEBUG}")
    print(f"✅ Database URL configured: {'Yes' if settings.DATABASE_URL else 'No'}")
    print("\n🚀 Ready to start development!")
    print(f"Run: uvicorn app.main:app --host {settings.HOST} --port {settings.PORT} --reload")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure to install dependencies: pip install -r backend/requirements.txt")
except Exception as e:
    print(f"❌ Configuration error: {e}")

# Test database models
try:
    from app.models.database import Base, User, Clip
    print("✅ Database models loaded successfully!")
except Exception as e:
    print(f"❌ Database model error: {e}")

# Test API schemas
try:
    from app.models.schemas import ClipCreate, User as UserSchema
    test_clip = ClipCreate(title="Test Clip", file_path="/test/path.mp4")
    print("✅ Pydantic schemas working correctly!")
except Exception as e:
    print(f"❌ Schema error: {e}")
