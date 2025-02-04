# app/__init__.py
import firebase_admin
from firebase_admin import credentials
from quart import Quart
from quart_cors import cors

from .config import config
from .routes.admin import admin_bp
from .routes.collections import collections_bp
from .routes.content import content_bp
from quart_db import QuartDB

from .routes.invoices import invoices_bp


def create_app():
    app = Quart(__name__)
    app.config.from_object(config)
    print("CORS Allowed Origins:", app.config.get("CORS_ORIGINS"))

    app = cors(
        app,
        allow_origin=app.config["CORS_ORIGINS"],
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["Authorization", "Content-Type"],
    )

    db = QuartDB(app, url="sqlite:memory:")
    db.init_app(app)

    # Load service account key (download from Firebase Console)
    cred = credentials.Certificate(app.config["PATH_TO_FIRE_BASE_ADMIN_KEY"])

    # Initialize Firebase Admin SDK (ensure it's only initialized once)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # Register blueprints
    app.register_blueprint(content_bp)
    app.register_blueprint(collections_bp)
    app.register_blueprint(invoices_bp)
    app.register_blueprint(admin_bp)

    return app
