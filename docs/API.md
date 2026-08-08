# 📖 API Documentation

## Endpoint Overview

Base URL: `http://localhost:5000/api` or `http://localhost:3000/api`

---

## 1. Interview API (`POST /api/interview`)

### Start Interview Request
```json
POST /api/interview

{
  "sessionId": "sess_12345",
  "candidate": {
    "member": {
      "id": "CAND-001",
      "name": "Sarah Johnson",
      "jobRole": "Senior Data Engineer",
      "yearsExperience": 9,
      "education": "MS Computer Science",
      "status": "COMPLETED"
    }
  }
}
```

### Start Response
```json
{
  "reply": "Welcome Sarah Johnson. Let's begin your interview.",
  "done": false
}
```

---

### Conversation Turn Request
```json
POST /api/interview

{
  "sessionId": "sess_12345",
  "message": "Virtual DOM reconciliation reduces browser DOM reflow overhead by batching state updates."
}
```

### Conversation Turn Response
```json
{
  "reply": "Excellent explanation of batching. Let's move on to state management trade-offs.",
  "done": false
}
```

---

### End Interview Response
```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "Demonstrated solid technical knowledge and communicated effectively throughout the interview.",
    "strengths": [
      "Strong React fundamentals",
      "Clear technical communication",
      "Good problem-solving approach"
    ],
    "gaps": [
      "Advanced performance tuning",
      "Testing strategies",
      "System design knowledge"
    ],
    "next": [
      "Practice performance optimization",
      "Build full-stack architectural projects",
      "Learn caching techniques"
    ]
  }
}
```
