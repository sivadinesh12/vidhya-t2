"""
app/core.py  -  FastAPI Application Factory
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger
import os

from app.config.settings import settings
from app.config.database import connect_db, disconnect_db

# ── Route Imports ─────────────────────────────────────────────────────────────
from app.routes import auth, users, flashcards, study_plans, progress, uploads
from app.routes import chat, mock_tests, notifications, password_reset, analytics


def rate_limit_key(request: Request):
    """Skip rate limiting for CORS preflight OPTIONS requests."""
    if request.method == "OPTIONS":
        return None
    return get_remote_address(request)


limiter = Limiter(key_func=rate_limit_key, default_limits=[settings.RATE_LIMIT])


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    logger.info(f"✅  Vidhya server ready  |  env={settings.ENVIRONMENT}")
    yield
    await disconnect_db()
    logger.info("Server shutting down gracefully.")


def create_app() -> FastAPI:
    app = FastAPI(
        title="Vidhya API",
        description="Production-ready backend for Vidhya AI Study Platform (NEET/JEE/Boards)",
        version="2.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Parse allowed origins from settings (comma-separated)
    origins = [o.strip() for o in settings.CLIENT_URL.split(",")]
    logger.info(f"🌐 CORS allowed origins: {origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

    @app.get("/health", tags=["Health"])
    async def health():
        return {
            "success": True,
            "message": "Vidhya API is healthy 🚀",
            "env": settings.ENVIRONMENT,
        }

    # ── Register all routers ──────────────────────────────────────────────────
    PREFIX = "/api/v1"
    app.include_router(auth.router,           prefix=f"{PREFIX}/auth",          tags=["Auth"])
    app.include_router(password_reset.router, prefix=f"{PREFIX}/auth",          tags=["Auth"])
    app.include_router(users.router,          prefix=f"{PREFIX}/users",         tags=["Users"])
    app.include_router(flashcards.router,     prefix=f"{PREFIX}/flashcards",    tags=["Flashcards"])
    app.include_router(study_plans.router,    prefix=f"{PREFIX}/study-plans",   tags=["Study Plans"])
    app.include_router(progress.router,       prefix=f"{PREFIX}/progress",      tags=["Progress"])
    app.include_router(uploads.router,        prefix=f"{PREFIX}/upload",        tags=["Uploads"])
    app.include_router(chat.router,           prefix=f"{PREFIX}/chat",          tags=["VIDYA AI Chat"])
    app.include_router(mock_tests.router,     prefix=f"{PREFIX}/mock-tests",    tags=["Mock Tests"])
    app.include_router(notifications.router,  prefix=f"{PREFIX}/notifications", tags=["Notifications"])
    app.include_router(analytics.router,      prefix=f"{PREFIX}/analytics",     tags=["Analytics"])

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error on {request.url}: {exc}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal server error."},
        )

    return app
