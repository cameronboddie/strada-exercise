from quart import Blueprint, request, jsonify

from backend.app.middleware.authentication import auth_required
from backend.app.services.admin_service import update_firebase_user

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.route("/user", methods=["POST"])
async def update_user():
    data = await request.json
    response = await update_firebase_user(data)
    return jsonify(response)