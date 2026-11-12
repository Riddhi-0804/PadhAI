"""
PadhAI Vector Store
-------------------
Embeddings storage and cosine similarity retrieval engine for student note chunks.
Uses SQLite for persistent storage with vectorized float buffers and exact cosine scoring.
"""
import json
import math
import sqlite3
from typing import List, Dict, Any, Optional
from backend.db.database import get_connection

def init_vector_table():
    conn = get_connection()
    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS chunk_embeddings (
                id TEXT PRIMARY KEY,
                chunk_id TEXT NOT NULL,
                note_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                page_number INTEGER NOT NULL,
                heading TEXT,
                content TEXT NOT NULL,
                vector_json TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(chunk_id) REFERENCES note_chunks(id) ON DELETE CASCADE,
                FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
            );
        """)
        conn.commit()
    finally:
        conn.close()

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    norm_a = math.sqrt(sum(a * a for a in v1)) or 1.0
    norm_b = math.sqrt(sum(b * b for b in v2)) or 1.0
    return dot / (norm_a * norm_b)

class VectorStore:
    def __init__(self):
        init_vector_table()

    def store_chunks(
        self,
        chunks_with_vectors: List[Dict[str, Any]]
    ):
        conn = get_connection()
        try:
            cursor = conn.cursor()
            for item in chunks_with_vectors:
                cursor.execute("""
                    INSERT OR REPLACE INTO chunk_embeddings 
                    (id, chunk_id, note_id, user_id, page_number, heading, content, vector_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    item["chunk_id"],
                    item["chunk_id"],
                    item["note_id"],
                    item["user_id"],
                    item["page_number"],
                    item.get("heading") or "General Chapter Note",
                    item["content"],
                    json.dumps(item["vector"])
                ))
            conn.commit()
        finally:
            conn.close()

    def search_similar(
        self,
        query_vector: List[float],
        user_id: Optional[str] = None,
        subject: Optional[str] = None,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        conn = get_connection()
        try:
            cursor = conn.cursor()
            if user_id:
                cursor.execute("SELECT * FROM chunk_embeddings WHERE user_id = ?;", (user_id,))
            else:
                cursor.execute("SELECT * FROM chunk_embeddings;")
            rows = cursor.fetchall()

            scored = []
            for r in rows:
                vector = json.loads(r["vector_json"])
                sim = cosine_similarity(query_vector, vector)
                scored.append({
                    "chunk_id": r["chunk_id"],
                    "note_id": r["note_id"],
                    "page_number": r["page_number"],
                    "heading": r["heading"],
                    "content": r["content"],
                    "similarity": round(sim, 4)
                })

            scored.sort(key=lambda x: x["similarity"], reverse=True)
            return scored[:top_k]
        finally:
            conn.close()

    def delete_note_embeddings(self, note_id: str):
        conn = get_connection()
        try:
            conn.execute("DELETE FROM chunk_embeddings WHERE note_id = ?;", (note_id,))
            conn.commit()
        finally:
            conn.close()

vector_store = VectorStore()
