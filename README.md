# PadhAI (पढ़AI) 📖
> Vernacular-first AI exam coach web application for Indian students (CBSE, State Boards, JEE, NEET, CUET, CA Foundation).

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER (PWA)                                 |
|                                                                                   |
|   React 19 + TypeScript + Tailwind CSS                                            |
|   "Well-kept Notebook" Design System (Cream #FAF7F0, Ink Blue #14213D, Marigold)  |
|   - Language Switcher (English / हिंदी)                                           |
|   - Low-Bandwidth 2G Mode (Text-first, deferred video streams)                   |
|   - Offline Service Worker Cache (vite-plugin-pwa)                                |
|   - Audio & Web Speech API Speech Recognition                                    |
+------------------------------------------+----------------------------------------+
                                           |
                                HTTP / JSON REST
                                           |
+------------------------------------------v----------------------------------------+
|                          APPLICATION SERVER (FASTAPI)                             |
|                                                                                   |
|   Python 3.10+ FastAPI Entrypoint (backend/main.py)                               |
|   Modular Domain Routers:                                                         |
|   ├── /api/auth       (PBKDF2/SHA-256 JWT, Roles: Student, Teacher, Parent)      |
|   ├── /api/notes      (PDF, typed text, handwritten OCR parsing, chunking)        |
|   ├── /api/doubts     (Understand-first pipeline: detect -> gather -> answer)     |
|   ├── /api/lectures   (Timestamp-locked doubt solver & leak-guard)                |
|   ├── /api/practice   (Adaptive test generation, scoring, weak-topic tracker)     |
|   ├── /api/flashcards (SuperMemo-2 spaced repetition scheduler & decks)           |
|   └── /api/planner    (Adaptive timetable, missed-day replanning, ink stamps)     |
+------------------------------------+---------------------+------------------------+
                                     |                     |
           +-------------------------+                     +------------------+
           |                                                                  |
+----------v------------------------------+       +---------------------------v-----+
|         DATABASE & VECTOR STORE         |       |        UNIFIED AI GATEWAY       |
|                                         |       |      (backend/ai/client.py)     |
|   SQLite3 Database (backend/data/)      |       |                                 |
|   - users, notes, note_chunks           |       |   MOCK_AI=true:                 |
|   - videos, transcript_chunks           |       |   - Deterministic 384d vectors  |
|   - doubts, topic_stats, streaks        |       |   - Realistic vernacular output |
|   - flashcards, study_plans             |       |                                 |
|                                         |       |   MOCK_AI=false:                |
|   Vector Retrieval (Cosine Similarity)  |       |   - Google GenAI SDK (Gemini)   |
|   - Top-k chunk matching with citations |       |   - Strict schema validation    |
+-----------------------------------------+       +---------------------------------+
```

---

## 2. Quick Setup & Run Instructions

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22)
- Python 3.10+
### https://padhai-1.ai.studio
### Frontend (Port 3000)
```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend (FastAPI on Port 8000)
```bash
# Navigate to backend
cd backend

# Create and activate virtualenv
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI with uvicorn
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend health check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Run frontend + backend together (local dev)
```bash
npm install
python3 -m pip install -r backend/requirements.txt
python3 -m backend.db.seed   # first run only: creates the demo personas
npm run dev:all   # starts FastAPI on :8000 and Vite on :3000
```
Vite proxies `/api/*` to `http://localhost:8000` (override with `BACKEND_URL`), so
login, signup and `/api/auth/me` work from [http://localhost:3000](http://localhost:3000).

---

## 3. Environment Variables (`.env`)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `MOCK_AI` | `true` | When `true`, all AI embeddings, doubts, and evaluation run via realistic deterministic offline engines. No API key needed. |
| `GEMINI_API_KEY` | *(empty)* | Google Gemini API key used when `MOCK_AI=false`. |
| `PORT` | `3000` | Frontend dev server port. |
| `BACKEND_URL` | `http://localhost:8000` | Backend API proxy address. |
| `ENVIRONMENT` | `development` | Runtime environment identifier. |

---

## 4. Seed Logins & Roles

The database is seeded with realistic Indian personas and curriculum data:

| Role | Email | Password | Persona & Subject |
| :--- | :--- | :--- | :--- |
| **Student** | `arjun.sharma@padhai.edu` | `Password@123` | Arjun Sharma (Class 12 CBSE, Physics & Maths) |
| **Student** | `priya.iyer@padhai.edu` | `Password@123` | Priya Iyer (Class 12 NEET Aspirant, Biology/Chem) |
| **Student** | `kabir.mehta@padhai.edu` | `Password@123` | Kabir Mehta (Class 12 Commerce, Accountancy) |
| **Teacher** | `rameshwar.sharma@padhai.edu` | `Password@123` | Dr. Rameshwar Sharma (HOD Physics, Ray Optics) |
| **Parent** | `sunita.sharma@padhai.edu` | `Password@123` | Sunita Sharma (Arjun's mother, weekly reports) |
| **Admin** | `admin.vikram@padhai.edu` | `AdminPassword@123` | Vikramaditya Roy (System administrator) |

---

## 5. 3-Minute Demo Script: The Three Doubt-Solver Outcomes

This demo tests the timestamp-locked doubt solver in **Class 12 Physics: Ray Optics (Lecture 1)**.

### Minute 1: Outcome (a) `answer_now` (Immediate Answer)
1. Navigate to the **Lectures** tab in the sidebar.
2. The video starts at timestamp `02:00`. Use the scrubber or click on timestamp `01:15`.
3. Click the yellow **"I have a doubt at 01:15"** button.
4. Ask: *"Why does light bend towards the normal when entering glass?"*
5. **Expected Outcome**:
   - Status badge: `Outcome (a) - Answered Now`.
   - The concept was taught between `00:00` and `01:00`.
   - PadhAI provides the full explanation immediately with Snell's law citation: `[Class 12 Physics Notes • Page 1, §1]`.

---

### Minute 2: Outcome (b) `answered_later` (Anti-Spoiler Lookahead Shield)
1. Move the video player back to timestamp `02:00`.
2. Click **"I have a doubt at 02:00"**.
3. Ask: *"What is the combined formula for a double convex lens?"*
4. **Expected Outcome**:
   - Status badge: `Outcome (b) - Answered Later in Lecture`.
   - Lookahead guard scans future chunks and detects that Dr. Rameshwar Sharma will explain this at `04:45`.
   - **Crucial Rule**: The AI **does not spoil** the formula `1/f = (n21 - 1)(1/R1 - 1/R2)`.
   - It outputs: *"Your teacher explains this at 04:45. Until then, think about: How the curvature of both surfaces contributes to bending light."*
   - Includes a **"Show me anyway"** button if the student insists on seeing the spoiler.

---

### Minute 3: Outcome (c) `not_covered` (Extra Syllabus Knowledge)
1. Scrubber remains at `02:00` (or `02:30`).
2. Click **"I have a doubt"**.
3. Ask: *"What is the numerical aperture of an oil immersion objective lens in an optical microscope?"*
4. **Expected Outcome**:
   - Status badge: `Outcome (c) - Not Covered in this Lecture`.
   - The concept is not present in Dr. Sharma's lecture transcript.
   - PadhAI answers the question accurately using general physics principles, but tags it clearly:
     `[Extra Concept - Not covered in this lecture's syllabus]`.
   - Low syllabus confidence callout advises consulting Dr. Sharma during practical hours.

---

## 6. Progressive Web App (PWA) & Low-Bandwidth Mode

- **PWA Installation**: Built with `vite-plugin-pwa`. Click the **"Install App"** button in the top navbar to install PadhAI as a standalone desktop or mobile application.
- **Offline Cache**: Note chunks, formula flashcards, and test attempts are persisted locally in `localStorage` and Service Worker precache.
- **Low-Bandwidth (2G) Mode**: Click the **"Low Data / 2G Mode"** button in the header. Heavy video streams and large assets are deferred; students receive instant text-first notes, mathematical equations, and margin notes over slow 2G/3G connections.
