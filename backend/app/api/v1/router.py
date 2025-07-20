from fastapi import APIRouter
from app.api.v1.endpoints import clips, users, auth, platforms, jobs

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(clips.router, prefix="/clips", tags=["clips"])
api_router.include_router(platforms.router, prefix="/platforms", tags=["platforms"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["processing-jobs"])
