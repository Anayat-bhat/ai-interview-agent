"""Provider-agnostic abstraction layer for LLM operations.

This module defines the standard interface for generating questions/responses,
evaluating candidate answers, and synthesizing final interview feedback.
"""

from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class QuestionResponse:
    """Represents a generated question or response turn."""
    reply: str
    done: bool = False


@dataclass
class AnswerEvaluation:
    """Represents the evaluation result of a candidate's answer."""
    is_satisfactory: bool
    score: float
    feedback_notes: str


@dataclass
class FeedbackReport:
    """Represents the final structured feedback report for an interview."""
    summary: str
    strengths: List[str]
    gaps: List[str]
    next: List[str]


def generate(
    session_id: str,
    context: Dict[str, Any],
    message_history: Optional[List[Dict[str, Any]]] = None,
) -> QuestionResponse:
    """Generate an interview question or conversational response from the supplied context.

    Args:
        session_id: Unique identifier for the current interview session.
        context: Contextual metadata (e.g., candidate details, role, topic).
        message_history: Optional list of previous conversation turns.

    Returns:
        QuestionResponse containing the generated reply and completion status.

    Raises:
        NotImplementedError: Always raised as provider integration is deferred.
    """
    raise NotImplementedError("LLM generate function is not yet implemented.")


def evaluate(
    question: str,
    answer: str,
    context: Optional[Dict[str, Any]] = None,
) -> AnswerEvaluation:
    """Evaluate a candidate answer against a question and return structured evaluation data.

    Args:
        question: The technical question or prompt presented to the candidate.
        answer: The candidate's response text.
        context: Optional evaluation guidelines, target role, or scoring criteria.

    Returns:
        AnswerEvaluation with satisfaction status, numerical score, and feedback notes.

    Raises:
        NotImplementedError: Always raised as provider integration is deferred.
    """
    raise NotImplementedError("LLM evaluate function is not yet implemented.")


def feedback(
    session_id: str,
    candidate_info: Dict[str, Any],
    evaluations: List[Dict[str, Any]],
) -> FeedbackReport:
    """Generate final structured interview feedback from the completed interview and evaluations.

    Args:
        session_id: Unique identifier for the completed interview session.
        candidate_info: Candidate metadata including name, job role, and experience.
        evaluations: List of evaluations or turn history recorded during the interview.

    Returns:
        FeedbackReport containing summary, strengths, gaps, and next steps.

    Raises:
        NotImplementedError: Always raised as provider integration is deferred.
    """
    raise NotImplementedError("LLM feedback function is not yet implemented.")
