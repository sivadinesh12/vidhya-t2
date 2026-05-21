"""
app/models/user.py  -  User Document Model (Beanie ODM)
Passwords stored as bcrypt hashes. Never plain text.
"""
from typing import Optional
from datetime import datetime
from enum import Enum
import bcrypt

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field


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
    name        : str = Field(..., min_length=2, max_length=60)
    email       : Indexed(EmailStr, unique=True)
    password    : Optional[str] = None
    role        : Role = Role.user
    avatar      : Optional[str] = None
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
        """Hash and store password using bcrypt."""
        salt   = bcrypt.gensalt()
        hashed = bcrypt.hashpw(plain.encode("utf-8"), salt)
        self.password = hashed.decode("utf-8")

    def verify_password(self, plain: str) -> bool:
        """Verify a plain password against the stored bcrypt hash."""
        if not self.password:
            return False
        try:
            return bcrypt.checkpw(plain.encode("utf-8"), self.password.encode("utf-8"))
        except Exception:
            return False

    def to_safe_dict(self) -> dict:
        """Return user data safe to send to the client (no password)."""
        return {
            "id"          : str(self.id),
            "name"        : self.name,
            "email"       : self.email,
            "role"        : self.role.value if hasattr(self.role, "value") else self.role,
            "avatar"      : self.avatar,
            "target_exam" : self.target_exam.value if self.target_exam and hasattr(self.target_exam, "value") else self.target_exam,
            "target_year" : self.target_year,
            "is_active"   : self.is_active,
            "google_linked": bool(self.google_id),
            "last_login"  : self.last_login.isoformat() if self.last_login else None,
            "created_at"  : self.created_at.isoformat() if self.created_at else None,
            "updated_at"  : self.updated_at.isoformat() if self.updated_at else None,
        }


# ── Request / Response schemas ────────────────────────────────────────────────
class UserSignupSchema(BaseModel):
    name        : str = Field(..., min_length=2, max_length=60)
    email       : EmailStr
    password    : str = Field(..., min_length=6)
    target_exam : Optional[TargetExam] = TargetExam.NEET
    target_year : Optional[int] = Field(default=None, ge=2024, le=2030)


class UserLoginSchema(BaseModel):
    email    : EmailStr
    password : str


class GoogleAuthSchema(BaseModel):
    credential: str


class UserUpdateSchema(BaseModel):
    name        : Optional[str] = Field(default=None, min_length=2, max_length=60)
    target_exam : Optional[TargetExam] = None
    target_year : Optional[int] = Field(default=None, ge=2024, le=2030)
    avatar      : Optional[str] = None


class RoleUpdateSchema(BaseModel):
    role: Role
