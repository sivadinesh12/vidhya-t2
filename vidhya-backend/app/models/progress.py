"""
app/models/progress.py  -  Progress Tracker Document Model
"""
from typing import Optional, List
from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field

class ProgressSubject(str, Enum):
    Biology     = "Biology"
    Physics     = "Physics"
    Chemistry   = "Chemistry"
    Mathematics = "Mathematics"

class ChapterProgress(BaseModel):
    id             : str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    chapter_name   : str
    subject        : ProgressSubject
    completion_pct : float = Field(default=0.0, ge=0, le=100)
    last_studied   : Optional[datetime] = None

class Milestone(BaseModel):
    id          : str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    icon        : str = "🏆"
    title       : str
    achieved    : bool = False
    achieved_at : Optional[datetime] = None

class Progress(Document):
    owner_id             : str
    chapters             : List[ChapterProgress] = []
    milestones           : List[Milestone] = []
    current_streak       : int = 0
    longest_streak       : int = 0
    last_study_date      : Optional[datetime] = None
    total_study_minutes  : int = 0
    mock_tests_attempted : int = 0
    flashcards_reviewed  : int = 0
    created_at           : datetime = Field(default_factory=datetime.utcnow)
    updated_at           : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "progress"

# ── Schemas ───────────────────────────────────────────────────────────────────
class AddChapterSchema(BaseModel):
    chapter_name : str
    subject      : ProgressSubject

class UpdateChapterSchema(BaseModel):
    completion_pct: float = Field(..., ge=0, le=100)

class UpdateStreakSchema(BaseModel):
    study_minutes        : Optional[int] = Field(default=0, ge=0)
    flashcards_reviewed  : Optional[int] = Field(default=0, ge=0)
    mock_test_completed  : Optional[bool] = False
