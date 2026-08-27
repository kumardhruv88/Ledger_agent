"""
Telemetry Logger
=================
High-level API for logging agent events.
Every agent calls log_event() at start and end of execution.
"""
import time
import json
import logging
from contextlib import contextmanager
from typing import Optional

from observability.models import (
    AgentEvent, HypothesisEvent, AdversaryEvent, SessionLocal, create_tables
)

logger = logging.getLogger(__name__)

# Initialize tables on import
try:
    create_tables()
except Exception as e:
    logger.warning(f"Could not create telemetry tables: {e}")


def log_agent_event(
    session_id: str,
    agent_name: str,
    success: bool,
    duration_ms: float,
    tokens_used: int = 0,
    input_summary: str = "",
    output_summary: str = "",
    error_message: Optional[str] = None,
) -> None:
    """Log a completed agent invocation to the telemetry database."""
    db = SessionLocal()
    try:
        event = AgentEvent(
            session_id=session_id,
            agent_name=agent_name,
            success=success,
            duration_ms=duration_ms,
            tokens_used=tokens_used,
            input_summary=input_summary[:500],    # Truncate for storage
            output_summary=output_summary[:1000],
            error_message=error_message,
        )
        db.add(event)
        db.commit()
    except Exception as e:
        logger.error(f"Telemetry log failed: {e}")
    finally:
        db.close()


def log_hypothesis_event(
    session_id: str,
    hypothesis_id: str,
    statement: str,
    columns_involved: list,
    test_selected: Optional[str],
    raw_p_value: Optional[float],
    fdr_p_value: Optional[float],
    decision: str,
    repair_count: int = 0,
) -> None:
    """Log a single hypothesis adjudication outcome."""
    db = SessionLocal()
    try:
        event = HypothesisEvent(
            session_id=session_id,
            hypothesis_id=hypothesis_id,
            statement=statement[:500],
            columns_involved=json.dumps(columns_involved),
            test_selected=test_selected,
            raw_p_value=raw_p_value,
            fdr_p_value=fdr_p_value,
            decision=decision,
            repair_count=repair_count,
        )
        db.add(event)
        db.commit()
    except Exception as e:
        logger.error(f"Hypothesis event log failed: {e}")
    finally:
        db.close()


def log_adversary_violation(
    session_id: str,
    violation_type: str,
    sentence: str,
    severity: str,
) -> None:
    """Log a Red Team critique."""
    db = SessionLocal()
    try:
        event = AdversaryEvent(
            session_id=session_id,
            violation_type=violation_type,
            sentence=sentence[:500],
            severity=severity,
        )
        db.add(event)
        db.commit()
    except Exception as e:
        logger.error(f"Adversary event log failed: {e}")
    finally:
        db.close()


@contextmanager
def timed_agent(session_id: str, agent_name: str):
    """
    Context manager for timing an agent and auto-logging its result.
    
    Usage:
        with timed_agent(session_id, "A2_PROPOSER") as ctx:
            result = do_work()
            ctx["output"] = str(result)
    """
    ctx = {"output": "", "tokens": 0, "error": None}
    start = time.perf_counter()
    try:
        yield ctx
        duration_ms = (time.perf_counter() - start) * 1000
        log_agent_event(
            session_id=session_id,
            agent_name=agent_name,
            success=True,
            duration_ms=duration_ms,
            tokens_used=ctx.get("tokens", 0),
            output_summary=ctx.get("output", ""),
        )
    except Exception as e:
        duration_ms = (time.perf_counter() - start) * 1000
        ctx["error"] = str(e)
        log_agent_event(
            session_id=session_id,
            agent_name=agent_name,
            success=False,
            duration_ms=duration_ms,
            error_message=str(e),
        )
        raise
