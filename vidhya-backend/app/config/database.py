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

    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_name = settings.MONGODB_URI.split("/")[-1].split("?")[0] or "vidhya"
    db = _client[db_name]

    await init_beanie(
        database=db,
        document_models=[User, Flashcard, StudyPlan, Progress],
    )
    logger.info(f"MongoDB connected: {settings.MONGODB_URI}")

async def disconnect_db():
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")
