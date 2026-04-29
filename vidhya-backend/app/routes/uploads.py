"""app/routes/uploads.py  -  Upload Routes"""
from fastapi import APIRouter, Depends, UploadFile, File
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.upload_controller as ctrl

router = APIRouter()

@router.post("/avatar")
async def upload_avatar(file: UploadFile = File(..., alias="avatar"), current_user: User = Depends(get_current_user)):
    return await ctrl.upload_avatar(file, current_user)

@router.post("/image")
async def upload_image(file: UploadFile = File(..., alias="image"), current_user: User = Depends(get_current_user)):
    return await ctrl.upload_image(file, current_user)
