"""Session Manager Service.

Provides in-memory session management for technical interview state tracking,
short-term turn memory, and long-term interview evaluation facts.
"""

from typing import Any, Dict, List, Optional, Set
from pydantic import BaseModel, Field


class InterviewState(BaseModel):
    """Complete state model for an active or completed interview session."""

    session_id: str
    candidate: Dict[str, Any] = Field(default_factory=dict)
    history: List[Dict[str, str]] = Field(default_factory=list)
    current_topic: str = "Core Engineering & Architecture"
    current_curriculum_day: int = 1
    questions_asked: int = 0
    asked_questions: Set[str] = Field(default_factory=set)
    covered_days: Set[int] = Field(default_factory=set)
    evaluations: List[Dict[str, Any]] = Field(default_factory=list)
    follow_up_count: int = 0
    interview_started: bool = False
    interview_completed: bool = False
    feedback: Optional[Dict[str, Any]] = None


class SessionManager:
    """Manages creation, lookup, and updates for interview sessions."""

    def __init__(self) -> None:
        self._sessions: Dict[str, InterviewState] = {}

    def get_or_create_session(
        self, session_id: str, candidate_data: Optional[Dict[str, Any]] = None
    ) -> InterviewState:
        """Retrieve existing session or initialize a new interview state.

        Args:
            session_id: Unique identifier for the interview session.
            candidate_data: Candidate profile data (if starting session).

        Returns:
            InterviewState instance for the session.
        """
        if session_id not in self._sessions:
            state = InterviewState(
                session_id=session_id,
                candidate=candidate_data or {},
                interview_started=True,
            )
            self._sessions[session_id] = state
        elif candidate_data:
            self._sessions[session_id].candidate = candidate_data

        return self._sessions[session_id]

    def get_session(self, session_id: str) -> Optional[InterviewState]:
        """Look up an existing interview session by session ID.

        Args:
            session_id: Unique session identifier.

        Returns:
            InterviewState if session exists, else None.
        """
        return self._sessions.get(session_id)

    def save_session(self, state: InterviewState) -> None:
        """Persist updated interview state.

        Args:
            state: InterviewState instance to save.
        """
        self._sessions[state.session_id] = state

    def clear_session(self, session_id: str) -> None:
        """Remove a session from memory."""
        self._sessions.pop(session_id, None)

    def record_question(self, session_id: str, question: str, day: int) -> None:
        """Record an asked question and curriculum day in session state."""
        state = self.get_session(session_id)
        if state:
            state.asked_questions.add(question.strip().lower())
            state.covered_days.add(day)
            state.questions_asked += 1
            self.save_session(state)

    def is_question_asked(self, session_id: str, question: str) -> bool:
        """Check if a question or similar text has already been asked in this session."""
        state = self.get_session(session_id)
        if not state:
            return False
        clean_q = question.strip().lower()
        return clean_q in state.asked_questions


# Global singleton session manager instance
session_manager = SessionManager()

