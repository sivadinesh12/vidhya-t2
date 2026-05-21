import uvicorn
from app.core import create_app

app = create_app()

if __name__ == "__main__":
    from app.config.settings import settings
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
        log_level="info",
    )
