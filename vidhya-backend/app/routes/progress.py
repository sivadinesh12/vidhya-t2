"""app/routes/progress.py  -  Progress Routes"""
from fastapi import APIRouter, Depends
from app.models.progress import AddChapterSchema, UpdateChapterSchema, UpdateStreakSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user, require_admin
import app.controllers.progress_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_progress(current_user: User = Depends(get_current_user)):
    return await ctrl.get_progress(current_user)

@router.post("/chapters")
async def add_chapter(body: AddChapterSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.add_chapter(body, current_user)

@router.patch("/chapters/{chapter_id}")
async def update_chapter(chapter_id: str, body: UpdateChapterSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.update_chapter(chapter_id, body, current_user)

@router.patch("/streak")
async def update_streak(body: UpdateStreakSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.update_streak(body, current_user)

@router.get("/leaderboard")
async def leaderboard(_: User = Depends(require_admin)):
    return await ctrl.get_leaderboard()
