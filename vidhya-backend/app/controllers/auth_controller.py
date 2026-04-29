"""
app/controllers/auth_controller.py  -  Authentication Logic
signup, login, google_auth, get_me
"""
from datetime import datetime
from fastapi import HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.models.user import User, UserSignupSchema, UserLoginSchema, GoogleAuthSchema
from app.models.progress import Progress, Milestone
from app.utils.jwt_helper import create_access_token
from app.utils.response_helper import success_response, error_response
from app.config.settings import settings


async def _create_initial_progress(user_id: str):
    """Bootstrap a blank progress document for a new user."""
    await Progress(
        owner_id=str(user_id),
        milestones=[
            Milestone(icon="🚀", title="Account Created", achieved=True, achieved_at=datetime.utcnow()),
            Milestone(icon="📖", title="First Study Session"),
            Milestone(icon="🔥", title="7-Day Study Streak"),
            Milestone(icon="🃏", title="Reviewed 50 Flashcards"),
            Milestone(icon="🧪", title="Completed First Mock Test"),
        ],
    ).insert()


async def signup(body: UserSignupSchema):
    # Check duplicate email
    existing = await User.find_one(User.email == body.email.lower())
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    user = User(
        name=body.name,
        email=body.email.lower(),
        target_exam=body.target_exam,
        target_year=body.target_year,
    )
    user.set_password(body.password)
    user.last_login = datetime.utcnow()
    await user.insert()

    await _create_initial_progress(str(user.id))
    token = create_access_token(str(user.id), user.role, user.email)

    return success_response("Account created successfully.", {
        "token": token, "user": user.to_safe_dict()
    }, status=201)


async def login(body: UserLoginSchema):
    user = await User.find_one(User.email == body.email.lower())

    if not user or not user.verify_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated. Contact support.")

    user.last_login = datetime.utcnow()
    await user.save()

    token = create_access_token(str(user.id), user.role, user.email)
    return success_response("Login successful.", {"token": token, "user": user.to_safe_dict()})


async def google_auth(body: GoogleAuthSchema):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured on server.")

    try:
        info = id_token.verify_oauth2_token(
            body.credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google token invalid: {str(e)}")

    google_id = info["sub"]
    email     = info.get("email", "")
    name      = info.get("name", "Google User")
    picture   = info.get("picture")

    user = await User.find_one({"$or": [{"google_id": google_id}, {"email": email}]})

    if user:
        if not user.google_id:
            user.google_id = google_id
        if picture and not user.avatar:
            user.avatar = picture
        user.last_login = datetime.utcnow()
        await user.save()
    else:
        user = User(name=name, email=email, google_id=google_id, avatar=picture)
        await user.insert()
        await _create_initial_progress(str(user.id))

    token = create_access_token(str(user.id), user.role, user.email)
    return success_response("Google authentication successful.", {
        "token": token, "user": user.to_safe_dict()
    })


async def get_me(current_user: User):
    return success_response("Profile fetched.", current_user.to_safe_dict())
