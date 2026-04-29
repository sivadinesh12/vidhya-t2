"""app/routes/users.py  -  User Routes"""
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File
from app.models.user import User, UserUpdateSchema, RoleUpdateSchema
from app.middleware.auth_middleware import get_current_user, require_admin
import app.controllers.user_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_all_users(
    page: int = 1, limit: int = 20,
    role: Optional[str] = None, is_active: Optional[bool] = None,
    _: User = Depends(require_admin)
):
    return await ctrl.get_all_users(page, limit, role, is_active)

@router.get("/{user_id}")
async def get_user(user_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.get_user_by_id(user_id, current_user)

@router.patch("/{user_id}")
async def update_user(
    user_id: str,
    body: UserUpdateSchema = Depends(),
    avatar: Optional[UploadFile] = File(default=None),
    current_user: User = Depends(get_current_user)
):
    avatar_path = None
    if avatar:
        from app.controllers.upload_controller import _save_file
        avatar_path = _save_file(avatar, "avatar")
    return await ctrl.update_user(user_id, body, avatar_path, current_user)

@router.delete("/{user_id}")
async def delete_user(user_id: str, _: User = Depends(require_admin)):
    return await ctrl.delete_user(user_id)

@router.patch("/{user_id}/role")
async def change_role(user_id: str, body: RoleUpdateSchema, _: User = Depends(require_admin)):
    return await ctrl.change_role(user_id, body)
