"""
app/routes/auth.py  -  Auth Routes
Includes logout endpoint + all auth operations.
"""
from fastapi import APIRouter, Depends
from app.models.user import UserSignupSchema, UserLoginSchema, GoogleAuthSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.auth_controller as ctrl

router = APIRouter()

# ── Public routes (no token needed) ──────────────────────────
@router.post("/signup")
async def signup(body: UserSignupSchema):
    return await ctrl.signup(body)

@router.post("/login")
async def login(body: UserLoginSchema):
    return await ctrl.login(body)

@router.post("/google")
async def google_auth(body: GoogleAuthSchema):
    return await ctrl.google_auth(body)

# ── Protected routes (token required) ────────────────────────
@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return await ctrl.get_me(current_user)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return await ctrl.logout(current_user)