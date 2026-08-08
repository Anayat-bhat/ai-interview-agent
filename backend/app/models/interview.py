from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class InterviewRequest(BaseModel):
    """Pydantic model representing the request payload for POST /api/interview."""
    sessionId: str = Field(..., description="Unique interview session identifier")
    candidate: Optional[Dict[str, Any]] = Field(None, description="Candidate details object")
    message: Optional[str] = Field(None, description="Candidate answer message")
    endSession: Optional[bool] = Field(False, description="Flag to explicitly end interview session")


class FeedbackModel(BaseModel):
    """Pydantic model for final structured evaluation report."""
    summary: str = Field(..., description="Executive evaluation summary")
    strengths: List[str] = Field(default_factory=list, description="Key candidate strengths")
    gaps: List[str] = Field(default_factory=list, description="Identified knowledge gaps")
    next: List[str] = Field(default_factory=list, description="Recommended next learning steps")


class InterviewResponse(BaseModel):
    """Pydantic model representing the response for an interview turn."""
    reply: str = Field(..., description="Interviewer response message")
    done: bool = Field(default=False, description="Flag indicating if interview is complete")
    feedback: Optional[FeedbackModel] = Field(None, description="Structured feedback object when done=true")

