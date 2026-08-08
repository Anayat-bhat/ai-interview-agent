import asyncio
import unittest
import json
from main import app


class TestInterviewEndpoint(unittest.TestCase):
    def _call_interview_endpoint(self, payload):
        async def run_test():
            scope = {
                'type': 'http',
                'asgi': {'version': '3.0'},
                'http_version': '1.1',
                'method': 'POST',
                'path': '/api/interview',
                'raw_path': b'/api/interview',
                'query_string': b'',
                'headers': [(b'content-type', b'application/json')],
            }
            body_bytes = json.dumps(payload).encode('utf-8')

            async def receive():
                return {'type': 'http.request', 'body': body_bytes, 'more_body': False}

            response_chunks = []

            async def send(message):
                if message['type'] == 'http.response.body':
                    response_chunks.append(message['body'])

            await app(scope, receive, send)
            return json.loads(b''.join(response_chunks).decode('utf-8'))

        return asyncio.run(run_test())

    def test_start_interview_flow(self):
        res = self._call_interview_endpoint({
            "sessionId": "test-session-001",
            "candidate": {
                "name": "Sarah Johnson",
                "jobRole": "Senior Data Engineer"
            }
        })
        self.assertIn("reply", res)
        self.assertFalse(res.get("done"))
        self.assertIn("Sarah Johnson", res.get("reply", ""))

    def test_conversation_turn_flow(self):
        # First start session
        self._call_interview_endpoint({
            "sessionId": "test-session-002",
            "candidate": {"name": "Alex Turner", "jobRole": "AI Engineer"}
        })
        # Next turn message
        res = self._call_interview_endpoint({
            "sessionId": "test-session-002",
            "message": "Vector embeddings are dense vector representations of high-dimensional concepts."
        })
        self.assertIn("reply", res)
        self.assertFalse(res.get("done"))

    def test_end_interview_flow(self):
        res = self._call_interview_endpoint({
            "sessionId": "test-session-003",
            "endSession": True
        })
        self.assertIn("reply", res)
        self.assertTrue(res.get("done"))
        self.assertIn("feedback", res)
        self.assertIn("summary", res["feedback"])
        self.assertIn("strengths", res["feedback"])
        self.assertIn("gaps", res["feedback"])
        self.assertIn("next", res["feedback"])


if __name__ == "__main__":
    unittest.main()

