"""
app/models/flashcard.py  -  Flashcard Document Model
"""
from typing import Optional
from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field
from bson import ObjectId

class Subject(str, Enum):
    Biology     = "Biology"
    Physics     = "Physics"
    Chemistry   = "Chemistry"
    Mathematics = "Mathematics"
    Other       = "Other"

class Difficulty(str, Enum):
    easy   = "easy"
    medium = "medium"
    hard   = "hard"

class Flashcard(Document):
    owner_id    : str                   # User ID as string
    subject     : Subject
    chapter     : str = "General"
    deck_title  : str = "My Deck"
    question    : str = Field(..., max_length=1000)
    answer      : str = Field(..., max_length=2000)
    difficulty  : Difficulty = Difficulty.medium
    last_reviewed : Optional[datetime] = None
    review_count  : int = 0
    is_archived   : bool = False
    created_at    : datetime = Field(default_factory=datetime.utcnow)
    updated_at    : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "flashcards"

# ── Schemas ───────────────────────────────────────────────────────────────────
class FlashcardCreateSchema(BaseModel):
    subject    : Subject
    chapter    : Optional[str] = "General"
    deck_title : Optional[str] = "My Deck"
    question   : str = Field(..., max_length=1000)
    answer     : str = Field(..., max_length=2000)
    difficulty : Optional[Difficulty] = Difficulty.medium

class FlashcardUpdateSchema(BaseModel):
    subject     : Optional[Subject]     = None
    chapter     : Optional[str]         = None
    deck_title  : Optional[str]         = None
    question    : Optional[str]         = Field(default=None, max_length=1000)
    answer      : Optional[str]         = Field(default=None, max_length=2000)
    difficulty  : Optional[Difficulty]  = None
    is_archived : Optional[bool]        = None

class ReviewSchema(BaseModel):
    difficulty: Optional[Difficulty] = None
