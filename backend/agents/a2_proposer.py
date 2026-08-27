"""
A2 — Proposer (LLM + RAG)
==========================
NATURE: LLM (Groq/Gemini) with optional RAG from data dictionary
ROLE: Reads the A1 profile and proposes testable, falsifiable hypotheses.
     Accepts user-defined natural language hypotheses as additional inputs.
     Uses RAG if a data dictionary was uploaded.
"""
import json
import logging
import time

from core.ledger import Ledger, HypothesisEntry, PipelineStage
from core.llm_client import call_llm, extract_json_from_response
from prompts.templates import get_prompt
from observability.telemetry import timed_agent

logger = logging.getLogger(__name__)

MAX_PROFILE_CHARS = 8000  # Token budget — truncate profile if too large


def _truncate_profile(profile_json: str) -> str:
    """Token optimization: trim profile if it exceeds context budget."""
    if len(profile_json) <= MAX_PROFILE_CHARS:
        return profile_json
    logger.warning("[A2] Profile truncated for token budget")
    return profile_json[:MAX_PROFILE_CHARS] + "\n... [truncated for token budget]"


def run(
    ledger: Ledger,
    user_hypotheses: list[str] | None = None,
) -> Ledger:
    """
    A2: Propose testable hypotheses from the dataset profile.
    
    Args:
        ledger: Ledger with _profile_json set by A1.
        user_hypotheses: Optional list of plain-English hypotheses from the user.
    
    Returns:
        Updated ledger with HypothesisEntry objects (not yet frozen).
    """
    with timed_agent(ledger.session_id, "A2_PROPOSER") as ctx:
        ledger.advance_stage(PipelineStage.PROPOSER)
        start = time.perf_counter()

        profile_json = getattr(ledger, "_profile_json", "{}")
        profile_trimmed = _truncate_profile(profile_json)

        # ── RAG context from uploaded data dictionary ──────────────────────
        rag_context = ""
        if ledger.dataset and ledger.dataset.rag_context:
            rag_context = f"\nDATA DICTIONARY (use this to understand column meanings):\n{ledger.dataset.rag_context}\n"

        system_prompt = get_prompt("A2_SYSTEM")
        user_prompt = get_prompt("A2_USER").format(
            profile_json=profile_trimmed,
            rag_context=rag_context,
        )

        response_text, tokens = call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.3,
            json_mode=True,
        )

        ledger.total_tokens_used += tokens
        ledger.llm_call_count += 1

        data = extract_json_from_response(response_text)
        proposed = data.get("hypotheses", [])

        # ── Add LLM-proposed hypotheses ────────────────────────────────────
        for h in proposed:
            entry = HypothesisEntry(
                id=h.get("id", f"H{len(ledger.hypotheses)+1:02d}"),
                statement=h.get("statement", ""),
                columns_involved=h.get("columns_involved", []),
                test_type_hint=h.get("test_type_hint"),
                user_defined=False,
            )
            try:
                ledger.add_hypothesis(entry)
            except ValueError as e:
                logger.warning(f"[A2] Could not add hypothesis: {e}")

        # ── Add user-defined hypotheses ────────────────────────────────────
        if user_hypotheses:
            for i, user_h in enumerate(user_hypotheses):
                entry = HypothesisEntry(
                    id=f"UH{i+1:02d}",
                    statement=user_h,
                    columns_involved=[],      # A5 will infer columns
                    user_defined=True,
                )
                try:
                    ledger.add_hypothesis(entry)
                except ValueError as e:
                    logger.warning(f"[A2] User hypothesis blocked: {e}")

        ctx["output"] = f"Proposed {len(ledger.hypotheses)} hypotheses ({tokens} tokens)"
        ctx["tokens"] = tokens
        logger.info(f"[A2] Proposed {len(ledger.hypotheses)} hypotheses in {(time.perf_counter()-start)*1000:.0f}ms")

    return ledger
