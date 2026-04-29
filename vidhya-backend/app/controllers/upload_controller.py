"""
app/controllers/upload_controller.py  -  File Upload
"""
import os, shutil
from fastapi import HTTPException, UploadFile
from app.models.user import User
from app.utils.response_helper import success_response
from app.config.settings import settings

UPLOAD_DIR  = os.path.join(os.path.dirname(__file__), "..", "uploads")
MAX_BYTES   = settings.MAX_FILE_SIZE_MB * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

os.makedirs(UPLOAD_DIR, exist_ok=True)

def _save_file(file: UploadFile, prefix: str) -> str:
    import uuid
    ext      = os.path.splitext(file.filename)[1].lower() or ".jpg"
    filename = f"{prefix}_{uuid.uuid4().hex}{ext}"
    dest     = os.path.join(UPLOAD_DIR, filename)
    with open(dest, "wb") as out:
        shutil.copyfileobj(file.file, out)
    return f"/uploads/{filename}"


async def upload_avatar(file: UploadFile, current_user: User):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use JPEG, PNG, WEBP or GIF.")
    url = _save_file(file, "avatar")
    current_user.avatar = url
    await current_user.save()
    return success_response("Avatar uploaded.", {"avatar_url": url, "user": current_user.to_safe_dict()})


async def upload_image(file: UploadFile, current_user: User):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use JPEG, PNG, WEBP or GIF.")
    url = _save_file(file, "img")
    return success_response("Image uploaded.", {
        "image_url": url,
        "filename": os.path.basename(url),
        "original_name": file.filename,
    })
