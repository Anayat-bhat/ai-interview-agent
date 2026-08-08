from typing import Dict, Any
from fastapi import APIRouter, status, HTTPException
from app.models.interview import InterviewRequest, InterviewResponse, FeedbackModel

router = APIRouter(prefix="/api/interview", tags=["Interview"])

sessions: Dict[str, Dict[str, Any]] = {}

ROLE_QUESTIONS = {
    "Senior Data Engineer": [
        {
            "title": "Embeddings & Vector Indexing",
            "description": "Explain how vector embeddings are generated, stored in vector databases (e.g. Pinecone/Chroma), and indexed for fast similarity search.",
        },
        {
            "title": "Data Pipeline Scaling & Backpressure",
            "description": "How do you handle stream processing backpressure and schema evolution in high-throughput Kafka / Spark pipelines?",
        },
        {
            "title": "Retrieval & Matching Engine Design",
            "description": "Describe your approach to designing a low-latency hybrid search engine combining BM25 keyword matching with dense vector retrieval.",
        },
    ],
    "AI Engineer": [
        {
            "title": "RAG Architecture & Context Window Optimization",
            "description": "How do you structure an end-to-end RAG system to minimize hallucination and stay within context length limits?",
        },
        {
            "title": "Multi-Agent Orchestration & Tool Calling",
            "description": "Explain how to coordinate multiple autonomous agents using structured function calling and Model Context Protocol (MCP).",
        },
        {
            "title": "Model Fine-Tuning vs In-Context Prompt Engineering",
            "description": "When would you choose LoRA/PEFT fine-tuning over advanced prompt engineering and chain-of-thought prompting?",
        },
    ],
    "Backend Software Engineer": [
        {
            "title": "Node.js Event Loop & Non-Blocking I/O",
            "description": "Explain the phases of the Node.js event loop and how worker threads handle CPU-bound workloads.",
        },
        {
            "title": "Microservices Communication & Distributed Caching",
            "description": "Compare gRPC, HTTP REST, and Redis caching strategies for high-concurrency microservice architectures.",
        },
        {
            "title": "Database Sharding & Transaction Isolation",
            "description": "How do ACID guarantees and isolation levels work in distributed relational databases under heavy write loads?",
        },
    ],
    "default": [
        {
            "title": "React Architecture & Virtual DOM Reconciliation",
            "description": "Explain how the Virtual DOM diffing algorithm minimizes reflows and improves UI rendering efficiency.",
        },
        {
            "title": "State Management & Custom Hooks",
            "description": "How do custom React hooks encapsulate complex state logic and prevent unnecessary component re-renders?",
        },
        {
            "title": "API Integration & Performance Optimization",
            "description": "Discuss best practices for async data fetching, caching, and error boundaries in modern web applications.",
        },
    ],
}


def get_questions_for_role(job_role: str):
    if not job_role:
        return ROLE_QUESTIONS["default"]
    for role_key in ROLE_QUESTIONS:
        if role_key.lower() in job_role.lower():
            return ROLE_QUESTIONS[role_key]
    return ROLE_QUESTIONS["default"]


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit interview message",
    description="Endpoint for handling candidate interview turns and returning agent replies.",
)
async def handle_interview_turn(req: InterviewRequest) -> InterviewResponse:
    session_id = req.sessionId
    if not session_id:
        raise HTTPException(status_code=400, detail="sessionId is required")

    session = sessions.get(session_id)

    # 1. End Interview Request
    if req.endSession or (session and session.get("currentTurn", 0) >= 3):
        cand_name = session.get("candidateName") if session else (req.candidate.get("name") if req.candidate else "Candidate")
        job_role = session.get("jobRole") if session else "Software Engineer"
        answers_count = len(session.get("answers", [])) if session else 1

        return InterviewResponse(
            reply=f"Interview completed for {cand_name}.",
            done=True,
            feedback=FeedbackModel(
                summary=f"{cand_name} demonstrated strong technical knowledge for the {job_role} position, submitting {answers_count} detailed responses.",
                strengths=[
                    f"Solid fundamentals in {job_role} core architecture",
                    "Clear and structured technical communication",
                    "Methodical problem-solving approach",
                    "Good understanding of production engineering trade-offs",
                ],
                gaps=[
                    "Advanced failure mode analysis under peak concurrency",
                    "Distributed telemetry and automated monitoring",
                ],
                next=[
                    "Practice complex system design mock interviews",
                    "Build full-stack microservice projects",
                    "Study advanced performance profiling techniques",
                ],
            ),
        )

    # 2. Start Interview Request
    if req.candidate or not session:
        cand_obj = req.candidate or {}
        cand_name = cand_obj.get("name") or cand_obj.get("member", {}).get("name") or "Candidate"
        job_role = cand_obj.get("jobRole") or cand_obj.get("member", {}).get("jobRole") or "Software Engineer"

        session = {
            "candidateName": cand_name,
            "jobRole": job_role,
            "answers": [],
            "currentTurn": 0,
        }
        sessions[session_id] = session

        questions = get_questions_for_role(job_role)
        first_q = questions[0]

        return InterviewResponse(
            reply=f"Welcome {cand_name}. Let's begin your technical interview for the {job_role} position. Question 1: {first_q['title']} - {first_q['description']}",
            done=False,
        )

    # 3. Conversation Turn Request
    if req.message:
        session["answers"].append(req.message)
        session["currentTurn"] += 1

        questions = get_questions_for_role(session["jobRole"])

        if session["currentTurn"] < len(questions):
            next_q = questions[session["currentTurn"]]
            return InterviewResponse(
                reply=f"Thank you for your answer. Let's move to Question {session['currentTurn'] + 1}: {next_q['title']} - {next_q['description']}",
                done=False,
            )
        else:
            return InterviewResponse(
                reply=f"Thank you for completing all technical questions, {session['candidateName']}. Generating your final evaluation report.",
                done=True,
                feedback=FeedbackModel(
                    summary=f"{session['candidateName']} completed all technical evaluation questions for the {session['jobRole']} role with clear technical depth.",
                    strengths=[
                        f"Strong proficiency in {session['jobRole']}",
                        "Structured problem-solving methodology",
                        "Precise technical terminology",
                    ],
                    gaps=[
                        "Further optimization under high concurrency",
                        "Automated test suite coverage",
                    ],
                    next=[
                        "Review advanced concurrency & async patterns",
                        "Implement automated performance benchmarks",
                    ],
                ),
            )

    return InterviewResponse(
        reply="Welcome. Let's begin your interview.",
        done=False,
    )

