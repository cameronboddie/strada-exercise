from quart import Blueprint, request, jsonify

from backend.app.middleware.authentication import auth_required
from backend.app.services.content_service import add_content, get_all_content

content_bp = Blueprint("content", __name__, url_prefix="/content")


@content_bp.route("/", methods=["POST"])
@auth_required
async def create_content():
    data = await request.json
    response = await add_content(data)
    return response


@content_bp.route("/", methods=["GET"])
@auth_required
async def list_all_content():
    result = await get_all_content()
    return jsonify(result)
