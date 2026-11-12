"""
SQLite Database connection and management for PadhAI.
"""
import os
import sqlite3
from typing import Generator
from backend.config import settings

def get_db_path() -> str:
    path = settings.SQLITE_DB_PATH
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    return path

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    from backend.db.models import SCHEMA_SQL
    conn = get_connection()
    try:
        conn.executescript(SCHEMA_SQL)
        conn.commit()
    finally:
        conn.close()
