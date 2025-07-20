from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_users():
    """Get all users"""
    return {"message": "Users endpoint - Coming soon"}


@router.post("/")
async def create_user():
    """Create a new user"""
    return {"message": "User creation - Coming soon"}


@router.get("/{user_id}")
async def get_user(user_id: int):
    """Get user by ID"""
    return {"message": f"User {user_id} - Coming soon"}
