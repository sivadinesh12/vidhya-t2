"""
app/controllers/user_controller.py  -  User CRUD
"""
from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from app.models.user import User, UserUpdateSchema, RoleUpdateSchema
from app.utils.response_helper import success_response


async def get_all_users(page: int, limit: int, role: Optional[str], is_active: Optional[bool]):
    limit = min(limit, 100)
    skip  = (page - 1) * limit
    query = {}
    if role:      query["role"]      = role
    if is_active is not None: query["is_active"] = is_active

    users = await User.find(query).skip(skip).limit(limit).to_list()
    total = await User.find(query).count()

    return success_response("Users fetched.", [u.to_safe_dict() for u in users], {
        "page": page, "limit": limit, "total": total,
        "total_pages": -(-total // limit),
    })


async def get_user_by_id(user_id: str, current_user: User):
    if current_user.role != "admin" and str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="You can only view your own profile.")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return success_response("User fetched.", user.to_safe_dict())


async def update_user(user_id: str, body: UserUpdateSchema, avatar_path: Optional[str], current_user: User):
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile.")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if body.name:        user.name        = body.name
    if body.target_exam: user.target_exam = body.target_exam
    if body.target_year: user.target_year = body.target_year
    if avatar_path:      user.avatar      = avatar_path
    user.updated_at = datetime.utcnow()
    await user.save()
    return success_response("Profile updated.", user.to_safe_dict())


async def delete_user(user_id: str):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_active = False
    await user.save()
    return success_response("User account deactivated.", {"id": str(user.id)})


async def change_role(user_id: str, body: RoleUpdateSchema):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.role = body.role
    await user.save()
    return success_response(f"Role updated to '{body.role}'.", user.to_safe_dict())
