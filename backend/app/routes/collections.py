from quart import jsonify
from quart import Blueprint, request

from backend.app.middleware.authentication import auth_required
from backend.app.services.collections_service import (
    add_collection,
    get_collection_by_id,
    get_collections,
    get_sub_collections_by_id,
    get_content_by_collection_id, update_collection_by_id
)

collections_bp = Blueprint("collections", __name__, url_prefix="/collections")


@collections_bp.route("/", methods=["POST"])
@auth_required
async def create_collection():
    data = await request.json
    response = await add_collection(data)
    return response

@collections_bp.route("/<int:collection_id>", methods=["PATCH"])
@auth_required
async def update_collection(collection_id):
    data = await request.json
    response = await update_collection_by_id(collection_id, data)
    return response



@collections_bp.route("/", methods=["GET"])
@auth_required
async def list_collections():
    collections = await get_collections()
    return jsonify(collections)


@collections_bp.route("/<int:collection_id>", methods=["GET"])
@auth_required
async def get_collection(collection_id):
    collection = await get_collection_by_id(collection_id)
    return jsonify(collection)

@collections_bp.route("/<int:collection_id>/collections", methods=["GET"])
@auth_required
async def get_sub_collections(collection_id):
    collections = await get_sub_collections_by_id(collection_id)
    return jsonify(collections)

@collections_bp.route("/<int:collection_id>/content", methods=["GET"])
@auth_required
async def get_collection_content(collection_id):
    content = await get_content_by_collection_id(collection_id)
    return jsonify(content)


