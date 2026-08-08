# 📡 AI Interview Agent - API Documentation

## Primary Endpoint

```http
POST /api/interview
```

The AI Interview Agent exposes a single, unified stateful endpoint for conducting AI-driven technical interviews.

---

## Request & Response Specifications

### 1. Start Interview Request
Initializes a new interview session for a candidate.

**Payload:**
```json
{
  "sessionId": "sess_12345",
  "candidate": {
    "member": {
      "id": "CAND-001",
      "name": "Sarah Johnson",
      "jobRole": "Senior Data Engineer",
      "yearsExperience": 9,
      "education": "MS Computer Science"
    },
    "missions": [
      { "day": 7, "title": "Embeddings Explained", "passed": true, "attempts": 1 }
    ],
    "signals": { "commitDays": 28, "missionsCompleted": 30, "missionsFirstTry": 20 }
  }
}
```

**Expected Response:**
```json
{
  "reply": "Welcome Sarah Johnson. Let's begin your technical interview...",
  "done": false
}
```

---

### 2. Conversation Turn Request
Processes a candidate answer and returns the next adaptive question or follow-up.

**Payload:**
```json
{
  "sessionId": "sess_12345",
  "message": "Vector embeddings represent text as dense vectors in a high-dimensional space..."
}
```

**Expected Response:**
```json
{
  "reply": "Thank you. Regarding production scale, how would you handle vector database sharding under heavy write workloads?",
  "done": false
}
```

---

### 3. Final Interview Response
Returned when the deterministic interview rules (minimum 8 questions, minimum 4 curriculum days) are satisfied.

**Payload:**
```json
{
  "sessionId": "sess_12345",
  "endSession": true
}
```

**Expected Response:**
```json
{
  "reply": "Interview completed for Sarah Johnson.",
  "done": true,
  "feedback": {
    "summary": "Sarah demonstrated strong technical knowledge for the Senior Data Engineer role...",
    "strengths": [
      "Solid fundamentals in Senior Data Engineer core principles",
      "Clear and structured technical communication"
    ],
    "gaps": [
      "Deep dive into edge-case error recovery under high concurrency"
    ],
    "next": [
      "Review advanced performance tuning techniques",
      "Explore multi-agent orchestration frameworks"
    ]
  }
}
```

---

## Guarantees & Constraints

- **Session State**: Maintained in-memory per `sessionId`.
- **Termination Policy**: `done` becomes `true` only after `questionsAsked >= 8` AND `coveredDays >= 4` (or explicit `endSession=true`).
- **Feedback Schema**: Exactly contains `summary` (string), `strengths` (array), `gaps` (array), `next` (array).
