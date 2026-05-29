"""
app/config/database.py  -  MongoDB Connection (Motor + Beanie)
"""
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from loguru import logger
from app.config.settings import settings

_client: AsyncIOMotorClient = None

async def connect_db():
    global _client
    from app.models.user import User
    from app.models.flashcard import Flashcard
    from app.models.study_plan import StudyPlan
    from app.models.progress import Progress
    from app.models.chat import ChatSession
    from app.models.mock_test import MockTest, TestAttempt
    from app.models.notification import Notification
    from app.models.password_reset import PasswordResetToken

    try:
        _client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000,
            tls=True,
            tlsAllowInvalidCertificates=True,
        )

        db_name = settings.MONGODB_URI.split("/")[-1].split("?")[0] or "vidhyadb"
        db = _client[db_name]

        await init_beanie(
            database=db,
            document_models=[
                User, Flashcard, StudyPlan, Progress,
                ChatSession, MockTest, TestAttempt,
                Notification, PasswordResetToken,
            ],
        )
        logger.info(f"✅ MongoDB connected to: {db_name}")

    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        logger.warning("⚠️  Server starting WITHOUT database — login/signup will not work until MongoDB connects.")
        # Don't raise — let server start anyway

async def disconnect_db():
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")
