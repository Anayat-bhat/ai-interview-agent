# 🏗️ AI Interview Agent - Architecture Documentation

## Overview

The AI Interview Agent is built on a modular, decoupled architecture consisting of a **Next.js 15 Frontend**, a **FastAPI Python Backend**, a **Deterministic Interview Planner**, and a **Provider-Agnostic LLM Layer**.

```text
                                 +------------------------+
                                 |  Next.js 15 Frontend   |
                                 | (Selection/Room/Report)|
                                 +-----------+------------+
                                             |
                                  POST /api/interview
                                             |
                                             v
                                 +------------------------+
                                 |  FastAPI Backend API   |
                                 +-----------+------------+
                                             |
                                 +-----------v------------+
                                 |    Session Manager     |
                                 |   (Short & Session)    |
                                 +-----------+------------+
                                             |
                                 +-----------v------------+
                                 |   Interview Planner    |
                                 | (>=8 Qs, >=4 Days)     |
                                 +-----------+------------+
                                             |
           +---------------------------------+---------------------------------+
           |                                 |                                 |
           v                                 v                                 v
+--------------------+            +--------------------+            +--------------------+
| Question Generator |            |  Answer Evaluator  |            | Feedback Generator |
|  (Topic & Profile) |            | (Knowledge/Comm)   |            |  (Final Report)    |
+----------+---------+            +----------+---------+            +----------+---------+
           |                                 |                                 |
           +---------------------------------+---------------------------------+
                                             |
                                             v
                                 +------------------------+
                                 |  LLM Abstraction Layer |
                                 |     (services/llm)     |
                                 +------------------------+
```

---

## Core Components

### 1. Unified Session Manager (`backend/memory/session_manager.py`)
- Maintains interview session state indexed by `sessionId`.
- Tracks candidate profile, question count, covered curriculum days, evaluation logs, and completion status.

### 2. Deterministic Interview Planner (`backend/services/planner.py`)
- Enforces hard constraints: minimum 8 questions and 4 unique curriculum days.
- Determines turn transition types: `FOLLOW_UP`, `NEW_TOPIC`, `CLARIFICATION`, or `TERMINATE`.

### 3. Service Layer
- `services/question_generator.py`: Generates technical questions customized to candidate experience & curriculum topics.
- `services/evaluator.py`: Evaluates candidate answers across knowledge, communication, and depth.
- `services/feedback.py`: Synthesizes final structured feedback reports.
- `services/llm.py`: Provider-agnostic abstraction for all LLM operations.
- `services/data_loader.py`: Safe JSON loader and LRU cache for candidate and curriculum data.

---

## Data Pipeline & Personalization

- **Candidate Dataset** (`data/candidates.json`): Personalizes difficulty and framing based on candidate role, years of experience, passed missions, skipped missions, and attempt counts.
- **Curriculum Dataset** (`data/curriculum.json`): Guides topic selection across 31 days and 8 modules.
