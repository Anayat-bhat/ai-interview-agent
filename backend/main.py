from typing import Optional, Dict, Any, List
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.api.interview import router as interview_router

app = FastAPI(
    title="AI Interview Agent Backend",
    description="Backend API service for conducting AI-driven technical candidate interviews.",
    version="1.0.0",
)

# Enable CORS for local frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(interview_router)


class InterviewRequest(BaseModel):
    sessionId: str = Field(..., description="Unique interview session identifier")
    candidate: Optional[Dict[str, Any]] = Field(None, description="Candidate details")
    message: Optional[str] = Field(None, description="Candidate response text")
    endSession: Optional[bool] = Field(False, description="Flag to end interview session")


class FeedbackModel(BaseModel):
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]


class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[FeedbackModel] = None


# In-memory session state
sessions: Dict[str, Dict[str, Any]] = {}


@app.get("/", summary="Health check endpoint")
async def root():
    """Root endpoint verifying backend service health status."""
    return {"message": "AI Interview Agent Backend Running"}


@app.post("/api/interview", response_model=InterviewResponse, summary="Main AI Interview Endpoint")
async def handle_interview(req: InterviewRequest):
    """Single standardized HTTP endpoint defined in technical-spec.md."""
    session_id = req.sessionId
    if not session_id:
        raise HTTPException(status_code=400, detail="sessionId is required")

    session = sessions.get(session_id)

    # 1. End Interview Turn
    if req.endSession or (session and session.get("currentTurn", 0) >= 3):
        cand_name = session.get("candidateName") if session else "Candidate"
        role = session.get("jobRole") if session else "Engineer"

        return InterviewResponse(
            reply=f"Interview completed for {cand_name}.",
            done=True,
            feedback=FeedbackModel(
                summary=f"{cand_name} demonstrated strong technical knowledge for the {role} position.",
                strengths=[
                    f"Solid fundamentals in {role} core concepts",
                    "Clear technical communication",
                    "Methodical problem-solving approach",
                ],
                gaps=[
                    "Deep dive into production error recovery",
                    "Advanced monitoring & telemetry",
                ],
                next=[
                    "Practice complex system design scenarios",
                    "Build full-stack microservice projects",
                ],
            ),
        )

    # 2. Start Interview Turn
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

        return InterviewResponse(
            reply=f"Welcome {cand_name}. Let's begin your technical interview for the {job_role} position.",
            done=False,
        )

    # 3. Conversation Turn
    if req.message:
        session["answers"].append(req.message)
        session["currentTurn"] += 1

        if session["currentTurn"] < 3:
            return InterviewResponse(
                reply=f"Thank you for your answer. Moving on to question {session['currentTurn'] + 1}.",
                done=False,
            )
        else:
            return InterviewResponse(
                reply=f"Thank you for completing the interview, {session['candidateName']}.",
                done=True,
                feedback=FeedbackModel(
                    summary=f"{session['candidateName']} completed all technical evaluation questions successfully.",
                    strengths=[
                        f"Strong proficiency in {session['jobRole']}",
                        "Clear articulation of system design trade-offs",
                    ],
                    gaps=[
                        "Further performance tuning under high load",
                    ],
                    next=[
                        "Study advanced performance profiling",
                    ],
                ),
            )

    return InterviewResponse(
        reply="Welcome. Let's begin your interview.",
        done=False,
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

