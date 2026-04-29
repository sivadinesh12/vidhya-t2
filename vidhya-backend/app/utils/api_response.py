"""
app/utils/api_response.py  –  Standardised API response helpers

All responses follow the envelope:
  { success: bool, message: str, data?: any, meta?: any, errors?: any }
"""

from flask import jsonify


def send_success(status=200, message="Success", data=None, meta=None):
    body = {"success": True, "message": message}
    if data is not None:
        body["data"] = data
    if meta is not None:
        body["meta"] = meta
    return jsonify(body), status


def send_error(status=500, message="Internal Server Error", errors=None):
    body = {"success": False, "message": message}
    if errors is not None:
        body["errors"] = errors
    return jsonify(body), status
