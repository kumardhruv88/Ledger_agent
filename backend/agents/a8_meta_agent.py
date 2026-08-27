"""
A8 — Meta-Agent: Self-Improving Agentic Loop
=============================================
NATURE: LLM + Telemetry Analysis
ROLE: The standout feature of Ledger.
     Analyzes telemetry from past sessions to detect systemic weaknesses
     and automatically improves prompt templates for all downstream agents.
     
     Runs as a background task. Triggered:
     - After every 10 completed sessions
     - Or manually via API endpoint
     
Self-Improvement Strategies:
     1. Prompt Evolution — fixes A4 code patterns that fail repeatedly
     2. Hypothesis Calibration — penalizes A2 for proposing high-rejection hypotheses
     3. Adversary Strengthening — feeds A7 critiques into A6 context
"""
import json
import logging
from datetime import datetime, timedelta

from sqlalchemy import func
from observability.models import (
    AgentEvent, HypothesisEvent, AdversaryEvent, PromptVersion,
    SessionLocal
)
from core.llm_client import call_llm, extract_json_from_response
from prompts.templates import update_prompt, get_prompt

logger = logging.getLogger(__name__)

A8_SYSTEM = """You are a prompt engineering meta-agent for a statistical analysis pipeline called Ledger.
Your job is to analyze failure patterns from past sessions and improve the prompt templates
for the agents that are underperforming.

You will receive:
1. A summary of agent failures and error patterns
2. Current prompt templates for failing agents
3. Examples of errors that occurred

Your task:
1. Identify the ROOT CAUSE of the failures (not surface-level)
2. Propose a MINIMAL, TARGETED change to the prompt template that would fix it
3. Explain your reasoning

Output format (JSON):
{
  "agent": "A4_EXECUTOR",
  "current_prompt_key": "A4_SYSTEM",
  "proposed_addition": "Additional rule to add to the system prompt",
  "rationale": "Why this change fixes the observed failure pattern",
  "confidence": 0.85
}

RULES:
- Only propose changes if confidence > 0.6
- Never remove existing rules, only ADD new ones
- Changes must be specific and actionable, not generic
- Max 3 sentences for proposed_addition"""


def _get_failure_summary(hours_back: int = 72) -> dict:
    """Query telemetry DB for failure patterns from the last N hours."""
    db = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=hours_back)

        # A4 failures
        a4_failures = db.query(AgentEvent).filter(
            AgentEvent.agent_name.like("A4%"),
            AgentEvent.success == False,
            AgentEvent.timestamp >= cutoff
        ).all()

        # A7 violations
        adversary_violations = db.query(AdversaryEvent).filter(
            AdversaryEvent.timestamp >= cutoff
        ).all()

        # Hypothesis rejection rates
        hypothesis_events = db.query(HypothesisEvent).filter(
            HypothesisEvent.timestamp >= cutoff
        ).all()

        total_h = len(hypothesis_events)
        rejected_h = sum(1 for h in hypothesis_events if h.decision == "REJECTED")
        rejection_rate = rejected_h / total_h if total_h > 0 else 0

        # Most common A4 errors
        error_patterns = {}
        for event in a4_failures:
            if event.error_message:
                key = event.error_message[:100]
                error_patterns[key] = error_patterns.get(key, 0) + 1

        top_errors = sorted(error_patterns.items(), key=lambda x: -x[1])[:5]

        # Most common adversary violations
        violation_types = {}
        for v in adversary_violations:
            violation_types[v.violation_type] = violation_types.get(v.violation_type, 0) + 1

        return {
            "a4_failure_count": len(a4_failures),
            "top_a4_errors": top_errors,
            "hypothesis_rejection_rate": round(rejection_rate, 3),
            "total_hypotheses": total_h,
            "adversary_violation_counts": violation_types,
            "hours_analyzed": hours_back,
        }
    finally:
        db.close()


def _save_prompt_update(agent_name: str, key: str, new_addition: str, rationale: str) -> None:
    """Persist the prompt update to the PromptVersion table."""
    db = SessionLocal()
    try:
        # Get latest version
        latest = db.query(func.max(PromptVersion.version)).filter(
            PromptVersion.agent_name == agent_name
        ).scalar() or 0

        version = PromptVersion(
            agent_name=agent_name,
            version=latest + 1,
            template=get_prompt(key) + f"\n\n# [A8 Update v{latest+1}]\n{new_addition}",
            rationale=rationale,
            is_active=True,
        )
        db.add(version)

        # Deactivate old versions
        db.query(PromptVersion).filter(
            PromptVersion.agent_name == agent_name,
            PromptVersion.version < latest + 1,
        ).update({"is_active": False})

        db.commit()
        logger.info(f"[A8] Saved prompt update v{latest+1} for {agent_name}")
    finally:
        db.close()


def run() -> dict:
    """
    A8: Analyze telemetry, identify failure patterns, improve prompt templates.
    
    Returns:
        dict with summary of improvements made.
    """
    logger.info("[A8] Meta-Agent starting self-improvement cycle...")

    summary = _get_failure_summary(hours_back=72)
    improvements_made = []

    # ── Strategy 1: Fix A4 code failures ──────────────────────────────────
    if summary["a4_failure_count"] >= 3:
        top_errors = summary["top_a4_errors"]
        if not top_errors:
            pass
        else:
            errors_text = "\n".join(
                f"  - Occurred {count}x: {err}" for err, count in top_errors
            )

            user_prompt = f"""FAILURE ANALYSIS — A4 EXECUTOR:

Total failures: {summary['a4_failure_count']}

Top error patterns:
{errors_text}

Current A4 system prompt:
{get_prompt('A4_SYSTEM')[:1500]}

Propose a minimal targeted fix to the A4 system prompt that would prevent these errors."""

            try:
                response, _ = call_llm(
                    system_prompt=A8_SYSTEM,
                    user_prompt=user_prompt,
                    temperature=0.2,
                    json_mode=True,
                )
                proposal = extract_json_from_response(response)
                if proposal.get("confidence", 0) >= 0.6:
                    new_addition = proposal.get("proposed_addition", "")
                    rationale = proposal.get("rationale", "")
                    current = get_prompt("A4_SYSTEM")
                    update_prompt("A4_SYSTEM", current + f"\n\n# [A8 Auto-Improvement]\n{new_addition}")
                    _save_prompt_update("A4_EXECUTOR", "A4_SYSTEM", new_addition, rationale)
                    improvements_made.append({
                        "agent": "A4_EXECUTOR",
                        "change": new_addition[:200],
                        "rationale": rationale[:200],
                    })
                    logger.info(f"[A8] A4 prompt improved: {new_addition[:100]}")
            except Exception as e:
                logger.error(f"[A8] Failed to improve A4 prompt: {e}")

    # ── Strategy 2: Calibrate A2 if rejection rate is too high ─────────────
    if summary["hypothesis_rejection_rate"] > 0.8 and summary["total_hypotheses"] >= 10:
        calibration = (
            f"\n\n# HIGH REJECTION RATE CALIBRATION\n"
            f"Recent sessions show a {summary['hypothesis_rejection_rate']*100:.0f}% rejection rate. "
            f"Prioritize hypotheses involving binary or low-cardinality categorical columns "
            f"against numeric outcomes. Avoid hypotheses on columns with high missingness or ID-like columns."
        )
        current = get_prompt("A2_SYSTEM")
        update_prompt("A2_SYSTEM", current + calibration)
        _save_prompt_update("A2_PROPOSER", "A2_SYSTEM", calibration, 
                           f"Rejection rate {summary['hypothesis_rejection_rate']:.2%} exceeded 80% threshold")
        improvements_made.append({
            "agent": "A2_PROPOSER",
            "change": "Calibrated to reduce high-rejection hypotheses",
            "rationale": f"Rejection rate was {summary['hypothesis_rejection_rate']:.2%}",
        })
        logger.info("[A8] A2 prompt calibrated for rejection rate")

    # ── Strategy 3: Strengthen A6 based on A7 violations ──────────────────
    violation_counts = summary.get("adversary_violation_counts", {})
    top_violation = max(violation_counts, key=violation_counts.get) if violation_counts else None
    if top_violation and violation_counts.get(top_violation, 0) >= 3:
        viol_rule = {
            "CAUSAL_LANGUAGE": (
                "NEVER use these words: causes, leads to, results in, drives, affects, influences. "
                "Always use: is associated with, correlates with, differs between."
            ),
            "EFFECT_SIZE_OVERSTATEMENT": (
                "NEVER describe a Cohen's d < 0.5 as 'strong', 'major', or 'substantial'. "
                "Use the effect size labels exactly as they appear in the licensed text."
            ),
            "PHANTOM_FINDING": (
                "You MUST include a final self-check: 'Does every claim I am making appear in the LICENSED TEXTS?' "
                "If the answer is NO for any sentence, delete that sentence."
            ),
        }.get(top_violation, "")

        if viol_rule:
            current = get_prompt("A6_SYSTEM")
            update_prompt("A6_SYSTEM", current + f"\n\n# [A8 Adversary Strengthening]\n{viol_rule}")
            _save_prompt_update("A6_REPORTER", "A6_SYSTEM", viol_rule,
                               f"Top violation '{top_violation}' occurred {violation_counts[top_violation]}x")
            improvements_made.append({
                "agent": "A6_REPORTER",
                "change": f"Added rule against {top_violation}",
                "rationale": f"Violation occurred {violation_counts[top_violation]} times",
            })
            logger.info(f"[A8] A6 prompt strengthened against {top_violation}")

    result = {
        "run_at": datetime.utcnow().isoformat(),
        "telemetry_summary": summary,
        "improvements_made": improvements_made,
        "total_improvements": len(improvements_made),
    }
    logger.info(f"[A8] Self-improvement cycle complete. {len(improvements_made)} improvements made.")
    return result
