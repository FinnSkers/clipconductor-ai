from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
async def login():
    """User login"""
    return {"message": "Login endpoint - Coming soon"}


@router.post("/logout")
async def logout():
    """User logout"""
    return {"message": "Logout endpoint - Coming soon"}


@router.post("/refresh")
async def refresh_token():
    """Refresh JWT token"""
    return {"message": "Token refresh - Coming soon"}
