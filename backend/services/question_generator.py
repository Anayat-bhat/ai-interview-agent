"""Question generator service.

This module acts as the orchestration layer between high-level interview state
management and the underlying LLM provider interface (services.llm).
"""

from typing import Any, Dict, List, Optional
from services import llm


def generate_question(
    candidate_info: Dict[str, Any],
    topic: str,
    history: Optional[List[Dict[str, Any]]] = None,
    session_id: Optional[str] = None,
) -> str:
    """Generate an interview question tailored to the candidate and current topic.

    Args:
        candidate_info: Metadata regarding candidate details, role, and experience.
        topic: The specific technical topic or focus area for the question.
        history: Optional list of previous conversation turns or Q&A history.
        session_id: Optional session identifier for tracking the conversation state.

    Returns:
        The generated interview question text.

    Raises:
        NotImplementedError: Propagated from llm.generate() as provider implementation is deferred.
    """
    context: Dict[str, Any] = {
        "candidate": candidate_info,
        "topic": topic,
    }

    effective_session_id = session_id or str(candidate_info.get("id", "session_default"))

    response = llm.generate(
        session_id=effective_session_id,
        context=context,
        message_history=history,
    )

    return response.reply
