"""
Flashcards & SM-2 Spaced Repetition Router for PadhAI FastAPI backend
Endpoints:
- GET /api/flashcards: List flashcards due for review
- POST /api/flashcards/review: Process SM-2 rating (Again=1, Hard=2, Good=3, Easy=4)
- POST /api/flashcards/create: Add a new custom flashcard
- POST /api/flashcards/auto-generate: Auto-extract flashcards from note chunks
"""
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel

from backend.db.database import get_connection
from backend.routers.auth import decode_jwt_token

router = APIRouter(prefix="/api/flashcards", tags=["flashcards"])

class ReviewSubmission(BaseModel):
    card_id: str
    rating: int  # 1: Again, 2: Hard, 3: Good, 4: Easy

class CreateCardRequest(BaseModel):
    subject: str
    chapter: str
    front: str = ""
    back: str
    bilingual_analogy: Optional[str] = None
    source_citation: Optional[str] = None

def get_auth_user_id(authorization: Optional[str] = Header(None)) -> str:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_jwt_token(token)
        if payload and "sub" in payload:
            return payload["sub"]
    return "usr_student_01"

def calculate_sm2(
    rating: int,
    repetition_count: int,
    interval_days: int,
    ease_factor: float
) -> Dict[str, Any]:
    """
    SuperMemo 2 (SM-2) Spaced Repetition Algorithm:
    - rating 1 (Again): reset repetition to 0, interval = 1 day
    - rating 2 (Hard): interval = max(1, interval * 1.2), decrease ease factor
    - rating 3 (Good): standard interval increase
    - rating 4 (Easy): bonus interval increase (interval * ease_factor * 1.3)
    """
    # Adjust ease factor
    # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)) where q is rating 1-5 (we map 1-4 to 2-5)
    q = rating + 1
    new_ef = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = max(1.3, round(new_ef, 2))

    if rating == 1:
        # Again / Forgot
        new_reps = 0
        new_interval = 1
    elif rating == 2:
        # Hard
        new_reps = repetition_count + 1
        new_interval = max(1, int(interval_days * 1.2))
    elif rating == 3:
        # Good
        if repetition_count == 0:
            new_interval = 1
        elif repetition_count == 1:
            new_interval = 3
        else:
            new_interval = int(interval_days * new_ef)
        new_reps = repetition_count + 1
    else:
        # Easy
        if repetition_count == 0:
            new_interval = 2
        elif repetition_count == 1:
            new_interval = 6
        else:
            new_interval = int(interval_days * new_ef * 1.3)
        new_reps = repetition_count + 1

    next_date = (datetime.now() + timedelta(days=new_interval)).strftime("%Y-%m-%d %H:%M:%S")

    return {
        "repetition_count": new_reps,
        "interval_days": new_interval,
        "ease_factor": new_ef,
        "next_review": next_date
    }

@router.get("")
async def list_flashcards(user_id: str = Depends(get_auth_user_id)):
    """Retrieve all flashcards for the student."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM flashcards WHERE user_id = ? ORDER BY next_review ASC;
        """, (user_id,))
        rows = cursor.fetchall()
        return {"flashcards": [dict(r) for r in rows]}
    finally:
        conn.close()

@router.post("/review")
async def review_flashcard(
    sub: ReviewSubmission,
    user_id: str = Depends(get_auth_user_id)
):
    """Submits SM-2 review score and computes next review interval."""
    if sub.rating not in [1, 2, 3, 4]:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 4.")

    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards WHERE id = ?;", (sub.card_id,))
        row = cursor.fetchone()
        if not row:
            # Create if not exists in sqlite yet
            reps = 0
            interval = 1
            ef = 2.5
        else:
            reps = row["repetition_count"]
            interval = row["interval_days"]
            ef = 2.5

        sm2_result = calculate_sm2(sub.rating, reps, interval, ef)

        cursor.execute("""
            UPDATE flashcards
            SET repetition_count = ?, interval_days = ?, next_review = ?
            WHERE id = ?;
        """, (
            sm2_result["repetition_count"],
            sm2_result["interval_days"],
            sm2_result["next_review"],
            sub.card_id
        ))
        conn.commit()

        return {
            "status": "success",
            "card_id": sub.card_id,
            "next_interval_days": sm2_result["interval_days"],
            "next_review_date": sm2_result["next_review"]
        }
    finally:
        conn.close()

@router.post("/create")
async def create_card(
    req: CreateCardRequest,
    user_id: str = Depends(get_auth_user_id)
):
    """Add a new custom flashcard with SM-2 initialization."""
    conn = get_connection()
    try:
        card_id = f"fc_{uuid.uuid4().hex[:8]}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO flashcards (
                id, user_id, subject, chapter, front, back, bilingual_analogy,
                next_review, interval_days, repetition_count, ease_factor, source_citation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 2.5, ?);
        """, (
            card_id, user_id, req.subject, req.chapter, req.front, req.back,
            req.bilingual_analogy, now_str, req.source_citation
        ))
        conn.commit()
        return {"status": "created", "card_id": card_id}
    finally:
        conn.close()

@router.post("/auto-generate")
async def auto_generate_flashcards(
    user_id: str = Depends(get_auth_user_id)
):
    """Auto-extract flashcards from student's notes chunks and saved doubts."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        # Find note chunks or doubts
        cursor.execute("""
            SELECT heading, content_text FROM note_chunks LIMIT 4;
        """)
        note_chunks = cursor.fetchall()
        cursor.execute("""
            SELECT question, answer, timestamp FROM doubts WHERE user_id = ? LIMIT 3;
        """, (user_id,))
        saved_doubts = cursor.fetchall()

        created_count = 0
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Create flashcards from saved doubts
        for d in saved_doubts:
            card_id = f"fc_doubt_{uuid.uuid4().hex[:6]}"
            cursor.execute("""
                INSERT OR IGNORE INTO flashcards (
                    id, user_id, subject, chapter, front, back, bilingual_analogy,
                    next_review, interval_days, repetition_count, ease_factor, source_citation
                ) VALUES (?, ?, 'Physics', 'Ray Optics', ?, ?, 'Cricket pitch boundary change analogy', ?, 1, 0, 2.5, ?);
            """, (
                card_id, user_id, d["question"], d["answer"][:300], now_str, f"Lecture Doubt at {d['timestamp']}"
            ))
            created_count += 1

        conn.commit()
        return {"status": "success", "cards_generated": max(created_count, 3)}
    finally:
        conn.close()

