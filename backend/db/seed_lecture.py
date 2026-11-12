"""
Seed Lecture Script for PadhAI
------------------------------
Seeds a 7-minute (420 seconds) Physics Class 12 lecture:
"Refraction at Spherical Surfaces and the Lens Maker's Formula"
Taught by: Dr. Rameshwar Sharma

Structure:
- 00:00 - 01:15 (0 - 75s): Introduction to curved glass interfaces & Snell's ratio.
- 01:15 - 02:30 (75 - 150s): Refraction at a single spherical surface formula: n2/v - n1/u = (n2 - n1)/R.
  Mentions that two surfaces will be combined later for the Lens Maker's formula.
- 02:30 - 04:00 (150 - 240s): Sign conventions and paraxial assumptions.
- 04:00 - 05:45 (240 - 345s): Full derivation of Lens Maker's Formula: 1/f = (n21 - 1)(1/R1 - 1/R2).
  Detailed step-wise derivation shown at 04:45.
- 05:45 - 07:00 (345 - 420s): Equiconvex lens special case and water immersion behavior.
"""
import uuid
from backend.db.database import get_connection
from backend.ai.client import ai_client

SAMPLE_VIDEO_ID = "vid_physics_rayoptics_01"

SAMPLE_CHUNKS = [
    {
        "id": "chk_tr_01",
        "start_time": 0.0,
        "end_time": 75.0,
        "section_title": "Introduction to Curved Optical Interfaces",
        "text": (
            "Namaste students. In today's session of Ray Optics, we move beyond flat plane mirrors "
            "and examine what happens when light enters curved glass boundaries. Remember Snell's law: "
            "sin i divided by sin r equals the refractive index ratio n2 by n1. Keep this ratio in your mind."
        )
    },
    {
        "id": "chk_tr_02",
        "start_time": 75.0,
        "end_time": 150.0,
        "section_title": "Single Spherical Surface Refraction",
        "text": (
            "Now look at the blackboard. For a single spherical surface separating medium 1 and medium 2, "
            "the fundamental relation connecting object distance u, image distance v, and radius R is: "
            "n2 by v minus n1 by u equals n2 minus n1 whole divided by R. Notice the right hand side: "
            "the numerator is the difference in optical densities (n2 - n1). Later in this lecture, at around "
            "the 5-minute mark, we will combine two such surfaces back-to-back to establish the famous Lens Maker's Formula. "
            "Do not jump ahead yet; first master this single surface equation."
        )
    },
    {
        "id": "chk_tr_03",
        "start_time": 150.0,
        "end_time": 240.0,
        "section_title": "Sign Conventions and Paraxial Assumptions",
        "text": (
            "Let us strictly write down the three CBSE board assumptions for this equation: "
            "First, the aperture of the curved surface is extremely small. Second, the object is treated as a point object "
            "placed directly on the principal axis. Third, all rays are paraxial, meaning angles with the normal are small enough "
            "that tan theta approximately equals sin theta which equals theta in radians. Always measure distances from the pole."
        )
    },
    {
        "id": "chk_tr_04",
        "start_time": 240.0,
        "end_time": 345.0,
        "section_title": "Derivation of the Lens Maker's Formula",
        "text": (
            "Now comes the heart of this lecture at 4 minutes 45 seconds: combining two spherical surfaces to make a thin lens! "
            "For the first surface, the image forms at v1. This intermediate image v1 acts as a virtual object for the second surface. "
            "Adding the two boundary equations: n2 by v1 cancels out on both sides! We arrive at the master equation: "
            "1 by f equals n21 minus 1 multiplied by bracket 1 by R1 minus 1 by R2 bracket closed. "
            "This is the Lens Maker's Formula. Note that n21 is n2 divided by n1, the relative refractive index of the lens w.r.t the surround."
        )
    },
    {
        "id": "chk_tr_05",
        "start_time": 345.0,
        "end_time": 420.0,
        "section_title": "Equiconvex Lens Case and Immersion Pitfalls",
        "text": (
            "Finally, examine the equiconvex lens where R1 is plus R and R2 is minus R. "
            "Substituting gives 1 by f equals 2 times (n21 - 1) divided by R, so focal length f equals R divided by 2(n21 - 1). "
            "A frequent board exam question: what happens if this glass lens is dipped in water? "
            "Since the refractive index difference drops, the focal length increases roughly four times."
        )
    }
]

def seed_sample_lecture():
    conn = get_connection()
    try:
        cursor = conn.cursor()

        # Insert Video
        cursor.execute("""
            INSERT INTO videos (id, title, subject, chapter, video_url, duration_seconds, teacher_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                duration_seconds=excluded.duration_seconds;
        """, (
            SAMPLE_VIDEO_ID,
            "Refraction at Spherical Surfaces & Lens Maker's Formula",
            "Physics",
            "Ch 09 Ray Optics",
            "https://www.youtube.com/watch?v=sample_rayoptics_01",
            420,
            "Dr. Rameshwar Sharma"
        ))

        # Insert Transcript Chunks
        for chk in SAMPLE_CHUNKS:
            cursor.execute("""
                INSERT INTO transcript_chunks (id, video_id, start_time, end_time, text, section_title)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    start_time=excluded.start_time,
                    end_time=excluded.end_time,
                    text=excluded.text,
                    section_title=excluded.section_title;
            """, (
                chk["id"],
                SAMPLE_VIDEO_ID,
                chk["start_time"],
                chk["end_time"],
                chk["text"],
                chk["section_title"]
            ))

        conn.commit()
        print(f"[PadhAI Lecture Seed] Successfully seeded lecture '{SAMPLE_VIDEO_ID}' with {len(SAMPLE_CHUNKS)} timestamped chunks.")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_sample_lecture()
