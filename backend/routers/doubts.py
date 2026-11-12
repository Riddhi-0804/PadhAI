"""
Doubts Router for PadhAI FastAPI backend
Endpoints:
- POST /api/doubts/ask: runs Understand-First pipeline and stores doubt log
- GET /api/doubts/history: lists student's past doubts
"""
import uuid
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel

from backend.db.database import get_connection
from backend.ai.client import ai_client
from backend.routers.auth import decode_jwt_token

router = APIRouter(prefix="/api/doubts", tags=["doubts"])

class AskDoubtRequest(BaseModel):
    question: str
    mode: str = "simple"
    detected_override: Optional[Dict[str, Any]] = None

def get_current_user_obj(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_jwt_token(token)
        if payload and "sub" in payload:
            return {
                "id": payload["sub"],
                "email": payload.get("email"),
                "name": payload.get("name"),
                "role": payload.get("role")
            }
    return {
        "id": "usr_student_01",
        "email": "arjun.sharma@student.padhai.in",
        "name": "Arjun Sharma",
        "role": "student"
    }

@router.post("/ask")
async def ask_doubt(
    req: AskDoubtRequest,
    user: Dict[str, Any] = Depends(get_current_user_obj)
):
    """
    Executes the 4-stage understand pipeline:
    1. detect(question) -> {language, question_type, topic, level}
    2. gather_context(user, detected) -> relevant note chunks + weak topics
    3. needs_clarification(detected, context) -> 2-4 options or null
    4. answer(question, detected, context, mode) -> grounded annotation
    Logs entry to SQLite doubts table.
    """
    q_clean = req.question.strip()
    if not q_clean:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    result = ai_client.run_understand_pipeline(
        question=q_clean,
        user=user,
        mode=req.mode,
        detected_override=req.detected_override
    )

    # Persist into SQLite doubts table
    doubt_id = f"dbt_{uuid.uuid4().hex[:10]}"
    source_citation = ""
    if result.get("citations") and len(result["citations"]) > 0:
        c = result["citations"][0]
        source_citation = f"{c.get('source', '')} - {c.get('section', '')}"

    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO doubts (id, user_id, question, answer, source_citation, confidence_score, outcome_type)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            doubt_id,
            user["id"],
            q_clean,
            result["answer"],
            source_citation,
            0.95 if result["confidence"] == "High" else (0.75 if result["confidence"] == "Medium" else 0.40),
            "ask_notes_chat"
        ))
        conn.commit()
    finally:
        conn.close()

    result["id"] = doubt_id
    return result

@router.get("/history")
async def get_doubt_history(user: Dict[str, Any] = Depends(get_current_user_obj)):
    """Retrieve student's recent doubts log."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM doubts
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 15;
        """, (user["id"],))
        rows = cursor.fetchall()
        return {"history": [dict(r) for r in rows]}
    finally:
        conn.close()
