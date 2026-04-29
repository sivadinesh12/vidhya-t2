"""app/routes/flashcards.py  -  Flashcard Routes"""
from typing import Optional
from fastapi import APIRouter, Depends
from app.models.flashcard import FlashcardCreateSchema, FlashcardUpdateSchema, ReviewSchema
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
import app.controllers.flashcard_controller as ctrl

router = APIRouter()

@router.get("/")
async def get_flashcards(
    subject: Optional[str] = None, difficulty: Optional[str] = None,
    archived: bool = False, page: int = 1, limit: int = 20,
    current_user: User = Depends(get_current_user)
):
    return await ctrl.get_flashcards(current_user, subject, difficulty, archived, page, limit)

@router.post("/")
async def create_flashcard(body: FlashcardCreateSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.create_flashcard(body, current_user)

@router.get("/{card_id}")
async def get_flashcard(card_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.get_flashcard_by_id(card_id, current_user)

@router.put("/{card_id}")
async def update_flashcard(card_id: str, body: FlashcardUpdateSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.update_flashcard(card_id, body, current_user)

@router.delete("/{card_id}")
async def delete_flashcard(card_id: str, current_user: User = Depends(get_current_user)):
    return await ctrl.delete_flashcard(card_id, current_user)

@router.patch("/{card_id}/review")
async def review_flashcard(card_id: str, body: ReviewSchema, current_user: User = Depends(get_current_user)):
    return await ctrl.review_flashcard(card_id, body, current_user)
