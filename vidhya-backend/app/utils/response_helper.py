"""
app/utils/response_helper.py  -  Standardised API response helpers
All responses: { success, message, data?, meta? }
"""
from typing import Any, Optional
from fastapi.responses import JSONResponse

def success_response(message: str, data: Any = None, meta: Any = None, status: int = 200):
    body = {"success": True, "message": message}
    if data is not None:
        body["data"] = data
    if meta is not None:
        body["meta"] = meta
    return JSONResponse(status_code=status, content=body)

def error_response(message: str, status: int = 400, errors: Any = None):
    body = {"success": False, "message": message}
    if errors is not None:
        body["errors"] = errors
    return JSONResponse(status_code=status, content=body)
