"""
LLM Client — Unified interface for Groq and Gemini
====================================================
Provides a single call_llm() function with:
- Token counting and logging
- Automatic fallback: Groq → Gemini
- Retry logic with exponential backoff
- Chain-of-thought extraction
"""
import os
import time
import json
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)


def call_llm(
    system_prompt: str,
    user_prompt: str,
    model: str = "groq",           # "groq" | "gemini"
    temperature: float = 0.2,
    max_tokens: int = 4096,
    json_mode: bool = False,
    extract_thinking: bool = False,
    retries: int = 3,
) -> Tuple[str, int]:
    """
    Unified LLM caller.
    Returns: (response_text, tokens_used)
    """
    groq_key = os.getenv("GROQ_API_KEY", "")
    gemini_key = os.getenv("GEMINI_API_KEY", "")

    # ── Try Groq first ────────────────────────────────────────────────────────
    if model == "groq" and groq_key:
        for attempt in range(retries):
            try:
                from groq import Groq
                client = Groq(api_key=groq_key)
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": user_prompt},
                ]
                kwargs = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                if json_mode:
                    kwargs["response_format"] = {"type": "json_object"}

                response = client.chat.completions.create(**kwargs)
                text = response.choices[0].message.content or ""
                tokens = response.usage.total_tokens if response.usage else 0
                logger.info(f"[Groq] tokens={tokens}")
                return text.strip(), tokens

            except Exception as e:
                logger.warning(f"[Groq] attempt {attempt+1} failed: {e}")
                time.sleep(2 ** attempt)

    # ── Fallback to Gemini ────────────────────────────────────────────────────
    if gemini_key:
        for attempt in range(retries):
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                gmodel = genai.GenerativeModel("gemini-1.5-flash")
                full_prompt = f"{system_prompt}\n\n{user_prompt}"
                resp = gmodel.generate_content(full_prompt)
                text = resp.text or ""
                # Gemini doesn't always give token count in free tier
                tokens = len(full_prompt.split()) + len(text.split())
                logger.info(f"[Gemini] approx_tokens={tokens}")
                return text.strip(), tokens
            except Exception as e:
                logger.warning(f"[Gemini] attempt {attempt+1} failed: {e}")
                time.sleep(2 ** attempt)

    # ── No LLM available — raise clear error ─────────────────────────────────
    raise RuntimeError(
        "No LLM available. Please set GROQ_API_KEY or GEMINI_API_KEY in your .env file."
    )


def extract_json_from_response(text: str) -> dict:
    """Robustly extract JSON from LLM response, even with markdown fences."""
    # Strip markdown code fences if present
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0]
    elif "```" in text:
        text = text.split("```")[1].split("```")[0]
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse failed: {e}\nRaw text: {text[:500]}")
        raise ValueError(f"LLM returned invalid JSON: {e}")
