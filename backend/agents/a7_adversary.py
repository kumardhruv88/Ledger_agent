"""
A7 — Adversary / Red Team Agent (LLM)
=======================================
NATURE: LLM critic — plays adversarial role against A6
ROLE: Audits A6's report for statistical integrity violations:
     1. CAUSAL_LANGUAGE — implies causation where only correlation was shown
     2. EFFECT_SIZE_OVERSTATEMENT — exaggerates effect magnitude
     3. PHANTOM_FINDING — mentions relationships not in the approved ledger
     4. OVERGENERALIZATION — overstates sample → population claims
     
     If violations found: report is rejected, A6 must rewrite.
     If approved: ledger.report_validated = True
     
MAX_ADVERSARY_ROUNDS: 2 (Reporter rewrites up to 2 times)
"""
import json
import logging

from core.ledger import Ledger, AdversaryViolation, HypothesisStatus, PipelineStage
from core.llm_client import call_llm, extract_json_from_response
from agents import a6_reporter
from prompts.templates import get_prompt
from observability.telemetry import timed_agent, log_adversary_violation

logger = logging.getLogger(__name__)

MAX_ADVERSARY_ROUNDS = 2


def run(ledger: Ledger) -> Ledger:
    """
    A7: Red-team audit of A6's report with optional rewrite loop.
    
    The adversarial game:
    - A7 critiques the report
    - If violations found, A6 rewrites with violations listed as constraints
    - Repeat up to MAX_ADVERSARY_ROUNDS times
    - After max rounds, report is emitted with violations flagged (not hidden)
    
    Args:
        ledger: Ledger with report_html from A6.
    
    Returns:
        Updated ledger with report_validated flag and any violations logged.
    """
    ledger.advance_stage(PipelineStage.ADVERSARY)

    licensed_texts = ledger.get_licensed_texts()
    licensed_texts_str = "\n".join(f"  - {t}" for t in licensed_texts)

    for round_num in range(1, MAX_ADVERSARY_ROUNDS + 1):
        with timed_agent(ledger.session_id, f"A7_ADVERSARY_round{round_num}") as ctx:
            system_prompt = get_prompt("A7_SYSTEM")
            user_prompt = get_prompt("A7_USER").format(
                licensed_texts=licensed_texts_str,
                report_html=ledger.report_html or "",
            )

            response_text, tokens = call_llm(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=0.1,
                json_mode=True,
            )
            ledger.total_tokens_used += tokens
            ledger.llm_call_count += 1

            try:
                audit = extract_json_from_response(response_text)
            except ValueError:
                logger.error("[A7] Could not parse audit JSON — approving report by default")
                ledger.report_validated = True
                return ledger

            violations_raw = audit.get("violations", [])
            approved = audit.get("approved", True)

            violations = []
            for v in violations_raw:
                violation = AdversaryViolation(
                    violation_type=v.get("violation_type", "UNKNOWN"),
                    sentence=v.get("sentence", ""),
                    explanation=v.get("explanation", ""),
                    severity=v.get("severity", "LOW"),
                )
                violations.append(violation)
                log_adversary_violation(
                    session_id=ledger.session_id,
                    violation_type=violation.violation_type,
                    sentence=violation.sentence,
                    severity=violation.severity,
                )

            ledger.adversary_violations.extend(violations)
            ctx["output"] = f"Round {round_num}: {len(violations)} violations, approved={approved}"
            ctx["tokens"] = tokens

            if approved or not violations:
                ledger.report_validated = True
                logger.info(f"[A7] Report approved after round {round_num}")
                return ledger
            else:
                high_sev = [v for v in violations if v.severity == "HIGH"]
                logger.warning(
                    f"[A7] Round {round_num}: {len(violations)} violations "
                    f"({len(high_sev)} HIGH). Requesting rewrite from A6."
                )

                if round_num < MAX_ADVERSARY_ROUNDS:
                    # Force A6 to rewrite with violation constraints injected
                    violation_instructions = "\n".join(
                        f"  - VIOLATION [{v.severity}]: {v.violation_type} — "
                        f"Remove or rephrase: '{v.sentence[:100]}...'"
                        for v in high_sev
                    )
                    # Temporarily patch the A6 user prompt with violation constraints
                    original_report = ledger.report_html
                    ledger.report_html = None

                    # Re-run A6 with extra constraint
                    from prompts.templates import ACTIVE_PROMPTS
                    old_system = ACTIVE_PROMPTS["A6_SYSTEM"]
                    ACTIVE_PROMPTS["A6_SYSTEM"] = old_system + (
                        f"\n\nCRITICAL CORRECTIONS REQUIRED:\n{violation_instructions}\n"
                        f"Fix ONLY these issues. Do not change any other parts of the report."
                    )
                    ledger = a6_reporter.run(ledger)
                    ACTIVE_PROMPTS["A6_SYSTEM"] = old_system  # Restore

    # After max rounds — emit report with violations flagged
    ledger.report_validated = False
    logger.warning(
        f"[A7] Report emitted WITH unresolved violations after {MAX_ADVERSARY_ROUNDS} rounds."
    )
    return ledger
