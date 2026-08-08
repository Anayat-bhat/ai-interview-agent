from pydantic import BaseModel, Field


class InterviewResponse(BaseModel):
    """Pydantic model representing the response for an interview turn."""

    reply: str = Field(
        ...,
        description="The response reply message from the agent.",
        json_schema_extra={"example": "Hello"},
    )
    done: bool = Field(
        default=False,
        description="Flag indicating if the interview session is finished.",
        json_schema_extra={"example": False},
    )
