import base64
import json

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
    firebase_key_base64 = app.config["PATH_TO_FIRE_BASE_ADMIN_KEY"]

    firebase_key_json = base64.b64decode(firebase_key_base64).decode("utf-8")
    firebase_key_dict = json.loads(firebase_key_json)

    cred = credentials.Certificate(firebase_key_dict)
    firebase_admin.initialize_app(cred)

    # Initialize Firebase Admin SDK (ensure it's only initialized once)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)

    # Register blueprints
    app.register_blueprint(content_bp)
    app.register_blueprint(collections_bp)
    app.register_blueprint(invoices_bp)
    app.register_blueprint(admin_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run()
