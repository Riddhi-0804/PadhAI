"""
Automated Test Suite for Pause-Point Doubt Solver
-------------------------------------------------
Proves:
1. At t=2:00 (120s), no text or chunk after 2:00 appears in taught_so_far (database query filter).
2. Outcome A ("answer_now") is triggered by a question on material taught so far.
3. Outcome B ("answered_later") is triggered by asking about the Lens Maker's formula at t=2:00,
   returning timestamp "04:45" with ZERO answer text.
4. Outcome C ("not_covered") is triggered by an out-of-syllabus query (compound microscope), tagged as extra concept.
5. Leak-Guard properly catches and sanitizes future facts.
"""
import sys
import unittest
from backend.db.seed_lecture import seed_sample_lecture, SAMPLE_VIDEO_ID
from backend.ai.pause_doubt import (
    get_taught_so_far,
    get_future_chunks,
    check_answered_later,
    solve,
    leak_guard,
    format_seconds_to_timestamp
)

class TestPauseDoubtSolver(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Ensure database is seeded with sample lecture
        seed_sample_lecture()
        cls.video_id = SAMPLE_VIDEO_ID
        cls.t_pause = 120.0  # 2:00 minutes

    def test_01_taught_so_far_strict_database_filter(self):
        """Prove: At t=2:00 (120s), NO chunk with end_time > 120s can appear in taught_so_far."""
        chunks = get_taught_so_far(self.video_id, self.t_pause)

        # 1. All returned chunks must strictly have end_time <= 120s
        for c in chunks:
            self.assertLessEqual(
                c["end_time"],
                self.t_pause,
                f"Leak detected in SQL query: chunk {c['id']} ends at {c['end_time']} > {self.t_pause}!"
            )

        # 2. Specifically, verify future chunks (chunk 2 ends at 150s, chunk 4 ends at 345s) are NOT present
        chunk_ids = [c["id"] for c in chunks]
        self.assertNotIn("chk_tr_02", chunk_ids, "Chunk 2 (ends at 150s) must not be in taught_so_far at t=120s")
        self.assertNotIn("chk_tr_04", chunk_ids, "Chunk 4 (Lens Maker derivation) must not be in taught_so_far at t=120s")
        self.assertNotIn("chk_tr_05", chunk_ids, "Chunk 5 (Equiconvex) must not be in taught_so_far at t=120s")

        print(f"\n[PASS] Test 1: get_taught_so_far strictly returned {len(chunks)} chunk(s), all with end_time <= 120s.")

    def test_02_outcome_a_answer_now(self):
        """Prove: Question on prior content triggers 'answer_now' without future concepts."""
        doubt = "What does the difference (n2 - n1) mean in the refraction equation?"
        taught_so_far = get_taught_so_far(self.video_id, self.t_pause)

        res = solve(
            doubt=doubt,
            taught_so_far=taught_so_far,
            video_id=self.video_id,
            t=self.t_pause,
            language="en"
        )

        self.assertEqual(res["outcome"], "answer_now")
        self.assertIn("answer", res)
        self.assertEqual(res["confidence"], "High")

        # Must NOT mention future derivation details (e.g. 1/f = (n21-1)(1/R1 - 1/R2))
        self.assertNotIn("1/f", res["answer"])
        self.assertNotIn("v1 cancels out", res["answer"])
        print(f"[PASS] Test 2: Triggered Outcome A ('answer_now') for doubt on (n2 - n1) difference.")

    def test_03_outcome_b_answered_later_no_text_leak(self):
        """
        Prove: Question on concept introduced early but explained later (Lens Maker's formula at t=2:00)
        triggers 'answered_later', returns timestamp 04:45, and ZERO answer text.
        """
        doubt = "What is the final Lens Maker's formula for two surfaces combined?"
        taught_so_far = get_taught_so_far(self.video_id, self.t_pause)

        res = solve(
            doubt=doubt,
            taught_so_far=taught_so_far,
            video_id=self.video_id,
            t=self.t_pause,
            language="en"
        )

        self.assertEqual(res["outcome"], "answered_later")
        self.assertTrue(res["answered_later"])
        self.assertEqual(res["timestamp"], "04:45")
        self.assertIn("hint", res)

        # CRITICAL PROOF: Hint must NOT contain the final formula or future text
        self.assertNotIn("1/f = (n21 - 1)", res["hint"])
        self.assertNotIn("v1 cancels out", res["hint"])
        self.assertNotIn("four times", res["hint"])
        print(f"[PASS] Test 3: Triggered Outcome B ('answered_later') at {res['timestamp']} with zero spoiler text.")

    def test_04_outcome_c_not_covered_extra_concept(self):
        """Prove: Unrelated syllabus topic triggers 'not_covered' tagged as extra_concept."""
        doubt = "How does a compound microscope's eyepiece magnify the image?"
        taught_so_far = get_taught_so_far(self.video_id, self.t_pause)

        res = solve(
            doubt=doubt,
            taught_so_far=taught_so_far,
            video_id=self.video_id,
            t=self.t_pause,
            language="en"
        )

        self.assertEqual(res["outcome"], "not_covered")
        self.assertEqual(res["tag"], "extra_concept")
        self.assertIn("not covered in this video lecture", res["source"])
        print(f"[PASS] Test 4: Triggered Outcome C ('not_covered') tagged as extra_concept.")

    def test_05_leak_guard_detects_and_sanitizes(self):
        """Prove: Leak-Guard intercepts future formulas and strips them."""
        future_chunks = get_future_chunks(self.video_id, self.t_pause)
        leaked_response = "The formula is 1/f = (n21 - 1) * (1/R1 - 1/R2) and the focal length increases four times."

        leak_found, sanitized = leak_guard(leaked_response, future_chunks)
        self.assertTrue(leak_found)
        self.assertNotIn("1/f = (n21 - 1) * (1/R1 - 1/R2)", sanitized)
        self.assertIn("[Concept explained later by Sir]", sanitized)
        print(f"[PASS] Test 5: Leak-Guard intercepted future formula and sanitized response successfully.")

if __name__ == "__main__":
    unittest.main()
