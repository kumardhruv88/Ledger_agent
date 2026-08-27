"""
A3 — Registrar (Fully Deterministic)
======================================
NATURE: 100% deterministic — no LLM
ROLE: Freezes the hypothesis registry.
     After A3 runs, no new hypotheses can be added.
     Computes a reproducibility hash of all registered hypotheses.
     This is the structural guarantee against selective reporting.
     
THE KEY INVARIANT: A3 must complete BEFORE A4 starts.
"""
import logging
from datetime import datetime

from core.ledger import Ledger, PipelineStage, HypothesisStatus
from observability.telemetry import timed_agent

logger = logging.getLogger(__name__)


def run(ledger: Ledger) -> Ledger:
    """
    A3: Freeze the hypothesis registry and stamp each hypothesis with a timestamp.
    
    Args:
        ledger: Ledger with proposed hypotheses from A2.
    
    Returns:
        Updated ledger with is_frozen=True and registry_hash set.
    
    Raises:
        ValueError: If no hypotheses have been proposed.
    """
    with timed_agent(ledger.session_id, "A3_REGISTRAR") as ctx:
        ledger.advance_stage(PipelineStage.REGISTRAR)

        if not ledger.hypotheses:
            raise ValueError(
                "[A3] Cannot freeze an empty registry. A2 must propose at least one hypothesis."
            )

        # Stamp each hypothesis with registration timestamp
        now = datetime.utcnow()
        for hypothesis in ledger.hypotheses:
            hypothesis.registered_at = now

        # FREEZE — after this, add_hypothesis() will raise
        registry_hash = ledger.freeze()

        ctx["output"] = (
            f"Frozen {len(ledger.hypotheses)} hypotheses. "
            f"Registry hash: {registry_hash}"
        )

        logger.info(
            f"[A3] LEDGER FROZEN — {len(ledger.hypotheses)} hypotheses registered. "
            f"Hash: {registry_hash}"
        )

    return ledger
