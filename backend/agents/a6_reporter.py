"""
A6 — Reporter (LLM, Grounded)
===============================
NATURE: LLM, but strictly constrained to licensed_text fields
ROLE: Writes the final human-readable HTML report.
     Can ONLY cite text from StatisticalResult.licensed_text fields.
     Any unbacked claim is structurally impossible (A7 will catch it).
"""
import logging

from core.ledger import Ledger, HypothesisStatus, PipelineStage
from core.llm_client import call_llm
from prompts.templates import get_prompt
from observability.telemetry import timed_agent

logger = logging.getLogger(__name__)


def run(ledger: Ledger) -> Ledger:
    """
    A6: Generate the final HTML report using only licensed_text from A5.
    
    Args:
        ledger: Ledger with all hypotheses adjudicated by A5.
    
    Returns:
        Updated ledger with report_html set.
    """
    with timed_agent(ledger.session_id, "A6_REPORTER") as ctx:
        ledger.advance_stage(PipelineStage.REPORTER)

        licensed_texts = ledger.get_licensed_texts()
        rejected = [
            h.statement for h in ledger.hypotheses
            if h.status == HypothesisStatus.REJECTED
        ]

        if not licensed_texts and not rejected:
            ledger.report_html = "<p>No hypotheses were tested. Please upload a dataset and try again.</p>"
            return ledger

        system_prompt = get_prompt("A6_SYSTEM")
        user_prompt = get_prompt("A6_USER").format(
            filename=ledger.dataset.filename if ledger.dataset else "Unknown",
            n_rows=ledger.dataset.n_rows if ledger.dataset else 0,
            n_cols=ledger.dataset.n_cols if ledger.dataset else 0,
            session_id=ledger.session_id,
            repro_hash=ledger.compute_final_hash(),
            licensed_texts="\n".join(f"  - {t}" for t in licensed_texts),
            rejected_statements="\n".join(f"  - {s}" for s in rejected),
        )

        report_html, tokens = call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.4,
            max_tokens=3000,
        )

        ledger.total_tokens_used += tokens
        ledger.llm_call_count += 1
        ledger.report_html = report_html

        ctx["output"] = f"Report generated ({len(report_html)} chars, {tokens} tokens)"
        ctx["tokens"] = tokens
        logger.info(f"[A6] Report generated: {len(report_html)} chars")

    return ledger
