"""
app/models/user.py  -  User Document Model (Beanie ODM)
Passwords stored as bcrypt hashes. Never plain text.
"""
from typing import Optional
from datetime import datetime
from enum import Enum
from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Role(str, Enum):
    user  = "user"
    admin = "admin"

class TargetExam(str, Enum):
    NEET         = "NEET"
    JEE_MAINS    = "JEE_MAINS"
    JEE_ADVANCED = "JEE_ADVANCED"
    BOARDS       = "BOARDS"
    OTHER        = "OTHER"

class User(Document):
    name     : str = Field(..., min_length=2, max_length=60)
    email    : Indexed(EmailStr, unique=True)
    password : Optional[str] = None
    role     : Role = Role.user
    avatar   : Optional[str] = None
    target_exam : Optional[TargetExam] = TargetExam.NEET
    target_year : Optional[int] = None
    google_id   : Optional[str] = None
    apple_id    : Optional[str] = None
    is_active   : bool = True
    last_login  : Optional[datetime] = None
    created_at  : datetime = Field(default_factory=datetime.utcnow)
    updated_at  : datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

    def set_password(self, plain: str):
        self.password = pwd_context.hash(plain)

    def verify_password(self, plain: str) -> bool:
        if not self.password:
            return False
        return pwd_context.verify(plain, self.password)

    def to_safe_dict(self) -> dict:
        data = self.model_dump()
        data.pop("password", None)
        data["id"] = str(self.id)
        return data

# ── Request/Response schemas ──────────────────────────────────────────────────
class UserSignupSchema(BaseModel):
    name        : str      = Field(..., min_length=2, max_length=60)
    email       : EmailStr
    password    : str      = Field(..., min_length=6)
    target_exam : Optional[TargetExam] = TargetExam.NEET
    target_year : Optional[int] = Field(default=None, ge=2024, le=2030)

class UserLoginSchema(BaseModel):
    email    : EmailStr
    password : str

class GoogleAuthSchema(BaseModel):
    credential: str

class UserUpdateSchema(BaseModel):
    name        : Optional[str]        = Field(default=None, min_length=2, max_length=60)
    target_exam : Optional[TargetExam] = None
    target_year : Optional[int]        = Field(default=None, ge=2024, le=2030)

class RoleUpdateSchema(BaseModel):
    role: Role
