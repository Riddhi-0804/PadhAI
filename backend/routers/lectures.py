"""
Lectures Router for PadhAI FastAPI backend
Endpoints:
- POST /api/lectures/add: Adds video with transcript chunks and embeddings
- POST /api/lectures/pause-doubt: Timestamp-locked doubt solver with lookahead protection
- GET /api/lectures: List all video lectures
- GET /api/lectures/{video_id}: Get video details and transcript chunks
"""
import uuid
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel

from backend.db.database import get_connection
from backend.ai.client import ai_client
from backend.ai.pause_doubt import (
    get_taught_so_far,
    get_future_chunks,
    summarise_so_far,
    check_answered_later,
    solve,
    leak_guard,
    format_seconds_to_timestamp
)
from backend.routers.auth import decode_jwt_token

router = APIRouter(prefix="/api/lectures", tags=["lectures"])

class AddVideoRequest(BaseModel):
    title: str
    subject: str
    chapter: str
    video_url: str
    duration_seconds: int
    teacher_name: str
    transcript_text: Optional[str] = None

class PauseDoubtRequest(BaseModel):
    video_id: str
    timestamp_seconds: float
    doubt: str
    frame_context: Optional[str] = None
    language: Optional[str] = "en"

def get_auth_user_id(authorization: Optional[str] = Header(None)) -> str:
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_jwt_token(token)
        if payload and "sub" in payload:
            return payload["sub"]
    return "usr_student_01"

@router.post("/add")
async def add_video(
    req: AddVideoRequest,
    user_id: str = Depends(get_auth_user_id)
):
    """
    Adds a new video lecture, parses transcript chunks with start_time & end_time,
    generates embeddings, and stores in SQLite.
    """
    video_id = f"vid_{uuid.uuid4().hex[:10]}"
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO videos (id, title, subject, chapter, video_url, duration_seconds, teacher_name)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            video_id, req.title.strip(), req.subject.strip(), req.chapter.strip(),
            req.video_url.strip(), req.duration_seconds, req.teacher_name.strip()
        ))

        # Generate or store transcript chunks
        raw_transcript = req.transcript_text or (
            "00:00 - 01:30 | Introduction to core concepts and definitions.\n"
            "01:30 - 03:00 | Step-by-step mathematical derivation and physical assumptions.\n"
            "03:00 - 04:30 | Standard numerical problem solving and board exam questions."
        )

        lines = [l.strip() for l in raw_transcript.split("\n") if l.strip()]
        chunks_stored = 0
        texts_to_embed = []
        chunk_metas = []

        for idx, line in enumerate(lines):
            # Parse mm:ss - mm:ss
            match = re.match(r'(\d+):(\d+)\s*-\s*(\d+):(\d+)\s*\|\s*(.*)', line)
            if match:
                m1, s1, m2, s2, text = match.groups()
                start_sec = int(m1) * 60 + int(s1)
                end_sec = int(m2) * 60 + int(s2)
            else:
                start_sec = idx * 60
                end_sec = (idx + 1) * 60
                text = line

            chunk_id = f"chk_tr_{video_id}_{idx}"
            cursor.execute("""
                INSERT INTO transcript_chunks (id, video_id, start_time, end_time, text, section_title)
                VALUES (?, ?, ?, ?, ?, ?);
            """, (chunk_id, video_id, start_sec, end_sec, text, f"Segment {idx + 1}"))
            
            texts_to_embed.append(text)
            chunk_metas.append({
                "chunk_id": chunk_id,
                "note_id": video_id,
                "user_id": user_id,
                "page_number": idx + 1,
                "heading": f"Lecture Segment ({format_seconds_to_timestamp(start_sec)})",
                "content": text
            })
            chunks_stored += 1

        conn.commit()

        # Generate vector embeddings
        if texts_to_embed:
            vectors = ai_client.get_embeddings(texts_to_embed)
            from backend.vector_store.store import vector_store
            vector_items = [{**meta, "vector": vectors[i]} for i, meta in enumerate(chunk_metas)]
            vector_store.store_chunks(vector_items)

        return {
            "status": "success",
            "video_id": video_id,
            "title": req.title,
            "chunks_count": chunks_stored,
            "message": "Video lecture and timestamped transcript indexed with vector embeddings."
        }
    finally:
        conn.close()

@router.post("/pause-doubt")
async def pause_doubt(
    req: PauseDoubtRequest,
    user_id: str = Depends(get_auth_user_id)
):
    """
    Pause-point doubt solver:
    1. get_taught_so_far(video_id, t) -> strictly end_time <= t in SQL
    2. solve -> evaluates answer_now, answered_later, or not_covered
    3. leak_guard -> verifies no future facts leak
    Logs event into SQLite doubts table with answered_later and later_timestamp.
    """
    t = req.timestamp_seconds
    vid = req.video_id
    doubt_text = req.doubt.strip()

    if not doubt_text:
        raise HTTPException(status_code=400, detail="Doubt cannot be empty.")

    # 1. Strictly database-filtered query
    taught_so_far = get_taught_so_far(vid, t)

    # 2. Solve outcome
    result = solve(
        doubt=doubt_text,
        taught_so_far=taught_so_far,
        frame_context=req.frame_context,
        video_id=vid,
        t=t,
        language=req.language or "en"
    )

    # 3. Log doubt in SQLite
    doubt_id = f"dbt_{uuid.uuid4().hex[:10]}"
    answered_later_int = 1 if result.get("outcome") == "answered_later" else 0
    later_ts_str = result.get("timestamp")
    later_ts_float = None
    if later_ts_str:
        parts = later_ts_str.split(":")
        if len(parts) == 2:
            later_ts_float = float(int(parts[0]) * 60 + int(parts[1]))

    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO doubts (id, user_id, video_id, timestamp_seconds, question, answer, outcome_type, answered_later, later_timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            doubt_id,
            user_id,
            vid,
            t,
            doubt_text,
            result.get("answer") or result.get("hint", ""),
            result.get("outcome", "answer_now"),
            answered_later_int,
            later_ts_float
        ))
        conn.commit()
    finally:
        conn.close()

    result["doubt_id"] = doubt_id
    result["timestamp_formatted"] = format_seconds_to_timestamp(t)
    result["taught_chunks_count"] = len(taught_so_far)
    return result

@router.get("")
async def list_videos():
    """Retrieve all available video lectures."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM videos ORDER BY created_at DESC;")
        rows = cursor.fetchall()
        return {"videos": [dict(r) for r in rows]}
    finally:
        conn.close()

@router.get("/{video_id}")
async def get_video(video_id: str):
    """Retrieve video details and all transcript chunks."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM videos WHERE id = ?;", (video_id,))
        v_row = cursor.fetchone()
        if not v_row:
            raise HTTPException(status_code=404, detail="Video not found")

        cursor.execute("""
            SELECT * FROM transcript_chunks
            WHERE video_id = ?
            ORDER BY start_time ASC;
        """, (video_id,))
        chunks = [dict(c) for c in cursor.fetchall()]

        return {"video": dict(v_row), "transcript_chunks": chunks}
    finally:
        conn.close()
