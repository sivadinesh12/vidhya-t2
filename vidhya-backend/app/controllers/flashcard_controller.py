"""
app/controllers/flashcard_controller.py  -  Flashcard CRUD
"""
from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from app.models.flashcard import Flashcard, FlashcardCreateSchema, FlashcardUpdateSchema, ReviewSchema
from app.models.user import User
from app.utils.response_helper import success_response


async def get_flashcards(current_user: User, subject: Optional[str],
                          difficulty: Optional[str], archived: bool, page: int, limit: int):
    limit = min(limit, 100)
    skip  = (page - 1) * limit
    query = {"owner_id": str(current_user.id), "is_archived": archived}
    if subject:    query["subject"]    = subject
    if difficulty: query["difficulty"] = difficulty

    cards = await Flashcard.find(query).skip(skip).limit(limit).to_list()
    total = await Flashcard.find(query).count()
    return success_response("Flashcards fetched.",
        [c.model_dump() for c in cards],
        {"page": page, "limit": limit, "total": total})


async def create_flashcard(body: FlashcardCreateSchema, current_user: User):
    card = Flashcard(
        owner_id=str(current_user.id),
        subject=body.subject, chapter=body.chapter or "General",
        deck_title=body.deck_title or "My Deck",
        question=body.question, answer=body.answer,
        difficulty=body.difficulty,
    )
    await card.insert()
    return success_response("Flashcard created.", card.model_dump(), status=201)


async def get_flashcard_by_id(card_id: str, current_user: User):
    card = await Flashcard.find_one({"_id": card_id, "owner_id": str(current_user.id)})
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found.")
    return success_response("Flashcard fetched.", card.model_dump())


async def update_flashcard(card_id: str, body: FlashcardUpdateSchema, current_user: User):
    card = await Flashcard.find_one({"_id": card_id, "owner_id": str(current_user.id)})
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found.")
    updates = body.model_dump(exclude_none=True)
    for k, v in updates.items():
        setattr(card, k, v)
    card.updated_at = datetime.utcnow()
    await card.save()
    return success_response("Flashcard updated.", card.model_dump())


async def delete_flashcard(card_id: str, current_user: User):
    card = await Flashcard.find_one({"_id": card_id, "owner_id": str(current_user.id)})
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found.")
    await card.delete()
    return success_response("Flashcard deleted.", {"id": card_id})


async def review_flashcard(card_id: str, body: ReviewSchema, current_user: User):
    card = await Flashcard.find_one({"_id": card_id, "owner_id": str(current_user.id)})
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found.")
    card.last_reviewed = datetime.utcnow()
    card.review_count += 1
    if body.difficulty:
        card.difficulty = body.difficulty
    await card.save()
    return success_response("Review recorded.", card.model_dump())
