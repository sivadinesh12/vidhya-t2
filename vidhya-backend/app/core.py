"""
app/core.py  –  FastAPI Application Factory
Registers middleware, routers, startup/shutdown events.
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


# ── Rate Limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT])


# ── Lifespan (startup + shutdown) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    logger.info(f"✅  Vidhya server ready  |  env={settings.ENVIRONMENT}")
    yield
    # Shutdown
    await disconnect_db()
    logger.info("Server shutting down gracefully.")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title="Vidhya API",
        description="Production-ready backend for the Vidhya AI Study Platform (NEET/JEE/Boards)",
        version="1.0.0",
        docs_url="/docs",          # Swagger UI at /docs
        redoc_url="/redoc",        # ReDoc at /redoc
        lifespan=lifespan,
    )

    # ── Rate Limiting ─────────────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── CORS ──────────────────────────────────────────────────────────────────
    origins = [o.strip() for o in settings.CLIENT_URL.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Static Files (uploaded images) ────────────────────────────────────────
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

    # ── Health Check ──────────────────────────────────────────────────────────
    @app.get("/health", tags=["Health"])
    async def health():
        return {
            "success": True,
            "message": "Vidhya API is healthy 🚀",
            "env": settings.ENVIRONMENT,
        }

    # ── Register Routers ──────────────────────────────────────────────────────
    PREFIX = "/api/v1"
    app.include_router(auth.router,         prefix=f"{PREFIX}/auth",        tags=["Auth"])
    app.include_router(users.router,        prefix=f"{PREFIX}/users",       tags=["Users"])
    app.include_router(flashcards.router,   prefix=f"{PREFIX}/flashcards",  tags=["Flashcards"])
    app.include_router(study_plans.router,  prefix=f"{PREFIX}/study-plans", tags=["Study Plans"])
    app.include_router(progress.router,     prefix=f"{PREFIX}/progress",    tags=["Progress"])
    app.include_router(uploads.router,      prefix=f"{PREFIX}/upload",      tags=["Uploads"])

    # ── Global Exception Handler ──────────────────────────────────────────────
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error on {request.url}: {exc}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal server error."},
        )

    return app
