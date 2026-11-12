"""
Configuration settings for PadhAI FastAPI backend.
Pure Python implementation with no external package requirements for portability.
"""
import os

class Settings:
    def __init__(self):
        self.APP_NAME: str = os.getenv("APP_NAME", "PadhAI Backend")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        self.MOCK_AI: bool = os.getenv("MOCK_AI", "true").lower() in ("true", "1", "yes")
        self.GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        self.SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "./backend/data/padhai.db")
        self.VECTOR_DB_DIR: str = os.getenv("VECTOR_DB_DIR", "./backend/data/chroma")
        self.PORT: int = int(os.getenv("PORT", "8000"))
        self.JWT_SECRET: str = os.getenv("JWT_SECRET", "padhai_jwt_secret_key_2025")

settings = Settings()
