# 🎤 AI Interview Agent

An AI-powered technical interview platform that conducts personalized candidate interviews, evaluates technical responses in real time, and synthesizes structured feedback reports.

---

## 🚀 Quick Start

### 1. Run Backend (FastAPI Python Server)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # On Windows
pip install -r requirements.txt
python main.py
```
Backend API will start at: `http://127.0.0.1:8000`

### 2. Run Frontend (Next.js Application)

```bash
cd frontend
npm install
npm run dev
```
Frontend web app will start at: `http://localhost:3001` (or `http://localhost:3000`)

---

## 📁 Project Architecture

```text
ai-interview-agent/
│
├── data/
│   ├── candidates.json       # Candidate profile dataset
│   └── curriculum.json       # 31-Day AI Curriculum topics
│
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # Application entry point
│   ├── app/
│   │   ├── api/interview.py  # POST /api/interview endpoint router
│   │   └── models/           # Pydantic request/response schemas
│   ├── memory/
│   │   └── session_manager.py# Stateful session management
│   ├── services/
│   │   ├── planner.py        # Interview planner (>=8 Qs, >=4 Days)
│   │   ├── evaluator.py      # Answer evaluation service
│   │   ├── question_generator.py # Question generation service
│   │   ├── feedback.py       # Structured feedback generator
│   │   ├── llm.py            # Provider-agnostic LLM interface
│   │   └── data_loader.py    # JSON data loader with caching
│   └── tests/                # Automated pytest/unittest suite
│
├── frontend/                 # Next.js 15 App Router Frontend
│   ├── app/                  # Pages: /, /interview, /feedback
│   ├── components/           # UI components
│   └── services/             # API client calls
│
├── API.md                    # Detailed API specification
├── ARCHITECTURE.md           # System architecture overview
├── PRD.md                    # Product requirements document
├── PROMPTS.md                # System prompts & AI usage log
├── TASKS.md                  # Development checklist
├── technical-spec.md         # Authoritative technical spec
└── README.md                 # Main project guide
```

---

## 🧪 Testing

Run backend test suite:

```bash
cd backend
python -m unittest discover -s tests
```
