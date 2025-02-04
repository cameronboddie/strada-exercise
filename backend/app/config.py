import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "default-secret-key")
    DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

    # Dynamically set database URL based on environment
    ENV = os.environ.get("ENV", "development").lower()
    DATABASE_URL = os.environ.get("DATABASE_URL")
    PATH_TO_FIRE_BASE_ADMIN_KEY = os.environ.get("PATH_TO_FIRE_BASE_ADMIN_KEY")
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS")

    @classmethod
    def print_config(cls):
        print(f"Running in {cls.ENV.upper()} mode")
        print(f"Debug: {cls.DEBUG}")


config = Config()

config.print_config()
