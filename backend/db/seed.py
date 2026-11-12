"""
PadhAI Seed Script
Creates:
- 1 Teacher (Dr. Rameshwar Sharma)
- 1 Parent (Sunita Sharma)
- 3 Students (Arjun Sharma, Priya Iyer, Kabir Mehta)
- 1 System Admin (Vikramaditya Roy)
- Realistic sample notes text and topic statistics
All passwords hashed using PBKDF2-HMAC-SHA256.
"""
import hashlib
import os
import sqlite3
from datetime import datetime, timedelta
from backend.db.database import get_connection
from backend.db.migrations import run_migrations

def hash_password(password: str, salt: str = "padhai_salt_2025") -> str:
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"

def verify_password(stored_hash: str, password: str) -> bool:
    try:
        salt, _ = stored_hash.split('$', 1)
        return hash_password(password, salt) == stored_hash
    except Exception:
        return False

SEED_USERS = [
    {
        "id": "usr_teacher_01",
        "name": "Dr. Rameshwar Sharma",
        "email": "rameshwar.sharma@padhai.edu",
        "password": "Password@123",
        "role": "teacher",
        "language": "hi",
        "level": "advanced",
        "exam": "CBSE 12th & JEE Physics",
        "subjects": "Physics,Applied Mechanics",
        "onboarding_completed": 1
    },
    {
        "id": "usr_parent_01",
        "name": "Sunita Sharma",
        "email": "sunita.sharma@gmail.com",
        "password": "Password@123",
        "role": "parent",
        "language": "hi",
        "level": "intermediate",
        "exam": "CBSE 12th",
        "subjects": "Physics,Chemistry,Mathematics",
        "onboarding_completed": 1
    },
    {
        "id": "usr_student_01",
        "name": "Arjun Sharma",
        "email": "arjun.sharma@student.padhai.in",
        "password": "Password@123",
        "role": "student",
        "language": "hi",
        "level": "intermediate",
        "exam": "CBSE 12th Science",
        "subjects": "Physics,Chemistry,Mathematics",
        "onboarding_completed": 1
    },
    {
        "id": "usr_student_02",
        "name": "Priya Iyer",
        "email": "priya.iyer@student.padhai.in",
        "password": "Password@123",
        "role": "student",
        "language": "en",
        "level": "advanced",
        "exam": "NEET 2025",
        "subjects": "Physics,Chemistry,Biology",
        "onboarding_completed": 1
    },
    {
        "id": "usr_student_03",
        "name": "Kabir Mehta",
        "email": "kabir.mehta@student.padhai.in",
        "password": "Password@123",
        "role": "student",
        "language": "en",
        "level": "beginner",
        "exam": "CBSE 12th Commerce",
        "subjects": "Accountancy,Economics,Business Studies",
        "onboarding_completed": 1
    },
    {
        "id": "usr_admin_01",
        "name": "Admin Vikramaditya",
        "email": "admin@padhai.in",
        "password": "AdminPassword@123",
        "role": "admin",
        "language": "en",
        "level": "advanced",
        "exam": "All Indian Exams",
        "subjects": "System Administration",
        "onboarding_completed": 1
    }
]

SAMPLE_NOTES = [
    {
        "id": "note_phy_01",
        "user_id": "usr_student_01",
        "title": "Ch 09 Ray Optics - Spherical Refraction & Lens Maker's Formula",
        "subject": "Physics",
        "chapter_num": 9,
        "content": (
            "1. Refraction at a single spherical surface: n2/v - n1/u = (n2 - n1)/R.\n"
            "Assumptions: Small aperture, paraxial rays, point object on principal axis.\n"
            "2. Lens Maker's Formula: 1/f = (n21 - 1) * [1/R1 - 1/R2].\n"
            "Sign convention: Light travels left-to-right. Distances measured from optical center.\n"
            "3. Total Internal Reflection: Critical angle sin(ic) = 1/n. Condition: Light travels from denser to rarer medium."
        ),
        "page_count": 3
    },
    {
        "id": "note_acc_01",
        "user_id": "usr_student_03",
        "title": "Ch 03 Partnership - Admission of a Partner & Revaluation Account",
        "subject": "Accountancy",
        "chapter_num": 3,
        "content": (
            "1. New Profit Sharing Ratio: Calculated after deducting incoming partner's share from total firm share (1 - share).\n"
            "2. Sacrificing Ratio = Old Ratio - New Ratio. Sacrificing ratio is used to share Goodwill brought in cash (Premium for Goodwill).\n"
            "3. Revaluation Account is nominal in nature: Debit decrease in assets and increase in liabilities; Credit increase in assets and decrease in liabilities.\n"
            "Balance transferred to Old Partners' Capital Accounts in Old Ratio."
        ),
        "page_count": 4
    },
    {
        "id": "note_eco_01",
        "user_id": "usr_student_03",
        "title": "Ch 04 Macroeconomics - Aggregate Demand & Investment Multiplier",
        "subject": "Economics",
        "chapter_num": 4,
        "content": (
            "1. AD components in a 2-sector model: AD = C + I.\n"
            "Consumption function: C = c_bar + bY, where b = Marginal Propensity to Consume (MPC).\n"
            "2. Investment Multiplier (k): Ratio of change in national income to initial change in investment: k = ΔY / ΔI = 1 / (1 - MPC) = 1 / MPS.\n"
            "3. Multiplier Mechanism: Working of continuous rounds of expenditure until leakage into savings equals fresh injection."
        ),
        "page_count": 2
    }
]

def seed_database():
    run_migrations()
    conn = get_connection()
    try:
        cursor = conn.cursor()

        # Seed Users
        for u in SEED_USERS:
            pwd_hash = hash_password(u["password"])
            cursor.execute("""
                INSERT INTO users (id, name, email, password_hash, role, language, level, exam, subjects, onboarding_completed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    name=excluded.name,
                    password_hash=excluded.password_hash,
                    role=excluded.role,
                    language=excluded.language,
                    level=excluded.level,
                    exam=excluded.exam,
                    subjects=excluded.subjects,
                    onboarding_completed=excluded.onboarding_completed;
            """, (
                u["id"], u["name"], u["email"], pwd_hash, u["role"],
                u["language"], u["level"], u["exam"], u["subjects"], u["onboarding_completed"]
            ))

        # Seed Notes
        for n in SAMPLE_NOTES:
            cursor.execute("""
                INSERT INTO notes (id, user_id, title, subject, chapter_num, content, page_count)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    title=excluded.title,
                    content=excluded.content;
            """, (
                n["id"], n["user_id"], n["title"], n["subject"], n["chapter_num"], n["content"], n["page_count"]
            ))

        # Seed Streaks for students
        for sid in ["usr_student_01", "usr_student_02", "usr_student_03"]:
            cursor.execute("""
                INSERT INTO streaks (id, user_id, current_streak, longest_streak, last_active_date)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    current_streak=excluded.current_streak;
            """, (f"strk_{sid}", sid, 4, 12, datetime.now().strftime("%Y-%m-%d")))

        # Seed Topic stats for Arjun Sharma
        cursor.execute("""
            INSERT INTO topic_stats (id, user_id, subject, topic, accuracy, attempts_count)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING;
        """, ("stat_01", "usr_student_01", "Physics", "Ray Optics", 0.88, 25))

        cursor.execute("""
            INSERT INTO topic_stats (id, user_id, subject, topic, accuracy, attempts_count)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING;
        """, ("stat_02", "usr_student_01", "Physics", "Wave Optics", 0.65, 14))

        conn.commit()
        print("[PadhAI Seed] Database successfully seeded with 1 Teacher, 1 Parent, 3 Students, 1 Admin, and notes.")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_database()
