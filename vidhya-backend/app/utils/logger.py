"""
app/utils/logger.py  –  Python logging setup
Mirrors the Winston logger from the Node.js version.
Logs to console + rotating file handlers.
"""

import os
import logging
from logging.handlers import RotatingFileHandler

LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")


def setup_logger():
    """Configure the root 'vidhya' logger with console and file handlers."""
    os.makedirs(LOGS_DIR, exist_ok=True)

    logger = logging.getLogger("vidhya")
    logger.setLevel(logging.DEBUG if os.getenv("FLASK_DEBUG") == "1" else logging.INFO)

    # Avoid duplicate handlers on reload
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s: %(message)s",
        datefmt="%H:%M:%S"
    )

    # ── Console handler ──────────────────────────────────────────────────────
    console = logging.StreamHandler()
    console.setFormatter(formatter)
    logger.addHandler(console)

    # ── Combined log file (5 MB, keep 5 backups) ─────────────────────────────
    combined = RotatingFileHandler(
        os.path.join(LOGS_DIR, "combined.log"),
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    combined.setFormatter(logging.Formatter(
        '{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
        datefmt="%Y-%m-%dT%H:%M:%S"
    ))
    logger.addHandler(combined)

    # ── Error-only log file ──────────────────────────────────────────────────
    error_file = RotatingFileHandler(
        os.path.join(LOGS_DIR, "error.log"),
        maxBytes=5 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8"
    )
    error_file.setLevel(logging.ERROR)
    error_file.setFormatter(formatter)
    logger.addHandler(error_file)

    return logger
