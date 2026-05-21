"""
app/middleware/auth_middleware.py  -  Authentication & Authorization Dependencies

get_current_user  - verifies JWT, returns User document
require_admin     - extends get_current_user, enforces admin role

Usage in routes:
    @router.get("/me")
    async def me(user: User = Depends(get_current_user)): ...

    @router.get("/admin")
    async def admin_only(user: User = Depends(require_admin)): ...
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError

from app.models.user import User
from app.utils.jwt_helper import decode_access_token

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> User:
    """
    Verify the Bearer JWT and return the authenticated User.
    Raises 401 if token is missing, invalid, or expired.
    Raises 403 if account is deactivated.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found. Please sign up again.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account deactivated. Contact support.",
        )

    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    """Extends get_current_user — raises 403 if user is not an admin."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin role required.",
        )
    return user
