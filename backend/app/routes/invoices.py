from quart import Blueprint, jsonify

from app.middleware.authentication import auth_required
from app.services.invoices_service import get_all_invoices

invoices_bp = Blueprint("invoices", __name__, url_prefix="/invoices")


@invoices_bp.route("/", methods=["GET"])
@auth_required
async def get_invoices():
    invoices = await get_all_invoices()
    return jsonify(invoices)
