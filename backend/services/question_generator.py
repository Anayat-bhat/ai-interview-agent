"""Question Generator Service.

Generates tailored technical questions using candidate profile metadata,
assigned curriculum topics, and planner transition actions.
"""

from typing import Any, Dict, List, Optional
from services import llm


ROLE_TOPIC_QUESTIONS: Dict[str, Dict[str, List[str]]] = {
    "Senior Data Engineer": {
        "Embeddings & Vector Search": [
            "Explain how vector embeddings are generated, stored in vector databases (e.g. Pinecone/Chroma), and indexed for fast similarity search.",
            "How do you handle high-throughput streaming backpressure and schema evolution in Kafka / Spark data pipelines?",
            "What architecture would you propose for a hybrid retrieval engine combining BM25 keyword search with dense vector embeddings?",
        ],
        "LLM Core, Prompting & Fine-Tuning": [
            "How do you design prompt templates and structured output schemas to prevent model hallucinations in automated data pipelines?",
            "When would you choose LoRA/PEFT parameter-efficient fine-tuning over in-context retrieval augmented generation (RAG)?",
        ],
        "Agentic AI & MCP": [
            "Explain how autonomous agent workflows coordinate tool calls using Model Context Protocol (MCP) servers.",
            "What patterns do you implement to ensure idempotency and fault tolerance in multi-agent orchestration pipelines?",
        ],
        "Production & Capstone": [
            "How do you configure distributed telemetry, logging, and performance benchmarks for high-concurrency production deployments?",
        ],
    },
    "AI Engineer": {
        "Embeddings & Vector Search": [
            "Compare HNSW and IVF indexing algorithms in vector databases for low-latency similarity retrieval under high QPS.",
            "How do you optimize embedding context windows and chunking strategies for multi-document retrieval?",
        ],
        "LLM Core, Prompting & Fine-Tuning": [
            "Explain the end-to-end RAG architecture and context window management strategies to minimize hallucination risks.",
            "How do quantization techniques (e.g., AWQ, GGUF) impact LLM inference latency and memory footprint?",
        ],
        "Agentic AI & MCP": [
            "Explain how to coordinate multi-agent system loops with structured function calling and stateful memory persistence.",
            "How do you safeguard LLM tool execution against prompt injection and malicious payload inputs?",
        ],
        "Production & Capstone": [
            "How do you evaluate and monitor LLM application drift, accuracy, and toxicity in live production systems?",
        ],
    },
    "Backend Software Engineer": {
        "Environment & Tooling": [
            "Explain the phases of the Node.js event loop and how worker threads handle CPU-bound workloads in high-concurrency web services.",
            "How do you structure microservices communication using gRPC, REST, and distributed Redis caching?",
        ],
        "Embeddings & Vector Search": [
            "How do you design low-latency caching strategies for frequent database queries under heavy read loads?",
            "Compare ACID transaction isolation levels in distributed relational databases under heavy write contention.",
        ],
        "LLM Core, Prompting & Fine-Tuning": [
            "Discuss best practices for async data fetching, error boundaries, and connection pooling in high-throughput API services.",
        ],
        "Production & Capstone": [
            "How do you implement zero-downtime blue/green deployments and canary rollouts using Docker and Kubernetes?",
        ],
    },
}


def generate_question(
    candidate_info: Dict[str, Any],
    topic: str,
    day: int = 1,
    action: str = "NEW_TOPIC",  # NEW_TOPIC, FOLLOW_UP, CLARIFICATION, DEEPER_DEPTH, TRADEOFFS_SCALING, PROBE_MISSING, MISCONCEPTION_CLARIFY, CONCRETE_EXAMPLE
    history: Optional[List[Dict[str, Any]]] = None,
    session_id: Optional[str] = None,
    asked_questions: Optional[Set[str]] = None,
    probe_reason: Optional[str] = None,
    last_answer: Optional[str] = None,
    strongest_concept: Optional[str] = None,
    missing_concept: Optional[str] = None,
) -> str:
    """Generate a context-aware technical question referencing the candidate's actual answer.

    Adheres strictly to Senior Technical Interviewer persona:
    professional, concise, curious, challenging, and context-aware.

    Args:
        candidate_info: Candidate profile metadata.
        topic: Technical curriculum topic.
        day: Curriculum day.
        action: Planner transition action.
        history: Turn history.
        session_id: Session identifier.
        asked_questions: Set of previously asked questions for duplicate prevention.
        probe_reason: Specific probe reason.
        last_answer: Candidate's previous answer text.
        strongest_concept: Strongest technical concept demonstrated.
        missing_concept: Weakest or omitted technical concept.

    Returns:
        Generated context-aware question as a string.
    """
    if asked_questions is None:
        asked_questions = set()

    # Collect asked questions from history if provided
    if history:
        for turn in history:
            if turn.get("sender") == "ai":
                asked_questions.add(turn.get("content", "").strip().lower())

    # Default concept fallbacks if unspecified
    strong_lbl = strongest_concept or "your proposed approach"
    miss_lbl = missing_concept or "production trade-offs and failure handling"

    # Extract short snippet from last answer for direct referencing
    last_ans_snippet = ""
    if last_answer and len(last_answer.strip()) > 0:
        words = last_answer.strip().split()
        last_ans_snippet = " ".join(words[:12]) + ("..." if len(words) > 12 else "")

    # 1. Attempt delegated call to LLM abstraction
    context: Dict[str, Any] = {
        "candidate": candidate_info,
        "topic": topic,
        "day": day,
        "action": action,
        "probe_reason": probe_reason,
        "last_answer": last_answer,
        "strongest_concept": strong_lbl,
        "missing_concept": miss_lbl,
    }

    try:
        response = llm.generate(
            session_id=session_id or "session_default",
            context=context,
            message_history=history,
        )
        if response and response.reply:
            candidate_reply = response.reply.strip()
            if candidate_reply.lower() not in asked_questions:
                return candidate_reply
    except NotImplementedError:
        pass  # Provider integration is deferred; execute contextual fallback below

    # 2. Candidate profile context
    job_role = candidate_info.get("jobRole") or candidate_info.get("member", {}).get("jobRole") or "Senior Data Engineer"
    years_exp = candidate_info.get("yearsExperience") or candidate_info.get("member", {}).get("yearsExperience") or 5

    # Match role question bank or fallback to default
    matched_role = "Senior Data Engineer"
    for role_key in ROLE_TOPIC_QUESTIONS:
        if role_key.lower() in job_role.lower():
            matched_role = role_key
            break

    role_dict = ROLE_TOPIC_QUESTIONS[matched_role]
    topic_questions = role_dict.get(topic) or next(iter(role_dict.values()))

    # 3. Formulate Context-Aware Senior Technical Interviewer Question
    selected_question = None

    if probe_reason and "skipped" in probe_reason.lower():
        prefix = f"Regarding Day {day} ({topic}), which was skipped in your profile: "
        for q in topic_questions:
            candidate_q = f"{prefix}{q}"
            if candidate_q.lower() not in asked_questions:
                selected_question = candidate_q
                break
        if not selected_question:
            selected_question = f"{prefix}Explain the foundational principles and component architecture of {topic}."

    elif probe_reason and "attempts" in probe_reason.lower():
        prefix = f"Looking at your experience on Day {day} ({topic}): "
        for q in topic_questions:
            candidate_q = f"{prefix}{q}"
            if candidate_q.lower() not in asked_questions:
                selected_question = candidate_q
                break
        if not selected_question:
            selected_question = f"{prefix}How would you approach debugging performance bottlenecks and failure modes?"

    elif action == "DEEPER_DEPTH":
        deep_variations = [
            f"You gave a solid breakdown of {strong_lbl}. Taking this to senior engineering depth: how do you manage cascading failure recovery and state consistency when {topic} encounters network partitioning under peak QPS?",
            f"Building directly on your explanation of {strong_lbl}: what specific memory layout, caching strategy, or low-level concurrency locks would you configure for high-throughput production workloads?",
            f"Your points on {strong_lbl} are well taken. In a distributed multi-region deployment of {topic}, how do you resolve split-brain scenarios and data replication lag?",
        ]
        for q in deep_variations:
            if q.lower() not in asked_questions:
                selected_question = q
                break

    elif action in ("TRADEOFFS_SCALING", "FOLLOW_UP"):
        tradeoff_variations = [
            f"You outlined {strong_lbl} clearly. From a production trade-off perspective, what are the primary latency and memory penalties of this approach compared to alternative architectures under scale?",
            f"Regarding your response on {strong_lbl}: What specific telemetry metrics and alert thresholds would you monitor in production to detect degradation before SLA breach?",
            f"You mentioned {strong_lbl}. How does that implementation behave under heavy consumer backpressure and schema evolution?",
        ]
        for q in tradeoff_variations:
            if q.lower() not in asked_questions:
                selected_question = q
                break

    elif action == "PROBE_MISSING":
        missing_variations = [
            f"You hit the core concepts of {strong_lbl}, but didn't touch on {miss_lbl}. How specifically would you address {miss_lbl} in this architecture?",
            f"Regarding your explanation of {strong_lbl}: how does your design handle {miss_lbl} under high write contention?",
            f"You covered the main workflow well, but how do you guard against {miss_lbl} during production deployments?",
        ]
        for q in missing_variations:
            if q.lower() not in asked_questions:
                selected_question = q
                break

    elif action == "MISCONCEPTION_CLARIFY":
        snippet_ref = f"'{last_ans_snippet}'" if last_ans_snippet else "your previous statement"
        clarify_misconception_variations = [
            f"In your previous answer, you mentioned {snippet_ref}. In a production {topic} pipeline, how does that assumption hold up under failure modes?",
            f"To clarify your point on {strong_lbl}: how does your proposed mechanism avoid data loss or race conditions when scaling out?",
            f"Regarding your answer on {topic}: what underlying trade-offs make that design vulnerable during system failovers?",
        ]
        for q in clarify_misconception_variations:
            if q.lower() not in asked_questions:
                selected_question = q
                break

    elif action in ("CONCRETE_EXAMPLE", "CLARIFICATION"):
        concrete_variations = [
            f"That summary of {topic} remains high-level. Walk me through a concrete implementation step-by-step: what exact data structures, API contracts, or pipeline stages do you build?",
            f"To make your answer on {topic} concrete: give me a specific real-world code or architecture example demonstrating how you handle error recovery.",
            f"Could you ground your explanation of {topic} with specific technical implementation steps and edge-case handling?",
        ]
        for q in concrete_variations:
            if q.lower() not in asked_questions:
                selected_question = q
                break

    if not selected_question:
        # Default NEW_TOPIC selection
        for q in topic_questions:
            candidate_q = f"Question (Day {day} - {topic}): {q}"
            if candidate_q.lower() not in asked_questions:
                selected_question = candidate_q
                break

        if not selected_question:
            base_q = topic_questions[0] if topic_questions else f"Explain core engineering principles of {topic}."
            selected_question = f"Question (Day {day} - {topic}): {base_q}"

    # 4. Strict duplicate fallback check
    if selected_question.lower() in asked_questions:
        unique_suffix = f" (Focusing on senior {job_role} architecture - Depth Variant {len(asked_questions) + 1})"
        selected_question = f"{selected_question}{unique_suffix}"

    return selected_question


