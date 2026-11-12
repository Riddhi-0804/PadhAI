"""
PadhAI SQLite Database Models
Defines all 11 required tables with strict relational constraints:
1. User (role, language, level, exam)
2. Note (title, subject, content)
3. NoteChunk (chunking for retrieval)
4. Video (title, subject, youtube_id/url, duration)
5. TranscriptChunk (start_time, end_time, text)
6. Doubt (user, video, timestamp, question, answer, outcome_type, answered_later, later_timestamp)
7. Question (subject, topic, question_text, marks, marking_rubric)
8. TestAttempt (user, score, total_marks, feedback)
9. Flashcard (front, back, subject, next_review)
10. TopicStat (user, topic, accuracy, attempts_count)
11. StudyPlan & Streak (daily study targets, dates, streak count)
"""

SCHEMA_SQL = """
-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'parent', 'admin')),
    language TEXT NOT NULL DEFAULT 'en' CHECK(language IN ('en', 'hi')),
    level TEXT NOT NULL DEFAULT 'intermediate' CHECK(level IN ('beginner', 'intermediate', 'advanced')),
    exam TEXT NOT NULL DEFAULT 'CBSE 12th',
    subjects TEXT NOT NULL DEFAULT 'Physics,Chemistry,Mathematics',
    onboarding_completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Notes table
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    chapter_num INTEGER,
    content TEXT NOT NULL,
    page_count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Note Chunks table
CREATE TABLE IF NOT EXISTS note_chunks (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    page_number INTEGER DEFAULT 1,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    heading TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- 4. Videos table
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    teacher_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Transcript Chunks table
CREATE TABLE IF NOT EXISTS transcript_chunks (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL,
    start_time REAL NOT NULL,
    end_time REAL NOT NULL,
    text TEXT NOT NULL,
    section_title TEXT,
    FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- 6. Doubts table (timestamp-locked lookahead tracking)
CREATE TABLE IF NOT EXISTS doubts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    video_id TEXT,
    timestamp_seconds REAL,
    question TEXT NOT NULL,
    answer TEXT,
    source_citation TEXT,
    confidence_score REAL DEFAULT 0.95,
    outcome_type TEXT DEFAULT 'explained_at_pause',
    answered_later INTEGER DEFAULT 0,
    later_timestamp REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE SET NULL
);

-- 7. Questions table
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    marks INTEGER NOT NULL DEFAULT 3,
    marking_rubric TEXT,
    ideal_answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Test Attempts table
CREATE TABLE IF NOT EXISTS test_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    score REAL NOT NULL,
    total_marks REAL NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Flashcards table (spaced repetition)
CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    next_review TIMESTAMP NOT NULL,
    interval_days INTEGER DEFAULT 1,
    repetition_count INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Topic Stats table (mastery tracking)
CREATE TABLE IF NOT EXISTS topic_stats (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    accuracy REAL NOT NULL DEFAULT 0.0,
    attempts_count INTEGER NOT NULL DEFAULT 0,
    last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Study Plans & Streaks
CREATE TABLE IF NOT EXISTS study_plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_exam TEXT NOT NULL,
    exam_date TEXT NOT NULL,
    daily_goal_minutes INTEGER DEFAULT 90,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS streaks (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 1,
    longest_streak INTEGER NOT NULL DEFAULT 1,
    last_active_date TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Schema version tracker
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""
