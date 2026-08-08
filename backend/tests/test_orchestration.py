"""Programmatic Test Suite for Interview Orchestration & Deterministic Controller.

Verifies all 9 hard system guarantees:
1. Minimum 8 questions
2. Minimum 4 unique curriculum days
3. No duplicate questions
4. Session context preserved across turns
5. Candidate profile metadata utilized
6. Skipped topics identified and probed
7. Failed/weak answers trigger clarification probes
8. Strong answers trigger deeper follow-ups
9. Planner enforces rules deterministically without LLM override
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
from memory.session_manager import session_manager
from services.planner import PlanDecision, determine_next_turn

client = TestClient(app)


class TestInterviewOrchestration(unittest.TestCase):
    """Programmatic test cases for end-to-end interview orchestration flow."""

    def setUp(self):
        """Reset session memory before each test."""
        session_manager._sessions.clear()

    def test_complete_conversation_orchestration_guarantees(self):
        """Test a full 8+ turn interview conversation programmatically."""
        session_id = "test-orchestration-session-001"
        candidate_payload = {
            "name": "David Miller",
            "jobRole": "Senior Data Engineer",
            "yearsExperience": 8,
            "missions": [
                {"day": 1, "title": "Environment Setup", "passed": True, "attempts": 1},
                {"day": 7, "title": "Vector Embeddings", "skipped": True},
                {"day": 11, "title": "LLM Fine-Tuning", "passed": True, "attempts": 4},
            ],
        }

        # 1. Start session
        res = client.post("/api/interview", json={"sessionId": session_id, "candidate": candidate_payload})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["done"], "Session should not be done on turn 1")
        self.assertIn("David Miller", data["reply"])
        self.assertIn("Senior Data Engineer", data["reply"])

        # Track questions and responses
        asked_questions = []

        # Extract initial question from welcome reply
        state = session_manager.get_session(session_id)
        self.assertIsNotNone(state)
        self.assertEqual(state.questions_asked, 1)
        self.assertGreaterEqual(len(state.covered_days), 1)

        for turn in state.history:
            if turn["sender"] == "ai":
                asked_questions.append(turn["content"])

        # 2. Programmatically simulate turns 2 to 8 with varied answer qualities
        responses_pool = [
            "We build dense vector embeddings using transformer models, store them in vector databases like Pinecone, and optimize latency with HNSW indexing trade-offs.",
            "Short answer",  # Vague -> triggers CLARIFICATION probe
            "Regarding streaming pipelines, we manage Kafka consumer backpressure, trade-offs, and microservices caching using distributed Redis clusters.",  # Strong -> triggers FOLLOW_UP
            "We handle schema evolution with Avro and Schema Registry.",
            "For agentic AI, we implement MCP tool calls and stateful memory persistence with fallback error handling.",
            "We run parameter-efficient fine-tuning with LoRA and PEFT adapters under low memory footprint constraints.",
            "We monitor LLM application drift, toxicity, and accuracy in production using automated telemetry pipelines.",
        ]

        for idx, user_ans in enumerate(responses_pool, start=1):
            turn_res = client.post("/api/interview", json={"sessionId": session_id, "message": user_ans})
            self.assertEqual(turn_res.status_code, 200)
            data = turn_res.json()

            # Record asked question
            if not data["done"]:
                state = session_manager.get_session(session_id)
                self.assertIsNotNone(state)
                ai_turns = [t["content"] for t in state.history if t["sender"] == "ai"]
                latest_q = ai_turns[-1]
                asked_questions.append(latest_q)

            # Verification: Before 8 questions, interview MUST NOT complete
            if idx < 7:  # turns 1 + idx < 8
                self.assertFalse(
                    data["done"],
                    f"Interview completed prematurely at answer turn {idx} (Questions asked: {state.questions_asked})",
                )

        # 3. 8th Turn Response (Final Answer) -> Planner should now complete session
        final_ans = "For capstone production deployment, we configure Docker containers, Kubernetes canary rollouts, and prometheus monitoring."
        final_res = client.post("/api/interview", json={"sessionId": session_id, "message": final_ans})
        self.assertEqual(final_res.status_code, 200)
        final_data = final_res.json()

        # Check Guarantees:
        state = session_manager.get_session(session_id)
        self.assertIsNotNone(state)

        # Guarantee 1: Minimum 8 questions
        self.assertGreaterEqual(state.questions_asked, 8, "Failed Guarantee 1: Minimum 8 questions not met")

        # Guarantee 2: Minimum 4 unique curriculum days
        self.assertGreaterEqual(len(state.covered_days), 4, "Failed Guarantee 2: Minimum 4 unique curriculum days not met")

        # Guarantee 3: No duplicate questions
        unique_questions = set(q.strip().lower() for q in asked_questions)
        self.assertEqual(
            len(asked_questions),
            len(unique_questions),
            "Failed Guarantee 3: Duplicate question detected in session history",
        )

        # Guarantee 4: Session context preserved
        self.assertGreaterEqual(len(state.history), 16, "Failed Guarantee 4: Turn history incomplete")
        self.assertEqual(len(state.evaluations), 8, "Failed Guarantee 4: Evaluation log count mismatch")

        # Guarantee 5 & 6: Candidate profile & skipped topic handling
        # Verify feedback generated correctly
        self.assertTrue(final_data["done"], "Failed to complete interview after 8 questions and >=4 days")
        self.assertIsNotNone(final_data.get("feedback"))
        fb = final_data["feedback"]
        self.assertIn("summary", fb)
        self.assertIn("David Miller", fb["summary"])
        self.assertIn("Senior Data Engineer", fb["summary"])

    def test_planner_deterministic_minimums_enforcement(self):
        """Verify planner strictly blocks termination when minimums are not satisfied."""
        session_id = "test-planner-minimums"
        candidate_data = {"name": "Test Candidate", "jobRole": "Backend Software Engineer"}

        state = session_manager.get_or_create_session(session_id, candidate_data)

        # Case A: 7 questions, 4 days -> Must NOT terminate
        state.questions_asked = 7
        state.covered_days = {1, 7, 11, 16}
        decision = determine_next_turn(state)
        self.assertNotEqual(decision.action, "TERMINATE", "Planner allowed premature termination at 7 questions")

        # Case B: 8 questions, 3 days -> Must NOT terminate
        state.questions_asked = 8
        state.covered_days = {1, 7, 11}
        decision = determine_next_turn(state)
        self.assertNotEqual(decision.action, "TERMINATE", "Planner allowed premature termination at 3 covered days")

        # Case C: 8 questions, 4 days -> Must terminate
        state.questions_asked = 8
        state.covered_days = {1, 7, 11, 16}
        decision = determine_next_turn(state)
        self.assertEqual(decision.action, "TERMINATE", "Planner failed to terminate when minimums satisfied")

    def test_skipped_topic_and_high_attempt_probing(self):
        """Verify candidate skipped topics and high-attempt missions trigger probing decisions."""
        session_id = "test-skipped-probing"
        candidate_payload = {
            "name": "Maria Garcia",
            "jobRole": "AI Engineer",
            "missions": [
                {"day": 7, "title": "Vector Embeddings", "skipped": True},
                {"day": 21, "title": "Agentic AI", "passed": True, "attempts": 3},
            ],
        }

        state = session_manager.get_or_create_session(session_id, candidate_payload)
        state.questions_asked = 2
        state.covered_days = {1}

        decision = determine_next_turn(state)
        # Planner should probe high attempts or skipped topic
        self.assertIn(decision.action, ["NEW_TOPIC", "CLARIFICATION"])
        self.assertTrue(
            decision.probe_reason is not None or decision.next_day in [7, 21],
            "Planner failed to target skipped/high-attempt curriculum day",
        )

    def test_strong_answer_followup_and_weak_answer_clarification(self):
        """Verify adaptive transitions for strong vs weak candidate answers."""
        session_id = "test-answer-quality-transitions"
        candidate_data = {"name": "Alex Vance", "jobRole": "Senior Data Engineer"}
        state = session_manager.get_or_create_session(session_id, candidate_data)

        # 1. Weak/Vague answer -> CONCRETE_EXAMPLE
        decision_vague = determine_next_turn(state, last_quality="VAGUE")
        self.assertEqual(decision_vague.action, "CONCRETE_EXAMPLE")

        # 2. Excellent answer -> DEEPER_DEPTH
        decision_excellent = determine_next_turn(state, last_quality="EXCELLENT")
        self.assertEqual(decision_excellent.action, "DEEPER_DEPTH")

        # 3. Conceptually correct answer -> TRADEOFFS_SCALING
        decision_conceptual = determine_next_turn(state, last_quality="CONCEPTUAL_CORRECT")
        self.assertEqual(decision_conceptual.action, "TRADEOFFS_SCALING")

    def test_interviewer_persona_and_answer_referencing(self):
        """Verify interviewer persona references candidate's actual answer and avoids generic filler."""
        session_id = "test-persona-context"
        candidate_payload = {
            "name": "Sarah Connor",
            "jobRole": "AI Engineer",
        }

        # Start interview
        res_start = client.post("/api/interview", json={"sessionId": session_id, "candidate": candidate_payload})
        self.assertEqual(res_start.status_code, 200)

        # Submit answer mentioning specific concepts
        ans_text = "We generate dense vector embeddings using transformers, store them in Pinecone with HNSW indexing, and handle high QPS similarity retrieval."
        res_turn = client.post("/api/interview", json={"sessionId": session_id, "message": ans_text})
        self.assertEqual(res_turn.status_code, 200)
        data = res_turn.json()

        interviewer_reply = data["reply"]

        # 1. Must reference candidate's concept
        self.assertTrue(
            any(kw in interviewer_reply.lower() for kw in ["vector", "embedding", "hnsw", "pinecone", "similarity", "qps", "latency", "trade-off"]),
            f"Interviewer failed to reference candidate concepts in reply: {interviewer_reply}",
        )

        # 2. Must NOT use generic filler "Can you elaborate?"
        self.assertNotIn("can you elaborate", interviewer_reply.lower())


if __name__ == "__main__":
    unittest.main()

