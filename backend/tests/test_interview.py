"""Integration test suite for POST /api/interview endpoint contract and planner constraints.
"""

import sys
import unittest
from pathlib import Path

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestInterviewEndpoint(unittest.TestCase):
    def test_missing_session_id_returns_400(self):
        response = client.post("/api/interview", json={})
        self.assertEqual(response.status_code, 400)

    def test_start_interview_returns_welcome_and_question(self):
        payload = {
            "sessionId": "test-session-start",
            "candidate": {
                "member": {
                    "id": "CAND-001",
                    "name": "Sarah Johnson",
                    "jobRole": "Senior Data Engineer",
                }
            },
        }
        response = client.post("/api/interview", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("reply", data)
        self.assertFalse(data["done"])
        self.assertIn("Sarah Johnson", data["reply"])

    def test_full_interview_flow_enforces_8_questions_and_4_curriculum_days(self):
        session_id = "test-session-full-flow"

        # 1. Start Turn
        start_payload = {
            "sessionId": session_id,
            "candidate": {
                "name": "Alex Turner",
                "jobRole": "Backend Software Engineer",
            },
        }
        res = client.post("/api/interview", json=start_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["done"])

        # 2. Conduct Turns 1 to 7 -> must remain done=False
        for turn_idx in range(1, 8):
            turn_payload = {
                "sessionId": session_id,
                "message": f"Answer turn {turn_idx}: We use vector embeddings, event loops, trade-offs, and microservices caching.",
            }
            res = client.post("/api/interview", json=turn_payload)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            # Until turn 8 (8 questions total: 1 initial + 7 answers), interview must not complete
            if turn_idx < 7:
                self.assertFalse(
                    data["done"],
                    f"Interview completed prematurely at turn {turn_idx + 1}",
                )

        # 3. 8th Answer Turn -> Planner should now set done=True as 8 Qs and >= 4 Days are covered
        final_turn_payload = {
            "sessionId": session_id,
            "message": "Final answer: Production scale deployment uses Docker, Kubernetes, and automated monitoring.",
        }
        res = client.post("/api/interview", json=final_turn_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertTrue(data["done"], "Interview failed to complete after 8 questions and >=4 curriculum days")
        self.assertIsNotNone(data.get("feedback"))
        fb = data["feedback"]
        self.assertIn("summary", fb)
        self.assertIsInstance(fb["strengths"], list)
        self.assertIsInstance(fb["gaps"], list)
        self.assertIsInstance(fb["next"], list)


if __name__ == "__main__":
    unittest.main()

