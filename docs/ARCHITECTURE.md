# 🏗️ Architecture Specification

## Overview

The AI Interview Agent is structured into modular layers designed for high scalability, strict type safety, and seamless API integration.

```
Candidate
   │
   ▼
Frontend (Next.js 15 App Router / React 19)
   │
   ├─► App Routes (/ , /interview , /feedback)
   ├─► Components (/ui, /candidate, /interview, /feedback, /common, /layout)
   ├─► Services (services/interview.ts)
   └─► Hooks & State Management
   │
   ▼
Backend API (Express / Next.js API Routes)
   │
   ├─► POST /api/interview (Session turn state & feedback evaluation)
   ├─► LLM Prompt Pipeline & Scoring Engine
   └─► Database / Record Storage (candidates.json & curriculum.json)
```

## System Components

1. **Frontend**: Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS
2. **Backend Services**: Express / Next.js Serverless API endpoints
3. **Data Schemas**: `candidates.json` (Record schema), `curriculum.json` (31-day curriculum & missions benchmark), `technical-spec.md` (HTTP Contract)
