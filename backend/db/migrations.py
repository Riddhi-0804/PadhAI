"""
PadhAI SQLite Migration Runner.
Executes base DDL and records schema migration versions.
"""
import sqlite3
from backend.db.database import get_connection, init_db

CURRENT_VERSION = 1

def run_migrations():
    """Initializes tables and stamps schema version."""
    init_db()
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(version) FROM schema_migrations;")
        row = cursor.fetchone()
        last_version = row[0] if row and row[0] is not None else 0

        if last_version < CURRENT_VERSION:
            cursor.execute(
                "INSERT INTO schema_migrations (version) VALUES (?);",
                (CURRENT_VERSION,)
            )
            conn.commit()
            print(f"[PadhAI Migrations] Successfully applied migration version {CURRENT_VERSION}.")
        else:
            print(f"[PadhAI Migrations] Database already up to date at version {last_version}.")
    finally:
        conn.close()

if __name__ == "__main__":
    run_migrations()
