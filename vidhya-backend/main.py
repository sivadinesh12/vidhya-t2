"""
main.py  –  Vidhya Backend Entry Point
Starts the FastAPI application with Uvicorn.
"""

import uvicorn
from app.core import create_app

# Create the FastAPI app instance
app = create_app()

if __name__ == "__main__":
    from app.config.settings import settings

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",  # Auto-reload in dev
        log_level="info",
    )
