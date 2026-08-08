from fastapi import APIRouter, status

from app.models.interview import InterviewResponse

router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit interview message",
    description="Endpoint for handling candidate interview turns and returning agent replies.",
)
async def handle_interview_turn() -> InterviewResponse:
    """Initial endpoint for interview turns."""
    return InterviewResponse(reply="Hello", done=False)
