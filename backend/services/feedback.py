"""Feedback service for synthesizing candidate interview evaluations.

This module defines the structured Pydantic response model and service logic
for generating interview feedback reports via the LLM abstraction layer.
"""

from typing import Any, Dict, List
from pydantic import BaseModel, Field
from services import llm


class FeedbackResponse(BaseModel):
    """Structured feedback model matching technical API specifications."""

    summary: str = Field(..., description="Summary of candidate technical performance.")
    strengths: List[str] = Field(default_factory=list, description="Key candidate technical strengths.")
    gaps: List[str] = Field(default_factory=list, description="Identified areas for candidate improvement.")
    next: List[str] = Field(default_factory=list, description="Actionable next steps and learning topics.")


def generate_feedback(
    session_id: str,
    candidate_info: Dict[str, Any],
    evaluations: List[Dict[str, Any]],
) -> FeedbackResponse:
    """Generate final structured interview feedback from completed interview evaluations.

    Args:
        session_id: Unique identifier for the completed interview session.
        candidate_info: Candidate metadata including name, job role, and experience.
        evaluations: List of turn evaluations recorded during the interview.

    Returns:
        FeedbackResponse instance adhering strictly to the response schema.

    Raises:
        NotImplementedError: Propagated from llm.feedback() as provider integration is deferred.
    """
    report = llm.feedback(
        session_id=session_id,
        candidate_info=candidate_info,
        evaluations=evaluations,
    )

    return FeedbackResponse(
        summary=report.summary,
        strengths=report.strengths,
        gaps=report.gaps,
        next=report.next,
    )
