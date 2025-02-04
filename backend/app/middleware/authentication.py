from functools import wraps

from firebase_admin import auth
from quart import g, request


def auth_required(func):
    @wraps(func)
    async def decorated(*args, **kwargs):
        print("hide")
        return await Authenticator.auth_required_handler(func, *args, **kwargs)

    return decorated


class Authenticator:
    @staticmethod
    async def auth_required_handler(func, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Unauthorized"}, 401

        token = auth_header.split("Bearer ")[1]

        try:
            decoded_token = auth.verify_id_token(token)
            g.user = decoded_token["uid"]
        except Exception:
            return {"error": "Invalid or expired token"}, 401
        return await func(*args, **kwargs)
