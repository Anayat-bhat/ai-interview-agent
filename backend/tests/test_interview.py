import asyncio
import unittest
import json
from main import app


class TestInterviewEndpoint(unittest.TestCase):
    def test_post_interview_endpoint(self):
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
            body = []

            async def receive():
                return {'type': 'http.request', 'body': b'', 'more_body': False}

            async def send(message):
                if message['type'] == 'http.response.body':
                    body.append(message['body'])

            await app(scope, receive, send)
            return json.loads(b''.join(body).decode('utf-8'))

        response_json = asyncio.run(run_test())
        self.assertEqual(response_json, {"reply": "Hello", "done": False})


if __name__ == "__main__":
    unittest.main()
