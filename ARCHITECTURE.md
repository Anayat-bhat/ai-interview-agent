# System Architecture

# AI Interview Agent

**Version:** 1.0

---

# 1. Overview

The AI Interview Agent is a full-stack application that automates technical interviews using Large Language Models (LLMs). The system manages interview sessions, generates context-aware questions, evaluates candidate responses, and produces structured interview reports.

The architecture follows a modular client-server design with a React frontend, an Express backend, MongoDB for persistence, and the OpenAI API for AI capabilities.

---

# 2. High-Level Architecture

```text
                           +----------------------+
                           |      Candidate       |
                           +----------+-----------+
                                      |
                                      |
                              HTTPS Requests
                                      |
                                      ▼
                        +---------------------------+
                        |      React Frontend       |
                        +-------------+-------------+
                                      |
                              REST API Calls
                                      |
                                      ▼
                        +---------------------------+
                        |      Express Backend      |
                        +-------------+-------------+
                                      |
                 +--------------------+--------------------+
                 |                    |                    |
                 ▼                    ▼                    ▼
         Authentication        Interview Engine      Report Engine
                 |                    |                    |
                 +--------------------+--------------------+
                                      |
                                      ▼
                           OpenAI API (LLM)
                                      |
                                      ▼
                             AI Generated Output
                                      |
                                      ▼
                              MongoDB Database
```

---

# 3. Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- Mongoose

---

## Database

MongoDB

Collections:

- Users
- Interviews
- Reports

---

## AI Layer

OpenAI GPT API

Responsibilities:

- Question generation
- Follow-up questions
- Answer evaluation
- Interview summary
- Feedback generation

---

# 4. Component Architecture

```text
Frontend
│
├── Authentication
├── Dashboard
├── Interview Screen
├── Report Page
└── Profile

Backend
│
├── Auth Module
├── Interview Module
├── AI Module
├── Report Module
└── Database Module
```

---

# 5. Frontend Architecture

```text
src/
│
├── assets/
├── components/
│     ├── Navbar
│     ├── Sidebar
│     ├── QuestionCard
│     ├── AnswerInput
│     └── ReportCard
│
├── pages/
│     ├── Login
│     ├── Register
│     ├── Dashboard
│     ├── Interview
│     └── Report
│
├── services/
│     ├── api.js
│     └── auth.js
│
├── hooks/
│
├── context/
│
└── App.jsx
```

---

# 6. Backend Architecture

```text
backend/
│
├── controllers/
│
├── routes/
│
├── middleware/
│
├── services/
│      ├── OpenAIService
│      ├── InterviewService
│      └── ReportService
│
├── models/
│
├── config/
│
├── utils/
│
└── server.js
```

---

# 7. Request Flow

## User Login

```text
User

↓

Frontend

↓

POST /login

↓

Authentication Middleware

↓

JWT Generation

↓

MongoDB

↓

Response

↓

Dashboard
```

---

## Interview Flow

```text
Candidate

↓

Start Interview

↓

Backend

↓

Create Interview Session

↓

Generate Prompt

↓

OpenAI API

↓

Interview Question

↓

Frontend

↓

Candidate Response

↓

Backend

↓

OpenAI Evaluation

↓

Save Response

↓

Next Question

↓

Repeat Until Complete

↓

Generate Final Report
```

---

# 8. Database Schema

## Users

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed",
  "role": "candidate"
}
```

---

## Interview

```json
{
  "_id": "...",
  "candidateId": "...",
  "technology": "React",
  "difficulty": "Medium",
  "questions": [],
  "answers": [],
  "status": "Completed"
}
```

---

## Report

```json
{
  "_id": "...",
  "interviewId": "...",
  "score": 87,
  "strengths": [],
  "weaknesses": [],
  "feedback": ""
}
```

---

# 9. API Endpoints

## Authentication

```http
POST /api/auth/register

POST /api/auth/login
```

---

## Interview

```http
POST /api/interview/start

POST /api/interview/question

POST /api/interview/answer

GET /api/interview/:id
```

---

## Reports

```http
GET /api/report/:id

GET /api/report/history
```

---

# 10. AI Pipeline

```text
Candidate Response
        │
        ▼
Prompt Builder
        │
        ▼
OpenAI API
        │
        ▼
Evaluation
        │
        ▼
Score Generator
        │
        ▼
Feedback Generator
        │
        ▼
Database
```

---

# 11. Security

Authentication

- JWT Tokens
- Password Hashing (bcrypt)

Authorization

- Protected Routes
- Role-Based Access Control (optional)

Environment Variables

```env
OPENAI_API_KEY=

JWT_SECRET=

MONGO_URI=
```

---

# 12. Error Handling

- Invalid authentication
- Expired JWT tokens
- AI API failures
- Database connection errors
- Invalid interview session
- Network failures

---

# 13. Deployment Architecture

```text
                Internet
                    │
                    ▼
             Vercel (Frontend)
                    │
                    ▼
          Render / Railway (Backend)
                    │
                    ▼
                MongoDB Atlas
                    │
                    ▼
                OpenAI API
```

---

# 14. Scalability

Future improvements:

- Redis caching
- Background job queues
- WebSockets for live interviews
- Microservices architecture
- Kubernetes deployment
- Horizontal backend scaling
- AI request batching

---

# 15. Future Architecture

```text
                    API Gateway
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      ▼                  ▼                  ▼
 Auth Service      Interview Service    Report Service
      │                  │                  │
      └──────────────┬───┴──────────────────┘
                     ▼
                AI Service Layer
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
      OpenAI API          Vector Database
                                │
                                ▼
                        Knowledge Base (RAG)
```

---

# 16. Design Principles

- Modular architecture
- Separation of concerns
- Stateless backend services
- RESTful APIs
- Secure authentication
- Scalable service design
- Reusable UI components
- AI-driven business logic

---

# 17. Future Enhancements

- Voice-based interviews
- Video interviews
- Live coding environment
- Resume parsing
- Adaptive questioning
- Company-specific interview templates
- Multi-language support
- Analytics dashboard
- Real-time recruiter monitoring
- Retrieval-Augmented Generation (RAG)
- Vector database integration
- AI agent orchestration