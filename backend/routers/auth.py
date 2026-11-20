"""
Authentication & Onboarding Router for PadhAI FastAPI backend.
Pure-Python cryptographic hashing and token handling with SQLite persistence.
"""
import base64
import hashlib
import hmac
import json
import re
import time
import uuid
from typing import Dict, Any, Optional
from backend.config import settings
from backend.db.database import get_connection
from backend.db.seed import hash_password, verify_password

def create_jwt_token(payload: Dict[str, Any], expires_in_seconds: int = 86400 * 7) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    body = {**payload, "exp": int(time.time()) + expires_in_seconds}
    
    encoded_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    encoded_body = base64.urlsafe_b64encode(json.dumps(body).encode()).decode().rstrip("=")
    
    signing_input = f"{encoded_header}.{encoded_body}".encode()
    signature = hmac.new(settings.JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
    encoded_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{encoded_header}.{encoded_body}.{encoded_sig}"

def decode_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        encoded_header, encoded_body, encoded_sig = parts
        
        signing_input = f"{encoded_header}.{encoded_body}".encode()
        expected_sig = hmac.new(settings.JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
        
        # Add padding back if necessary
        pad = len(encoded_sig) % 4
        padded_sig = encoded_sig + ("=" * (4 - pad) if pad else "")
        if not hmac.compare_digest(base64.urlsafe_b64decode(padded_sig), expected_sig):
            return None
            
        pad_body = len(encoded_body) % 4
        padded_body = encoded_body + ("=" * (4 - pad_body) if pad_body else "")
        payload = json.loads(base64.urlsafe_b64decode(padded_body).decode())
        
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?;", (email.strip().lower(),))
        row = cursor.fetchone()
        if not row:
            return None
        user_dict = dict(row)
        if verify_password(user_dict["password_hash"], password):
            user_dict.pop("password_hash", None)
            return user_dict
        return None
    finally:
        conn.close()

def validate_password(password: str) -> Optional[str]:
    """Returns a human-readable reason when the password is too weak, else None."""
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    if not re.search(r"[A-Za-z]", password):
        return "Password must include at least one letter"
    if not re.search(r"\d", password):
        return "Password must include at least one number"
    return None

def register_user(
    name: str,
    email: str,
    password: str,
    role: str = "student",
    language: str = "en",
    exam: str = "CBSE 12th",
    subjects: str = "Physics,Chemistry,Mathematics",
    level: str = "intermediate"
) -> Dict[str, Any]:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        email_clean = email.strip().lower()

        cursor.execute("SELECT id FROM users WHERE email = ?;", (email_clean,))
        if cursor.fetchone():
            raise ValueError("email_exists")

        pwd_error = validate_password(password)
        if pwd_error:
            raise ValueError(f"weak_password:{pwd_error}")

        user_id = f"usr_{uuid.uuid4().hex[:10]}"
        pwd_hash = hash_password(password)
        cursor.execute("""
            INSERT INTO users (id, name, email, password_hash, role, language, level, exam, subjects, onboarding_completed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
        """, (
            user_id, name.strip(), email_clean, pwd_hash,
            role, language, level, exam, subjects
        ))
        conn.commit()
        return {
            "id": user_id,
            "name": name,
            "email": email_clean,
            "role": role,
            "language": language,
            "level": level,
            "exam": exam,
            "subjects": subjects,
            "onboarding_completed": 0
        }
    finally:
        conn.close()

def update_onboarding(
    user_id: str,
    language: str,
    exam: str,
    subjects: str,
    level: str
) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users
            SET language = ?, exam = ?, subjects = ?, level = ?, onboarding_completed = 1
            WHERE id = ?;
        """, (language, exam, subjects, level, user_id))
        conn.commit()
        
        cursor.execute("SELECT * FROM users WHERE id = ?;", (user_id,))
        row = cursor.fetchone()
        if row:
            user_dict = dict(row)
            user_dict.pop("password_hash", None)
            return user_dict
        return None
    finally:
        conn.close()
