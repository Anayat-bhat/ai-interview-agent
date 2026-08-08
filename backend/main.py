import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/", summary="Health check endpoint")
async def root():
    """Root endpoint verifying backend service health status."""
    return {"message": "AI Interview Agent Backend Running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
