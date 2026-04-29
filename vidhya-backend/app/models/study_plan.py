"""
app/models/study_plan.py  -  Study Plan Document Model
"""
from typing import Optional, List
from datetime import datetime
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field

class Day(str, Enum):
    Mon = "Mon"; Tue = "Tue"; Wed = "Wed"; Thu = "Thu"
    Fri = "Fri"; Sat = "Sat"; Sun = "Sun"

class SessionSubject(str, Enum):
    Biology     = "Biology"
    Physics     = "Physics"
    Chemistry   = "Chemistry"
    Mathematics = "Mathematics"
    MockTest    = "Mock Test"
    Revision    = "Revision"
    Other       = "Other"

class Session(BaseModel):
    id              : str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    day             : Day
    time            : str
    title           : str = Field(..., max_length=120)
    subject         : Optional[SessionSubject] = SessionSubject.Other
    duration_minutes: Optional[int] = Field(default=None, ge=5, le=480)
    is_completed    : bool = False

class StudyPlan(Document):
    owner_id      : str
    week_label    : str = "My Study Plan"
    sessions      : List[Session] = []
    adherence_pct : float = 0.0
    is_active     : bool = True
    created_at    : datetime = Field(default_factory=datetime.utcnow)
    updated_at    : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "study_plans"

    def recalculate_adherence(self):
        if not self.sessions:
            self.adherence_pct = 0.0
            return
        done = sum(1 for s in self.sessions if s.is_completed)
        self.adherence_pct = round((done / len(self.sessions)) * 100, 1)

# ── Schemas ───────────────────────────────────────────────────────────────────
class SessionCreateSchema(BaseModel):
    day             : Day
    time            : str
    title           : str = Field(..., max_length=120)
    subject         : Optional[SessionSubject] = SessionSubject.Other
    duration_minutes: Optional[int] = Field(default=None, ge=5, le=480)

class StudyPlanCreateSchema(BaseModel):
    week_label : Optional[str] = "My Study Plan"
    sessions   : Optional[List[SessionCreateSchema]] = []

class StudyPlanUpdateSchema(BaseModel):
    week_label : Optional[str] = None
    sessions   : Optional[List[SessionCreateSchema]] = None
    is_active  : Optional[bool] = None
