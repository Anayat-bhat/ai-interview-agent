"""Deterministic Interview Planner Service.

Enforces hard hackathon requirements:
- Minimum 8 questions asked.
- Minimum 4 distinct curriculum days covered.
- Candidate mission personalization (passed, skipped, high attempts).
- Adaptive turn transitions (FOLLOW_UP, NEW_TOPIC, CLARIFICATION, TERMINATE).
"""

from typing import Any, Dict, List, Optional, Tuple
from memory.session_manager import InterviewState
from services.data_loader import load_curriculum


class PlanDecision:
    """Represents a planner decision for the next interview turn."""

    def __init__(
        self,
        action: str,  # FOLLOW_UP, NEW_TOPIC, CLARIFICATION, TERMINATE
        next_day: int,
        next_topic: str,
        reasoning: str,
        probe_reason: Optional[str] = None,
    ) -> None:
        self.action = action
        self.next_day = next_day
        self.next_topic = next_topic
        self.reasoning = reasoning
        self.probe_reason = probe_reason


def get_curriculum_topics() -> List[Tuple[int, str]]:
    """Return an ordered list of (day, topic_title) from curriculum.json."""
    curriculum = load_curriculum()
    topics: List[Tuple[int, str]] = []

    modules = curriculum.get("modules", []) if isinstance(curriculum, dict) else []
    for mod in modules:
        mod_title = mod.get("title", "Core Engineering")
        days = mod.get("days", [1])
        start_day = days[0] if days else 1
        topics.append((start_day, mod_title))

    if not topics:
        topics = [
            (1, "Environment & Tooling"),
            (7, "Embeddings & Vector Search"),
            (11, "LLM Core, Prompting & Fine-Tuning"),
            (16, "Chatbot Application Build"),
            (21, "Agentic AI & MCP"),
            (25, "Evaluation, Security & Deployment"),
            (29, "Production & Capstone"),
        ]

    return topics


def analyze_candidate_missions(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """Extract passed, skipped, and high-attempt mission signals from candidate profile."""
    missions = candidate.get("missions", [])
    if not isinstance(missions, list):
        missions = candidate.get("member", {}).get("missions", [])

    passed_days: List[int] = []
    skipped_days: List[int] = []
    high_attempt_days: List[Tuple[int, str, int]] = []

    for m in missions:
        if not isinstance(m, dict):
            continue
        day = m.get("day", 1)
        title = m.get("title", "")
        attempts = m.get("attempts", 1)

        if m.get("skipped"):
            skipped_days.append(day)
        elif m.get("passed"):
            passed_days.append(day)
            if attempts >= 3:
                high_attempt_days.append((day, title, attempts))

    return {
        "passed_days": passed_days,
        "skipped_days": skipped_days,
        "high_attempt_days": high_attempt_days,
    }


def determine_next_turn(state: InterviewState, last_quality: Optional[str] = None) -> PlanDecision:
    """Determine the next interviewer turn transition based on state and evaluation.

    Args:
        state: Current InterviewState instance.
        last_quality: Quality classification of last candidate answer (STRONG, PARTIAL, WEAK, VAGUE).

    Returns:
        PlanDecision containing next action, curriculum day, topic, and reasoning.
    """
    curriculum_topics = get_curriculum_topics()
    questions_count = state.questions_asked
    covered_days_count = len(state.covered_days)
    candidate_signals = analyze_candidate_missions(state.candidate)

    # 1. Termination Check: Enforce hard minimums (questions >= 8 AND covered_days >= 4)
    if questions_count >= 8 and covered_days_count >= 4:
        return PlanDecision(
            action="TERMINATE",
            next_day=state.current_curriculum_day,
            next_topic=state.current_topic,
            reasoning="Required minimum 8 questions and 4 curriculum days achieved.",
        )

    # 2. Strict Day Rotation Enforcer: Guarantee 4 unique curriculum days within 8 questions
    remaining_days_needed = max(0, 4 - covered_days_count)
    remaining_questions_allowed = max(1, 8 - questions_count)

    force_new_day = (
        remaining_days_needed > 0
        and remaining_questions_allowed <= remaining_days_needed
    )

    if not force_new_day:
        # 3. Probe High Attempt Missions if available and not yet covered
        for day, title, attempts in candidate_signals["high_attempt_days"]:
            if day not in state.covered_days and questions_count >= 2:
                matched_topic = next((t for d, t in curriculum_topics if abs(d - day) <= 3), "Core Concepts")
                return PlanDecision(
                    action="NEW_TOPIC",
                    next_day=day,
                    next_topic=matched_topic,
                    reasoning=f"Probing topic with multiple attempts ({attempts} attempts on Day {day}: {title}).",
                    probe_reason=f"High attempts ({attempts}) on {title}",
                )

        # 4. Handle Technical Interviewer Follow-up Actions (max 1 follow-up per topic)
        if state.follow_up_count < 1 and last_quality is not None:
            if last_quality == "EXCELLENT":
                return PlanDecision(
                    action="DEEPER_DEPTH",
                    next_day=state.current_curriculum_day,
                    next_topic=state.current_topic,
                    reasoning="Excellent answer demonstrated. Increasing technical depth to probe edge cases.",
                )
            elif last_quality in ("CONCEPTUAL_CORRECT", "STRONG"):
                return PlanDecision(
                    action="TRADEOFFS_SCALING",
                    next_day=state.current_curriculum_day,
                    next_topic=state.current_topic,
                    reasoning="Conceptually correct answer. Probing production trade-offs and scaling constraints.",
                )
            elif last_quality == "PARTIAL":
                return PlanDecision(
                    action="PROBE_MISSING",
                    next_day=state.current_curriculum_day,
                    next_topic=state.current_topic,
                    reasoning="Partially correct response. Probing missing technical mechanism.",
                )
            elif last_quality == "INCORRECT":
                return PlanDecision(
                    action="MISCONCEPTION_CLARIFY",
                    next_day=state.current_curriculum_day,
                    next_topic=state.current_topic,
                    reasoning="Technical misconception detected. Asking targeted clarifying question.",
                )
            elif last_quality in ("VAGUE", "WEAK"):
                return PlanDecision(
                    action="CONCRETE_EXAMPLE",
                    next_day=state.current_curriculum_day,
                    next_topic=state.current_topic,
                    reasoning="Vague answer provided. Demanding a concrete step-by-step implementation example.",
                )

    # 5. Rotate to new curriculum day not yet covered
    for day, topic in curriculum_topics:
        if day not in state.covered_days:
            probe_note = None
            if day in candidate_signals["skipped_days"]:
                probe_note = f"Candidate skipped Day {day} mission. Asking foundational check."

            return PlanDecision(
                action="NEW_TOPIC",
                next_day=day,
                next_topic=topic,
                reasoning=f"Transitioning to new curriculum day {day}: {topic}.",
                probe_reason=probe_note,
            )

    idx = questions_count % len(curriculum_topics)
    next_day, next_topic = curriculum_topics[idx]
    return PlanDecision(
        action="NEW_TOPIC",
        next_day=next_day,
        next_topic=next_topic,
        reasoning=f"Cycling curriculum day {next_day}: {next_topic}.",
    )
