"""FastAPI API Router for POST /api/interview endpoint.

Implements stateful technical candidate interview orchestration using
Session Manager, Deterministic Planner, Evaluator, and Feedback services.
"""

import sys
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, status

# Ensure backend root is on sys.path for services imports
backend_root = Path(__file__).resolve().parent.parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.models.interview import FeedbackModel, InterviewRequest, InterviewResponse
from memory.session_manager import session_manager
from services.evaluator import evaluate_answer
from services.feedback import generate_feedback
from services.planner import determine_next_turn
from services.question_generator import generate_question

router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit candidate interview turn",
    description="Primary stateful endpoint for conducting AI-driven technical candidate interviews.",
)
async def handle_interview_turn(req: InterviewRequest) -> InterviewResponse:
    session_id = req.sessionId
    if not session_id or not session_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="sessionId is required",
        )

    # 1. End Interview explicitly requested
    if req.endSession:
        state = session_manager.get_or_create_session(session_id, req.candidate)
        feedback_res = generate_feedback(session_id, state.candidate, state.evaluations)
        state.interview_completed = True
        session_manager.save_session(state)

        cand_name = state.candidate.get("name") or state.candidate.get("member", {}).get("name") or "Candidate"
        return InterviewResponse(
            reply=f"Interview completed for {cand_name}.",
            done=True,
            feedback=FeedbackModel(**feedback_res.model_dump()),
        )

    # 2. Start Interview Request
    if req.candidate or not session_manager.get_session(session_id):
        cand_data = req.candidate or {}
        state = session_manager.get_or_create_session(session_id, cand_data)

        # First planner decision
        plan = determine_next_turn(state)
        state.current_topic = plan.next_topic
        state.current_curriculum_day = plan.next_day

        question_text = generate_question(
            candidate_info=state.candidate,
            topic=plan.next_topic,
            day=plan.next_day,
            action=plan.action,
            session_id=session_id,
            asked_questions=state.asked_questions,
            probe_reason=plan.probe_reason,
        )

        state.questions_asked = 1
        state.covered_days.add(plan.next_day)
        state.asked_questions.add(question_text.strip().lower())
        state.history.append({"sender": "ai", "content": question_text})
        session_manager.save_session(state)

        cand_name = state.candidate.get("name") or state.candidate.get("member", {}).get("name") or "Candidate"
        job_role = state.candidate.get("jobRole") or state.candidate.get("member", {}).get("jobRole") or "Software Engineer"

        return InterviewResponse(
            reply=f"Welcome {cand_name}. Let's begin your technical interview for the {job_role} position. {question_text}",
            done=False,
        )

    # 3. Conversation Turn Request (Candidate message provided)
    state = session_manager.get_session(session_id)
    if not state:
        state = session_manager.get_or_create_session(session_id, req.candidate)

    if state.questions_asked == 0:
        plan = determine_next_turn(state)
        state.current_topic = plan.next_topic
        state.current_curriculum_day = plan.next_day

        question_text = generate_question(
            candidate_info=state.candidate,
            topic=plan.next_topic,
            day=plan.next_day,
            action=plan.action,
            session_id=session_id,
            asked_questions=state.asked_questions,
            probe_reason=plan.probe_reason,
        )

        state.questions_asked = 1
        state.covered_days.add(plan.next_day)
        state.asked_questions.add(question_text.strip().lower())
        state.history.append({"sender": "ai", "content": question_text})
        session_manager.save_session(state)

        cand_name = state.candidate.get("name") or state.candidate.get("member", {}).get("name") or "Candidate"
        job_role = state.candidate.get("jobRole") or state.candidate.get("member", {}).get("jobRole") or "Software Engineer"

        return InterviewResponse(
            reply=f"Welcome {cand_name}. Let's begin your technical interview for the {job_role} position. {question_text}",
            done=False,
        )

    user_message = req.message or ""
    state.history.append({"sender": "candidate", "content": user_message})

    # Find last question asked
    last_q = "Technical Engineering Topic"
    for turn in reversed(state.history[:-1]):
        if turn.get("sender") == "ai":
            last_q = turn.get("content", "")
            break

    # Evaluate candidate answer
    eval_result = evaluate_answer(
        question=last_q,
        answer=user_message,
        context=state.candidate,
    )
    eval_dict = eval_result.model_dump()
    state.evaluations.append(eval_dict)

    # Determine next turn transition
    plan = determine_next_turn(state, last_quality=eval_result.quality)

    # Check if interview is complete (minimum 8 questions AND minimum 4 curriculum days)
    if plan.action == "TERMINATE":
        feedback_res = generate_feedback(session_id, state.candidate, state.evaluations)
        state.interview_completed = True
        session_manager.save_session(state)

        cand_name = state.candidate.get("name") or state.candidate.get("member", {}).get("name") or "Candidate"
        return InterviewResponse(
            reply=f"Thank you for completing all technical evaluation questions, {cand_name}. Generating your final interview feedback report.",
            done=True,
            feedback=FeedbackModel(**feedback_res.model_dump()),
        )

    # Continue interview turn
    if plan.action != "NEW_TOPIC":
        state.follow_up_count += 1
    else:
        state.follow_up_count = 0

    state.current_topic = plan.next_topic
    state.current_curriculum_day = plan.next_day

    question_text = generate_question(
        candidate_info=state.candidate,
        topic=plan.next_topic,
        day=plan.next_day,
        action=plan.action,
        history=state.history,
        session_id=session_id,
        asked_questions=state.asked_questions,
        probe_reason=plan.probe_reason,
        last_answer=user_message,
        strongest_concept=eval_result.strongest_concept,
        missing_concept=eval_result.missing_concept,
    )

    state.questions_asked += 1
    state.covered_days.add(plan.next_day)
    state.asked_questions.add(question_text.strip().lower())
    state.history.append({"sender": "ai", "content": question_text})
    session_manager.save_session(state)

    return InterviewResponse(
        reply=question_text,
        done=False,
    )
