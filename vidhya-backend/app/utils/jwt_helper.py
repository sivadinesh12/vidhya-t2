"""
app/utils/jwt_helper.py  -  JWT Token Helpers
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.config.settings import settings


def create_access_token(user_id: str, role: str, email: str) -> str:
    """Generate a signed JWT for the given user."""
    payload = {
        "sub"  : user_id,
        "role" : role,
        "email": email,
        "exp"  : datetime.utcnow() + timedelta(days=settings.JWT_EXPIRES_DAYS),
        "iat"  : datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT. Returns payload dict or raises JWTError."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
