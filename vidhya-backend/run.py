"""
run.py  –  Vidhya Backend (Python/Flask) Entry Point
Loads environment variables, creates the app, and starts the server.
"""

import os
from dotenv import load_dotenv

# Load .env before anything else
load_dotenv()

from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"

    print(f"✅  Vidhya server running on http://localhost:{port}")
    print(f"📚  Environment : {os.getenv('FLASK_ENV', 'development')}")

    app.run(host="0.0.0.0", port=port, debug=debug)
