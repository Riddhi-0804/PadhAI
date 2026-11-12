"""
PadhAI Unified AI Gateway
-------------------------
All AI operations (embeddings, OCR, understand-first doubts pipeline, practice generation)
route through this single module. Supports MOCK_AI mode when no API key is provided.
"""
import hashlib
import json
import math
from typing import Dict, Any, List, Optional
from backend.config import settings
from backend.ai.understand import detect, gather_context, needs_clarification, answer

class PadhAIGateway:
    def __init__(self, mock_mode: Optional[bool] = None):
        self.mock_mode = mock_mode if mock_mode is not None else settings.MOCK_AI
        self.api_key = settings.GEMINI_API_KEY

    def is_mock_enabled(self) -> bool:
        return self.mock_mode or not bool(self.api_key)

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate normalized 384-dimensional vectors."""
        if self.is_mock_enabled():
            vectors = []
            for text in texts:
                vec = []
                hash_base = hashlib.sha256(text.encode('utf-8')).hexdigest()
                for i in range(48):
                    sub_hash = hashlib.sha256(f"{hash_base}_{i}".encode('utf-8')).digest()
                    for byte in sub_hash[:8]:
                        val = (byte / 127.5) - 1.0
                        vec.append(val)
                norm = math.sqrt(sum(x * x for x in vec)) or 1.0
                vectors.append([round(x / norm, 5) for x in vec])
            return vectors

        try:
            from google import genai
            client = genai.Client(api_key=self.api_key)
            result = client.models.embed_content(
                model="text-embedding-004",
                contents=texts,
            )
            return [e.values for e in result.embeddings]
        except Exception as e:
            print(f"[PadhAIGateway] Gemini Embedding fallback to mock ({e})")
            self.mock_mode = True
            return self.get_embeddings(texts)

    def extract_text_from_image(self, image_bytes: bytes, filename: str) -> str:
        """Extract text from handwritten or printed notes images via OCR."""
        if self.is_mock_enabled():
            lower_name = filename.lower()
            if "optics" in lower_name or "physics" in lower_name:
                return (
                    "### Ray Optics - Refraction at Spherical Surfaces\n"
                    "Page 1: Refraction formula derivation: n2/v - n1/u = (n2 - n1)/R.\n"
                    "Assumptions made: (i) Object is a point object on principal axis. "
                    "(ii) Incident ray and refracted ray make small angles with principal axis.\n\n"
                    "### Lens Maker's Formula\n"
                    "Page 2: 1/f = (μ - 1) * (1/R1 - 1/R2). For biconvex lens with R1 = +R, R2 = -R, 1/f = 2(μ-1)/R."
                )
            elif "account" in lower_name or "partner" in lower_name:
                return (
                    "### Admission of a Partner - Revaluation\n"
                    "Page 1: Revaluation Account format and journal entries on admission.\n"
                    "Debited for: Decrease in value of assets, Increase in liabilities, Unrecorded liabilities.\n\n"
                    "### Treatment of Goodwill (AS-26)\n"
                    "Page 2: Premium for Goodwill brought in cash is credited to Sacrificing Partners in Sacrificing Ratio."
                )
            else:
                return (
                    "### Class 12 Revision Notes\n"
                    "Page 1: Key formula definitions, diagrams, and numerical solved steps.\n"
                    "Extracted accurately from student handwritten notebook scan."
                )

        try:
            from google import genai
            client = genai.Client(api_key=self.api_key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    genai.types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    "Transcribe all handwritten and printed textbook notes from this image accurately into structured markdown."
                ]
            )
            return response.text or ""
        except Exception:
            return self.extract_text_from_image(image_bytes, filename)

    def run_understand_pipeline(
        self,
        question: str,
        user: Dict[str, Any],
        mode: str = "simple",
        detected_override: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes the 4-stage understand pipeline:
        1. detect (or use student override)
        2. gather_context (vector notes + weak topics)
        3. needs_clarification (check ambiguity)
        4. answer (grounded response with citations & confidence)
        """
        # 1. Detect
        if detected_override:
            detected_info = {
                "language": detected_override.get("language", "hi"),
                "question_type": detected_override.get("question_type", "conceptual"),
                "topic": detected_override.get("topic", "General Syllabus"),
                "level": detected_override.get("level", "intermediate")
            }
        else:
            detected_info = detect(question)

        # 2. Context
        context = gather_context(user, detected_info)

        # 3. Clarification Check
        clarification = needs_clarification(detected_info, context)

        # 4. Answer
        answer_result = answer(question, detected_info, context, mode=mode)

        return {
            "question": question,
            "detected": detected_info,
            "clarification": clarification,
            "answer": answer_result["answer"],
            "mode": mode,
            "confidence": answer_result["confidence"],
            "citations": answer_result["citations"],
            "low_confidence_warning": answer_result["low_confidence_warning"],
            "weak_topics_noted": answer_result["weak_topics_noted"]
        }

    def get_status(self) -> Dict[str, Any]:
        return {
            "gateway_ready": True,
            "mock_mode": self.is_mock_enabled(),
            "provider": "mock" if self.is_mock_enabled() else "gemini-3.8-flash",
            "active_step": "step_4_understand_first"
        }

# Global singleton client instance
ai_client = PadhAIGateway()
