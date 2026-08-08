"""Answer Evaluator Service.

Evaluates candidate responses across technical knowledge, communication clarity,
and engineering depth, returning structured evaluation scores and transition signals.
"""

from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class EvaluationResult(BaseModel):
    """Structured result of evaluating a candidate answer."""

    quality: str = Field(
        ...,
        description="Answer quality classification: EXCELLENT, CONCEPTUAL_CORRECT, PARTIAL, INCORRECT, or VAGUE (STRONG/WEAK supported for backwards compatibility)",
    )
    strongest_concept: str = Field(
        default="Core technical principles",
        description="Key technical concept or mechanism best demonstrated by candidate",
    )
    missing_concept: str = Field(
        default="Production trade-offs and edge cases",
        description="Weakest, omitted, or incorrect technical concept requiring probing",
    )
    knowledge_score: float = Field(..., ge=0.0, le=1.0, description="Score for technical knowledge (0-1)")
    communication_score: float = Field(..., ge=0.0, le=1.0, description="Score for communication clarity (0-1)")
    depth_score: float = Field(..., ge=0.0, le=1.0, description="Score for technical depth (0-1)")
    overall_score: float = Field(..., ge=0.0, le=1.0, description="Combined overall score (0-1)")
    feedback_notes: str = Field(..., description="Brief evaluator notes summarizing answer quality")


def extract_concepts(answer: str, question: str) -> tuple[str, str]:
    """Extract strongest demonstrated concept and weakest/missing concept from answer.

    Args:
        answer: Candidate response.
        question: Last asked question.

    Returns:
        Tuple of (strongest_concept, missing_concept).
    """
    answer_lower = answer.lower()

    # Domain concept dictionary
    concept_map = {
        "embedding": ("Vector Embeddings & High-Dimensional Representations", "Indexing algorithms & HNSW vs IVF trade-offs"),
        "vector": ("Vector Databases & Similarity Search", "High-QPS read/write sharding and index build latency"),
        "hnsw": ("HNSW Graph Indexing", "Memory footprint overhead and dynamic index updates"),
        "kafka": ("Kafka Streaming & Event Pipelines", "Consumer backpressure, partition rebalancing, and schema evolution"),
        "spark": ("Distributed Spark Processing", "Memory spills, skew handling, and executor tuning"),
        "redis": ("Distributed Redis Caching", "Cache invalidation strategies, TTL, and cache stampede prevention"),
        "grpc": ("gRPC Microservice Communication", "Protocol buffer schema evolution and HTTP/2 multiplexing"),
        "lora": ("LoRA / PEFT Parameter-Efficient Fine-Tuning", "Adapter merging, rank selection, and quantization interaction"),
        "rag": ("Retrieval-Augmented Generation (RAG)", "Context window chunking, dense vs BM25 hybrid search, and hallucination reduction"),
        "mcp": ("Model Context Protocol (MCP)", "Tool execution security, state persistence, and multi-agent coordination"),
        "docker": ("Containerization & Docker", "Zero-downtime canary rollouts and health check probes"),
        "kubernetes": ("Kubernetes Orchestration", "Pod autoscaling, resource limits, and ingress controller routing"),
        "event loop": ("Node.js Event Loop Architecture", "Worker threads for CPU-bound tasks and non-blocking I/O"),
        "concurrency": ("Concurrent System Design", "Thread safety, race conditions, and lock contention"),
        "trade-off": ("Engineering Trade-Off Analysis", "Extreme edge-case failure mode recovery"),
        "tradeoff": ("Engineering Trade-Off Analysis", "Extreme edge-case failure mode recovery"),
    }

    strongest = "Core technical fundamentals"
    missing = "Production implementation details and trade-offs"

    for term, (strong_label, miss_label) in concept_map.items():
        if term in answer_lower:
            strongest = strong_label
            missing = miss_label
            break

    # If question mentions a specific topic but candidate's answer didn't elaborate on it
    if strongest == "Core technical fundamentals":
        if "embedding" in question.lower() or "vector" in question.lower():
            strongest = "Vector embeddings and retrieval"
            missing = "Vector DB indexing algorithms (HNSW/IVF)"
        elif "kafka" in question.lower() or "stream" in question.lower():
            strongest = "Streaming data pipelines"
            missing = "Kafka backpressure & schema evolution"
        elif "fine-tuning" in question.lower() or "llm" in question.lower():
            strongest = "LLM architecture & prompting"
            missing = "Quantization and parameter-efficient fine-tuning (LoRA)"
        elif "agent" in question.lower() or "mcp" in question.lower():
            strongest = "Agentic AI workflows"
            missing = "MCP tool execution safety & state persistence"

    return strongest, missing


def evaluate_answer(
    question: str,
    answer: str,
    context: Optional[Dict[str, Any]] = None,
) -> EvaluationResult:
    """Evaluate candidate's answer, identifying strongest and missing concepts.

    Args:
        question: Technical question presented to candidate.
        answer: Candidate response text.
        context: Optional candidate metadata or topic context.

    Returns:
        EvaluationResult containing quality classification, concept breakdown, and scores.
    """
    clean_answer = answer.strip()
    word_count = len(clean_answer.split())
    answer_lower = clean_answer.lower()

    strongest_concept, missing_concept = extract_concepts(clean_answer, question)

    # Detect explicit technical misconceptions or incorrect claims
    incorrect_triggers = [
        "no need to chunk",
        "without embeddings",
        "zero latency penalty",
        "kafka doesn't have backpressure",
        "acid is for non-relational",
        "vector database doesn't need indexing",
    ]

    if any(trigger in answer_lower for trigger in incorrect_triggers):
        quality = "INCORRECT"
        k_score, c_score, d_score = 0.2, 0.5, 0.2
        missing_concept = "Underlying architectural correctness and failure mechanics"
        notes = "Answer contains an explicit technical misconception requiring clarification."

    elif word_count < 5:
        quality = "VAGUE"
        k_score, c_score, d_score = 0.3, 0.4, 0.2
        missing_concept = "Concrete technical step-by-step implementation details"
        notes = "Answer is extremely short and vague. Demands a concrete implementation example."

    elif any(term in answer_lower for term in ["depends", "trade-off", "tradeoff", "scale", "latency", "pipeline", "cluster", "index", "concurrency", "cache", "event", "backpressure", "sharding"]):
        if word_count >= 15:
            quality = "EXCELLENT"
            k_score, c_score, d_score = 0.95, 0.9, 0.95
            notes = "Demonstrates exceptional technical depth, production trade-offs, and scaling awareness."
        else:
            quality = "CONCEPTUAL_CORRECT"
            k_score, c_score, d_score = 0.85, 0.85, 0.8
            notes = "Conceptually correct response. Ready for production scaling and trade-off follow-up."

    elif word_count >= 12:
        quality = "CONCEPTUAL_CORRECT"
        k_score, c_score, d_score = 0.8, 0.85, 0.75
        notes = "Solid conceptual explanation provided. Probe for missing production trade-offs."

    elif word_count < 15:
        quality = "PARTIAL"
        k_score, c_score, d_score = 0.6, 0.7, 0.5
        notes = "Partially correct response with missing architectural components."

    else:
        quality = "PARTIAL"
        k_score, c_score, d_score = 0.7, 0.75, 0.65
        notes = "Good core answer, but lacks production scale and depth."

    overall = round((k_score + c_score + d_score) / 3.0, 2)

    return EvaluationResult(
        quality=quality,
        strongest_concept=strongest_concept,
        missing_concept=missing_concept,
        knowledge_score=k_score,
        communication_score=c_score,
        depth_score=d_score,
        overall_score=overall,
        feedback_notes=notes,
    )

