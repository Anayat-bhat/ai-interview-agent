# 📋 Product Requirements Document (PRD)

## Project Purpose
The AI Interview Agent is an autonomous system designed to conduct adaptive technical interviews for software engineering candidates, evaluate candidate answers in real time, and generate actionable feedback reports.

---

## Core Requirements

1. **Conversational Technical Interview**: Conduct an interactive, turn-based technical interview.
2. **Question Quantity & Breadth Constraints**:
   - Minimum **8 questions** per interview session.
   - Minimum **4 distinct curriculum days** covered.
3. **Candidate Personalization**: Incorporate candidate profile metadata (role, experience, passed/skipped missions, attempts) to frame questions and adjust difficulty naturally.
4. **Intelligent Follow-ups**: Evaluate candidate responses and dynamically choose between `FOLLOW_UP`, `NEW_TOPIC`, or `CLARIFICATION`.
5. **Stateful Endpoint**: Single mandatory endpoint `POST /api/interview`.
6. **Structured Feedback Report**: Output executive summary, strengths, technical gaps, and next learning steps upon completion.
