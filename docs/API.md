# API Documentation

# AI Interview Agent API

**Version:** 1.0

**Base URL**

```
http://localhost:5000/api
```

---

# Table of Contents

- Authentication
- Users
- Interview
- Reports
- Error Responses
- Status Codes
- Request Flow

---

# Authentication

All protected routes require a JWT access token.

**Header**

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication APIs

## Register User

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN"
}
```

---

## Login

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "64xxxx",
    "name": "John Doe"
  }
}
```

---

## Get Profile

### Endpoint

```http
GET /auth/profile
```

### Headers

```http
Authorization: Bearer JWT_TOKEN
```

### Response

```json
{
  "id": "64xxxx",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

# Interview APIs

## Start Interview

### Endpoint

```http
POST /interview/start
```

### Request

```json
{
  "technology": "React",
  "difficulty": "Medium",
  "experience": "2 Years"
}
```

### Response

```json
{
  "interviewId": "INT001",
  "question": "Explain the Virtual DOM."
}
```

---

## Get Next Question

### Endpoint

```http
POST /interview/question
```

### Request

```json
{
  "interviewId": "INT001"
}
```

### Response

```json
{
  "questionNumber": 2,
  "question": "Explain React Hooks."
}
```

---

## Submit Answer

### Endpoint

```http
POST /interview/answer
```

### Request

```json
{
  "interviewId": "INT001",
  "questionId": "Q02",
  "answer": "Hooks allow functional components to use state..."
}
```

### Response

```json
{
  "score": 8,
  "feedback": "Good explanation with correct examples.",
  "nextQuestion": "Explain useEffect."
}
```

---

## End Interview

### Endpoint

```http
POST /interview/end
```

### Request

```json
{
  "interviewId": "INT001"
}
```

### Response

```json
{
  "status": "completed",
  "reportId": "REP100"
}
```

---

# Report APIs

## Get Report

### Endpoint

```http
GET /report/:reportId
```

### Example

```http
GET /report/REP100
```

### Response

```json
{
  "overallScore": 86,
  "technicalKnowledge": 90,
  "communication": 82,
  "problemSolving": 85,
  "strengths": [
    "Good React knowledge",
    "Clear communication"
  ],
  "weaknesses": [
    "Limited optimization concepts"
  ],
  "recommendations": [
    "Practice performance optimization."
  ]
}
```

---

## Interview History

### Endpoint

```http
GET /report/history
```

### Response

```json
[
  {
    "reportId": "REP100",
    "technology": "React",
    "date": "2026-08-07",
    "score": 86
  },
  {
    "reportId": "REP099",
    "technology": "Node.js",
    "date": "2026-08-01",
    "score": 81
  }
]
```

---

# User APIs (Optional)

## Update Profile

### Endpoint

```http
PUT /users/profile
```

### Request

```json
{
  "name": "John Doe"
}
```

### Response

```json
{
  "message": "Profile updated successfully"
}
```

---

## Change Password

### Endpoint

```http
PUT /users/change-password
```

### Request

```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

---

# AI Service APIs (Internal)

These endpoints are typically consumed by the backend service and are not exposed publicly.

## Generate Interview Question

```http
POST /ai/question
```

Request

```json
{
  "technology": "React",
  "difficulty": "Medium",
  "previousQuestions": [],
  "candidateLevel": "Intermediate"
}
```

Response

```json
{
  "question": "Explain the React reconciliation algorithm."
}
```

---

## Evaluate Answer

```http
POST /ai/evaluate
```

Request

```json
{
  "question": "Explain Virtual DOM.",
  "answer": "..."
}
```

Response

```json
{
  "score": 9,
  "feedback": "Accurate explanation with good examples."
}
```

---

# HTTP Status Codes

| Status | Meaning |
|---------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Error Response Format

```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "AUTH_INVALID"
}
```

---

# Authentication Flow

```text
Register/Login
      │
      ▼
Receive JWT
      │
      ▼
Store Token
      │
      ▼
Send Token in Authorization Header
      │
      ▼
Access Protected APIs
```

---

# Interview Flow

```text
POST /interview/start
          │
          ▼
Receive Question
          │
          ▼
POST /interview/answer
          │
          ▼
Receive Feedback
          │
          ▼
Repeat Until Complete
          │
          ▼
POST /interview/end
          │
          ▼
GET /report/:id
```

---

# Rate Limiting

Recommended limits:

- Authentication: **10 requests/minute**
- Interview APIs: **30 requests/minute**
- Report APIs: **60 requests/minute**

---

# Security

- JWT Authentication
- HTTPS in production
- Password hashing with bcrypt
- Input validation
- CORS protection
- Environment variables for secrets
- API rate limiting

---

# Environment Variables

```env
PORT=5000

MONGO_URI=<mongodb_connection_string>

JWT_SECRET=<jwt_secret>

OPENAI_API_KEY=<openai_api_key>
```

---

# API Versioning

Current version:

```
/api/v1
```

Example:

```http
POST /api/v1/interview/start
```

Future versions:

```
/api/v2
```

---

# Future APIs

- Voice Interview
- Video Interview
- Resume Upload
- Resume Analysis
- Coding Challenge
- Recruiter Dashboard
- Interview Scheduling
- Company Question Banks
- Analytics & Insights
- WebSocket support for real-time interviews