"""
LangSmith Observability Integration
=====================================
Full LangSmith tracing for every agent in the Ledger pipeline.
Provides:
- Per-agent trace with inputs/outputs
- Token usage per run
- Latency monitoring
- Error tracking with full stack traces
- Chain-of-thought visualization in LangSmith UI

Setup:
  export LANGSMITH_API_KEY=your_key
  export LANGSMITH_PROJECT=ledger-agent

Dashboard: https://smith.langchain.com
"""
import functools
import logging
import os
import time
from typing import Any, Callable, Dict, Optional

logger = logging.getLogger(__name__)

# ── LangSmith availability check ──────────────────────────────────────────────
_LANGSMITH_ENABLED = False
_client = None

def _init_langsmith():
    """Initialize LangSmith client if API key is configured."""
    global _LANGSMITH_ENABLED, _client

    api_key = os.getenv("LANGSMITH_API_KEY")
    if not api_key:
        logger.info("[LangSmith] LANGSMITH_API_KEY not set — tracing disabled")
        return

    try:
        from langsmith import Client
        _client = Client(api_key=api_key)
        project = os.getenv("LANGSMITH_PROJECT", "ledger-agent")
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_PROJECT"] = project
        _LANGSMITH_ENABLED = True
        logger.info(f"[LangSmith] ✅ Tracing enabled → project: {project}")
    except ImportError:
        logger.warning("[LangSmith] langsmith package not installed — pip install langsmith")
    except Exception as e:
        logger.warning(f"[LangSmith] Init failed: {e} — tracing disabled")


_init_langsmith()


# ── Trace decorator for agent functions ───────────────────────────────────────

def trace_agent(
    name: Optional[str] = None,
    tags: Optional[list] = None,
    metadata: Optional[dict] = None,
):
    """
    Decorator that wraps an agent function with LangSmith tracing.
    Falls back gracefully if LangSmith is not configured.
    
    Usage:
        @trace_agent(name="A4_EXECUTOR", tags=["executor", "react"])
        def run(ledger: Ledger) -> Ledger:
            ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            run_name = name or func.__name__
            start_time = time.perf_counter()

            if not _LANGSMITH_ENABLED or _client is None:
                # Passthrough — no tracing overhead
                return func(*args, **kwargs)

            try:
                from langsmith import traceable

                # Extract session_id for metadata if ledger is first arg
                extra_meta = metadata or {}
                if args and hasattr(args[0], 'session_id'):
                    extra_meta["session_id"] = args[0].session_id

                traced_func = traceable(
                    run_type="chain",
                    name=run_name,
                    tags=tags or ["ledger-agent"],
                    metadata=extra_meta,
                )(func)
                result = traced_func(*args, **kwargs)
                duration = (time.perf_counter() - start_time) * 1000
                logger.info(f"[LangSmith] {run_name} traced ({duration:.0f}ms)")
                return result
            except Exception as e:
                logger.warning(f"[LangSmith] Tracing failed for {run_name}: {e} — running without trace")
                return func(*args, **kwargs)

        return wrapper
    return decorator


def trace_llm_call(
    agent_name: str,
    prompt: str,
    response: str,
    tokens: int,
    latency_ms: float,
    session_id: str,
    model: str = "groq/llama-3.3-70b-versatile",
):
    """
    Log an individual LLM call to LangSmith as an LLM run.
    Called from llm_client.py after every call_llm() invocation.
    """
    if not _LANGSMITH_ENABLED or _client is None:
        return

    try:
        import uuid
        from datetime import datetime, timezone

        run_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        _client.create_run(
            id=run_id,
            name=f"{agent_name}_llm_call",
            run_type="llm",
            inputs={"prompt": prompt[:2000]},   # Truncate for UI readability
            outputs={"response": response[:2000]},
            start_time=now,
            end_time=now,
            extra={
                "session_id": session_id,
                "tokens_used": tokens,
                "latency_ms": round(latency_ms, 2),
                "model": model,
            },
            tags=[agent_name, "llm", model],
        )
    except Exception as e:
        logger.debug(f"[LangSmith] LLM trace failed: {e}")


def create_evaluation_dataset(
    dataset_name: str,
    examples: list,
) -> Optional[str]:
    """
    Create a LangSmith evaluation dataset for benchmarking.
    Each example: {"inputs": {...}, "outputs": {"expected": ...}}
    Returns dataset_id or None if LangSmith unavailable.
    """
    if not _LANGSMITH_ENABLED or _client is None:
        logger.warning("[LangSmith] Cannot create dataset — LangSmith not configured")
        return None

    try:
        dataset = _client.create_dataset(dataset_name=dataset_name)
        _client.create_examples(
            inputs=[e["inputs"] for e in examples],
            outputs=[e.get("outputs", {}) for e in examples],
            dataset_id=dataset.id,
        )
        logger.info(f"[LangSmith] Dataset '{dataset_name}' created with {len(examples)} examples")
        return str(dataset.id)
    except Exception as e:
        logger.error(f"[LangSmith] Dataset creation failed: {e}")
        return None


def log_evaluation_result(
    run_id: str,
    score: float,
    key: str = "accuracy",
    comment: str = "",
):
    """Log an evaluation score against a LangSmith run."""
    if not _LANGSMITH_ENABLED or _client is None:
        return

    try:
        _client.create_feedback(
            run_id=run_id,
            key=key,
            score=score,
            comment=comment,
        )
    except Exception as e:
        logger.debug(f"[LangSmith] Feedback logging failed: {e}")


def is_enabled() -> bool:
    return _LANGSMITH_ENABLED


def get_project_url() -> str:
    project = os.getenv("LANGSMITH_PROJECT", "ledger-agent")
    return f"https://smith.langchain.com/projects/{project}"
