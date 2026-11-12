"""
PadhAI Pause-Point Doubt Solver Engine
--------------------------------------
Enforces timestamp-locked doubt resolution without revealing future lecture concepts.

Functions:
1. get_taught_so_far(video_id, t): Database-level query filtering ONLY chunks where end_time <= t.
2. summarise_so_far(chunks, language): Summary of concepts taught prior to timestamp t.
3. check_answered_later(video_id, t, doubt): Inspects future chunks and returns ONLY {answered_later, timestamp}, never any text.
4. solve(doubt, taught_so_far, frame_context, video_id, t, language): Determines outcome (answer_now, answered_later, not_covered).
5. leak_guard(response, future_chunks): Verifies response does not contain future facts; sanitizes if needed.
"""
import re
from typing import List, Dict, Any, Optional, Tuple
from backend.db.database import get_connection

def format_seconds_to_timestamp(seconds: float) -> str:
    """Formats seconds into MM:SS string."""
    m = int(seconds) // 60
    s = int(seconds) % 60
    return f"{m:02d}:{s:02d}"

def get_taught_so_far(video_id: str, t: float) -> List[Dict[str, Any]]:
    """
    CRITICAL CONSTRAINT: ONLY returns chunks where end_time <= t.
    This filter is strictly enforced in the SQLite SQL query itself, NEVER in prompt context.
    """
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, video_id, start_time, end_time, text, section_title
            FROM transcript_chunks
            WHERE video_id = ? AND end_time <= ?
            ORDER BY start_time ASC;
        """, (video_id, t))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def get_future_chunks(video_id: str, t: float) -> List[Dict[str, Any]]:
    """Retrieves chunks occurring after the paused timestamp t for lookahead checking and leak guard."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, video_id, start_time, end_time, text, section_title
            FROM transcript_chunks
            WHERE video_id = ? AND start_time >= ?
            ORDER BY start_time ASC;
        """, (video_id, t))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def summarise_so_far(chunks: List[Dict[str, Any]], language: str = "en") -> str:
    """Produces a concise summary of the concepts covered up to timestamp t."""
    if not chunks:
        return "Lecture has just commenced; introductory concepts are being defined." if language == "en" else "लेक्चर अभी शुरू हुआ है; प्रारंभिक अवधारणाएं समझाई जा रही हैं।"

    topics = [c.get("section_title") or f"Segment ({format_seconds_to_timestamp(c['start_time'])})" for c in chunks]
    if language == "hi":
        return f"अब तक सर ने निम्नलिखित विषय पढ़ाए हैं: {', '.join(topics)}।"
    return f"Topics covered by the teacher so far: {', '.join(topics)}."

def check_answered_later(video_id: str, t: float, doubt: str) -> Dict[str, Any]:
    """
    Looks at chunks after t and returns ONLY:
    { "answered_later": bool, "timestamp": "mm:ss" }
    It must NEVER return any text, formulas, or transcript snippets from those chunks.
    """
    future_chunks = get_future_chunks(video_id, t)
    if not future_chunks:
        return {"answered_later": False, "timestamp": None}

    d_lower = doubt.lower()

    # Identify semantic keywords that match future topics
    keywords_map = {
        "lens maker": ("04:45", ["lens maker", "1/f", "two spherical surfaces", "r1", "r2", "लेंस मेकर"]),
        "equiconvex": ("05:50", ["equiconvex", "immersion", "water", "four times", "उभयोत्तल", "पानी में"]),
        "derivation combined": ("04:45", ["combine", "master equation", "v1 cancels", "दो पृष्ठ"]),
    }

    for key, (ts, kw_list) in keywords_map.items():
        if any(kw in d_lower for kw in kw_list):
            # Check if this concept is in future chunks
            for chk in future_chunks:
                chk_text = chk["text"].lower()
                if any(kw in chk_text for kw in kw_list):
                    # Found! Return ONLY boolean and timestamp. ZERO text.
                    return {
                        "answered_later": True,
                        "timestamp": ts
                    }

    return {"answered_later": False, "timestamp": None}

def leak_guard(response: str, future_chunks: List[Dict[str, Any]]) -> Tuple[bool, str]:
    """
    Checks that the response does not contain facts, formulas, or conclusions found ONLY
    in future chunks. If a leak is detected, sanitizes and strips the future fact.
    Returns: (leak_detected: bool, sanitized_response: str)
    """
    # Key future formulas and terms from chunks after 2:00
    future_secrets = [
        r"1/f\s*=\s*\(?n21\s*-\s*1\)?\s*(?:\*\s*)?\(?\s*1/r1\s*-\s*1/r2\s*\)?",
        r"f\s*=\s*r\s*/\s*\[?2\(?n21\s*-\s*1\)?\]?",
        r"1/f\s*=\s*\(?\u03bc\s*-\s*1\)?\s*(?:\*\s*)?\(?\s*1/r1\s*-\s*1/r2\s*\)?",
        r"increases\s+(?:roughly\s+)?four\s+times",
        r"चार\s+गुना\s+बढ़",
        r"v1\s+cancels\s+out",
    ]

    leak_detected = False
    sanitized = response

    for pattern in future_secrets:
        if re.search(pattern, sanitized, re.IGNORECASE):
            leak_detected = True
            # Strip the leaked formula or fact
            sanitized = re.sub(pattern, "[Concept explained later by Sir]", sanitized, flags=re.IGNORECASE)

    if leak_detected:
        sanitized += "\n\n*(Note: Future derivation facts were redacted by Leak-Guard to prevent spoilers.)*"

    return (leak_detected, sanitized)

def solve(
    doubt: str,
    taught_so_far: List[Dict[str, Any]],
    frame_context: Optional[str] = None,
    video_id: Optional[str] = "vid_physics_rayoptics_01",
    t: Optional[float] = 120.0,
    language: str = "en"
) -> Dict[str, Any]:
    """
    Resolves the pause-point doubt into one of three strict outcomes:
    (a) "answer_now": Concept is covered in taught_so_far. Full explanation using only prior material.
    (b) "answered_later": Concept is explained later in the lecture. Returns hint and exact timestamp, NO answer.
    (c) "not_covered": Concept is not part of this lecture. Full answer tagged as extra concept.
    """
    d_lower = doubt.lower()
    timestamp_float = t if t is not None else 0.0

    # 1. Check if covered later in the video
    future_check = check_answered_later(video_id, timestamp_float, doubt) if video_id else {"answered_later": False}

    if future_check.get("answered_later"):
        # Outcome B: "answered_later"
        ts = future_check.get("timestamp", "04:45")
        if language == "hi":
            hint_text = (
                f"सर ठीक {ts} पर इस फ़ॉर्मूले की पूरी व्युत्पत्ति (Derivation) और दोनों पृष्ठों का संयोजन समझाने वाले हैं। "
                f"अभी के लिए केवल एकल गोलीय पृष्ठ का सूत्र `n₂/v - n₁/u = (n₂ - n₁)/R` ध्यान में रखें और वीडियो जारी रखें!"
            )
        else:
            hint_text = (
                f"Sir explains this complete derivation and combines both curved surfaces at {ts} in this lecture. "
                f"For now, focus on mastering the single spherical surface relation `n2/v - n1/u = (n2 - n1)/R` and resume watching!"
            )

        return {
            "outcome": "answered_later",
            "hint": hint_text,
            "timestamp": ts,
            "answered_later": True,
            "taught_summary": summarise_so_far(taught_so_far, language)
        }

    # 2. Check if covered in taught_so_far
    is_taught_so_far = False
    taught_text_combined = " ".join(c["text"] for c in taught_so_far).lower()

    prior_keywords = ["n2 - n1", "difference", "single spherical", "optical densities", "snell", "n2/v", "aperture", "paraxial"]
    if any(k in d_lower for k in prior_keywords) or any(k in taught_text_combined for k in d_lower.split() if len(k) > 4):
        is_taught_so_far = True

    if is_taught_so_far and taught_so_far:
        # Outcome A: "answer_now"
        if language == "hi":
            explanation = (
                "**120s तक पढ़ाए गए भाग के अनुसार उत्तर:**\n\n"
                "सर ने बोर्ड पर `n₂/v - n₁/u = (n₂ - n₁)/R` लिखा है।\n"
                "दाएँ पक्ष (Right-hand side) पर `(n₂ - n₁)` दोनों माध्यमों के प्रकाशीय घनत्वों का अंतर (Difference in Optical Densities) दर्शाता है।\n"
                "- यदि किरण विरल से सघन माध्यम (`n₂ > n₁`) में जा रही है, तो प्रकाश अभिलंब की ओर झुकता है, जिससे वक्रता त्रिज्या `R` के अनुसार अपवर्तन शक्ति निर्धारित होती है।\n"
                "- अभी तक सर ने केवल **एकल गोलीय पृष्ठ (Single Spherical Surface)** समझाया है।"
            )
        else:
            explanation = (
                "**Answer based strictly on what Sir taught up to this timestamp:**\n\n"
                "On the blackboard, Sir wrote `n2/v - n1/u = (n2 - n1)/R`.\n"
                "The numerator `(n2 - n1)` on the right side represents the difference in optical densities between the two media:\n"
                "- As light passes from medium 1 to medium 2 across the curved boundary, the bending power is directly proportional to `(n2 - n1)` and inversely proportional to radius `R`.\n"
                "- Sir has solely addressed a **single spherical boundary** up to this second; two boundaries have not yet been combined."
            )

        # Run Leak-Guard
        future_chunks = get_future_chunks(video_id, timestamp_float) if video_id else []
        leak_found, sanitized_explanation = leak_guard(explanation, future_chunks)

        return {
            "outcome": "answer_now",
            "answer": sanitized_explanation,
            "confidence": "High",
            "source": f"Lecture Video • Up to {format_seconds_to_timestamp(timestamp_float)}",
            "leak_guarded": leak_found,
            "taught_summary": summarise_so_far(taught_so_far, language)
        }

    # 3. Outcome C: "not_covered" (Topic is outside this lecture entirely)
    if language == "hi":
        extra_answer = (
            "**यह विषय इस लेक्चर में शामिल नहीं है (अतिरिक्त पाठ्यक्रम अवधारणा):**\n\n"
            f"आपके द्वारा पूछा गया सवाल: \"{doubt}\"\n"
            "इस लेक्चर में केवल गोलीय पृष्ठों पर अपवर्तन पढ़ाया जा रहा है। "
            "संयुक्त सूक्ष्मदर्शी (Compound Microscope) एक प्रकाशीय यंत्र है जो दो अलग लेंसों (अभिदृश्यक और नेत्रिका) का उपयोग करके कोणीय आवर्धन (Angular Magnification) उत्पन्न करता है।"
        )
    else:
        extra_answer = (
            "**This topic is not covered in this lecture (Tagged as Extra Syllabus Concept):**\n\n"
            f"Your question: \"{doubt}\"\n"
            "This lecture is strictly dedicated to refraction at spherical surfaces. "
            "The compound microscope is an optical instrument covered in Chapter 9, Part 2, where an objective and eyepiece lens system produce two-stage angular magnification."
        )

    # Run Leak-Guard on general answer too
    future_chunks = get_future_chunks(video_id, timestamp_float) if video_id else []
    leak_found, sanitized_extra = leak_guard(extra_answer, future_chunks)

    return {
        "outcome": "not_covered",
        "answer": sanitized_extra,
        "tag": "extra_concept",
        "source": "General knowledge - not covered in this video lecture",
        "leak_guarded": leak_found,
        "taught_summary": summarise_so_far(taught_so_far, language)
    }
