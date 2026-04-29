"""app/routes/auth.py  -  Auth Routes"""
from fastapi import APIRouter, Depends
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.user import UserSignupSchema, UserLoginSchema, GoogleAuthSchema
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
import app.controllers.auth_controller as ctrl

router  = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/signup")
async def signup(body: UserSignupSchema):
    return await ctrl.signup(body)

@router.post("/login")
async def login(body: UserLoginSchema):
    return await ctrl.login(body)

@router.post("/google")
async def google_auth(body: GoogleAuthSchema):
    return await ctrl.google_auth(body)

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return await ctrl.get_me(current_user)
