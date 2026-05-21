"""
app/controllers/auth_controller.py  -  Authentication Controller
Handles: signup, login, Google OAuth, get_me, logout
All sessions saved to MongoDB. Users can re-login anytime.
"""
from datetime import datetime
from fastapi import HTTPException
from loguru import logger

from app.models.user import User, UserSignupSchema, UserLoginSchema, GoogleAuthSchema
from app.models.progress import Progress, Milestone
from app.models.notification import Notification, NotifType
from app.utils.jwt_helper import create_access_token
from app.utils.response_helper import success_response
from app.config.settings import settings


# ── Helper: create initial progress doc for new user ─────────────────────────
async def _create_initial_progress(user_id: str):
    await Progress(
        owner_id=str(user_id),
        milestones=[
            Milestone(icon="🚀", title="Account Created",          achieved=True,  achieved_at=datetime.utcnow()),
            Milestone(icon="📖", title="First Study Session",       achieved=False),
            Milestone(icon="🔥", title="7-Day Study Streak",        achieved=False),
            Milestone(icon="🃏", title="Reviewed 50 Flashcards",    achieved=False),
            Milestone(icon="🧪", title="Completed First Mock Test", achieved=False),
        ],
    ).insert()


# ── Helper: send welcome notification ────────────────────────────────────────
async def _send_welcome_notification(user_id: str, name: str):
    await Notification(
        owner_id=str(user_id),
        type=NotifType.system,
        title=f"Welcome to Vidhya, {name}! 🎉",
        message="Your account is ready. Start your NEET/JEE preparation journey today!",
        icon="🎓",
        link="/home",
    ).insert()


# ── POST /api/v1/auth/signup ──────────────────────────────────────────────────
async def signup(body: UserSignupSchema):
    # Check for duplicate email
    existing = await User.find_one(User.email == body.email.lower())
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    # Create user — password hashed inside set_password()
    user = User(
        name        = body.name,
        email       = body.email.lower(),
        target_exam = body.target_exam,
        target_year = body.target_year,
        last_login  = datetime.utcnow(),
        created_at  = datetime.utcnow(),
        updated_at  = datetime.utcnow(),
    )
    user.set_password(body.password)
    await user.insert()

    # Create linked documents
    await _create_initial_progress(str(user.id))
    await _send_welcome_notification(str(user.id), user.name)

    token = create_access_token(str(user.id), user.role, user.email)
    logger.info(f"✅ New signup: {user.email} | exam={user.target_exam}")

    return success_response("Account created successfully.", {
        "token": token,
        "user" : user.to_safe_dict(),
    }, status=201)


# ── POST /api/v1/auth/login ───────────────────────────────────────────────────
async def login(body: UserLoginSchema):
    user = await User.find_one(User.email == body.email.lower())

    if not user:
        raise HTTPException(status_code=401, detail="No account found with this email.")

    # Google-only accounts have no password
    if not user.password:
        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In. Please login with Google."
        )

    if not user.verify_password(body.password):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated. Contact support.")

    # Update last login timestamp
    user.last_login = datetime.utcnow()
    user.updated_at = datetime.utcnow()
    await user.save()

    token = create_access_token(str(user.id), user.role, user.email)
    logger.info(f"✅ Login: {user.email} | role={user.role} | at={user.last_login}")

    return success_response("Login successful.", {
        "token": token,
        "user" : user.to_safe_dict(),
    })


# ── POST /api/v1/auth/google ──────────────────────────────────────────────────
async def google_auth(body: GoogleAuthSchema):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured on server.")

    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        import requests as req_lib

        request_session = google_requests.Request(session=req_lib.Session())
        info = id_token.verify_oauth2_token(
            body.credential,
            request_session,
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception as e:
        logger.error(f"Google token verification error: {e}")
        raise HTTPException(status_code=401, detail="Invalid Google token. Please try again.")

    google_id = info.get("sub")
    email     = info.get("email", "").lower()
    name      = info.get("name", "Student")
    picture   = info.get("picture")
    is_new    = False

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email address.")

    # Find by google_id OR email (handles account linking)
    user = await User.find_one({"$or": [{"google_id": google_id}, {"email": email}]})

    if user:
        # Link google_id if not already linked
        if not user.google_id:
            user.google_id = google_id
        if picture and not user.avatar:
            user.avatar = picture
        user.last_login = datetime.utcnow()
        user.updated_at = datetime.utcnow()
        await user.save()
    else:
        is_new = True
        user = User(
            name       = name,
            email      = email,
            google_id  = google_id,
            avatar     = picture,
            last_login = datetime.utcnow(),
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow(),
        )
        await user.insert()
        await _create_initial_progress(str(user.id))
        await _send_welcome_notification(str(user.id), user.name)

    token = create_access_token(str(user.id), user.role, user.email)
    logger.info(f"✅ Google auth: {user.email} | new={is_new}")

    return success_response(
        "Account created via Google." if is_new else "Google login successful.",
        {"token": token, "user": user.to_safe_dict(), "is_new_user": is_new},
    )


# ── GET /api/v1/auth/me ───────────────────────────────────────────────────────
async def get_me(current_user: User):
    return success_response("Profile fetched.", current_user.to_safe_dict())


# ── POST /api/v1/auth/logout ──────────────────────────────────────────────────
async def logout(current_user: User):
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    logger.info(f"👋 Logout: {current_user.email}")
    return success_response("Logged out successfully.")
