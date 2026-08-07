# 🎤 AI Interview Agent

> Build the interviewer, not the interview.

An AI-powered interview platform that conducts technical interviews using autonomous AI agents. The system conducts adaptive technical interviews, evaluates candidate answers in real time, and outputs structured feedback reports.

---

# 📂 Project Structure

```
ai-interview-agent/
│
├── frontend/             # Next.js 15 App Router Frontend Application
│   ├── app/              # Next.js App Router pages (/ , /interview , /feedback)
│   ├── components/       # Reusable UI, candidate, interview & feedback components
│   ├── hooks/            # Custom React hooks (useCandidate, useInterview, etc.)
│   ├── services/         # API Service contract definitions (services/interview.ts)
│   ├── types/            # Strict TypeScript interfaces
│   └── package.json      # Frontend package configuration
│
├── backend/              # Node.js / Express Backend Server
│   ├── controllers/      # Route logic controllers
│   ├── routes/           # Express route definitions
│   ├── models/           # Data models & schemas
│   ├── middleware/       # Express middleware
│   ├── utils/            # Helper utilities
│   └── package.json      # Backend package configuration
│
├── docs/                 # Architectural & API Documentation
│   ├── API.md            # API Endpoints & Request/Response Contracts
│   ├── ARCHITECTURE.md   # Architectural Overview
│   ├── PRD.md            # Product Requirements Document
│   ├── PROMPTS.md        # LLM System Prompts & Guidelines
│   └── TASKS.md          # Project Checklist & Status
│
├── candidates.json       # Candidate dataset schema & roster
├── curriculum.json       # 31-Day AI Curriculum & Mission Benchmarks
├── technical-spec.md     # Official POST /api/interview Technical Specification
└── README.md             # Main Repository Documentation
```

---

# 🚀 Quick Start

## Frontend Setup (Next.js 15)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to access:
- **Candidate Selection Portal (`/`)**
- **Interview Room (`/interview`)**
- **Interview Feedback Dashboard (`/feedback`)**

---

## Backend Setup (Express API)

```bash
cd backend
npm install
npm run dev
```

Exposes `POST /api/interview` on `http://localhost:5000/api/interview` per `technical-spec.md`.

---

# 🧪 API Contract (`POST /api/interview`)

### Start Interview
```json
POST /api/interview
{
  "sessionId": "sess_12345",
  "candidate": { "name": "Sarah Johnson", "jobRole": "Senior Data Engineer" }
}
```
**Response:**
```json
{
  "reply": "Welcome Sarah Johnson. Let's begin your interview.",
  "done": false
}
```

### Conversation Turn
```json
POST /api/interview
{
  "sessionId": "sess_12345",
  "message": "Virtual DOM reconciliation minimizes DOM reflows by batching updates."
}
```
**Response:**
```json
{
  "reply": "Thank you for explaining that. Let's move on to state management...",
  "done": false
}
```

### End Interview
```json
POST /api/interview
{
  "sessionId": "sess_12345",
  "endSession": true
}
```
**Response:**
```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "Demonstrated solid technical knowledge and clear communication.",
    "strengths": ["Strong domain fundamentals", "Clear communication"],
    "gaps": ["Advanced performance tuning", "System design"],
    "next": ["Practice performance optimization", "Build full-stack project"]
  }
}
```

---

# 📄 License

MIT License.
