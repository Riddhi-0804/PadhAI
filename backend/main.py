"""
PadhAI FastAPI Application Entrypoint
Foundation + Step 2: Auth, roles, database, seed data.
"""
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import settings
from backend.ai.client import ai_client
from backend.db.migrations import run_migrations
from backend.routers.auth import (
    authenticate_user,
    register_user,
    update_onboarding,
    create_jwt_token,
    decode_jwt_token
)
from backend.routers.notes import router as notes_router
from backend.routers.doubts import router as doubts_router
from backend.routers.lectures import router as lectures_router
from backend.routers.practice import router as practice_router
from backend.routers.flashcards import router as flashcards_router
from backend.routers.planner import router as planner_router
from backend.db.seed_lecture import seed_sample_lecture

app = FastAPI(
    title=settings.APP_NAME,
    description="Vernacular-first AI exam coach backend for Indian students.",
    version="1.5.0"
)

# Mount Routers
app.include_router(notes_router)
app.include_router(doubts_router)
app.include_router(lectures_router)
app.include_router(practice_router)
app.include_router(flashcards_router)
app.include_router(planner_router)

# Run database migrations & lecture seed on startup
@app.on_event("startup")
def on_startup():
    run_migrations()
    seed_sample_lecture()

# Enable CORS for local dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas for auth
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    language: str = "en"
    exam: str = "CBSE 12th"
    subjects: str = "Physics,Chemistry,Mathematics"
    level: str = "intermediate"

class OnboardingRequest(BaseModel):
    language: str
    exam: str
    subjects: str
    level: str

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ")[1]
    payload = decode_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

@app.get("/api/health")
async def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "ai_gateway": ai_client.get_status(),
        "database": "sqlite3_active"
    }

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_jwt_token({
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    })
    return {"token": token, "user": user}

@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    try:
        user = register_user(
            name=req.name,
            email=req.email,
            password=req.password,
            role=req.role,
            language=req.language,
            exam=req.exam,
            subjects=req.subjects,
            level=req.level
        )
        token = create_jwt_token({
            "sub": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        })
        return {"token": token, "user": user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

@app.get("/api/auth/me")
async def get_me(user_payload: dict = Depends(get_current_user)):
    from backend.db.database import get_connection
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?;", (user_payload["sub"],))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        user_dict = dict(row)
        user_dict.pop("password_hash", None)
        return {"user": user_dict}
    finally:
        conn.close()

@app.post("/api/auth/onboarding")
async def onboarding(req: OnboardingRequest, user_payload: dict = Depends(get_current_user)):
    user = update_onboarding(
        user_id=user_payload["sub"],
        language=req.language,
        exam=req.exam,
        subjects=req.subjects,
        level=req.level
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user, "message": "Onboarding completed successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
