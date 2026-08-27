"""
RAG — Document Ingestor
========================
Parses uploaded data dictionaries or README files and stores
embeddings for retrieval by A2 (Proposer).

Uses sentence-transformers for local, free embeddings (no API cost).
Falls back to TF-IDF if sentence-transformers unavailable.
"""
import json
import logging
import re
from typing import List, Optional

logger = logging.getLogger(__name__)


def parse_document(content: str, filename: str) -> List[dict]:
    """
    Parse a documentation file into chunks for embedding.
    Supports plain text, markdown, and simple CSV data dictionaries.
    
    Returns a list of {"text": ..., "source": ...} dicts.
    """
    chunks = []
    filename_lower = filename.lower()

    # ── Handle CSV data dictionaries (column,description format) ──────────
    if filename_lower.endswith(".csv"):
        lines = content.strip().split("\n")
        for line in lines[1:]:   # Skip header
            parts = line.split(",", 2)
            if len(parts) >= 2:
                col_name = parts[0].strip()
                description = parts[1].strip() if len(parts) > 1 else ""
                if col_name and description:
                    chunks.append({
                        "text": f"Column '{col_name}': {description}",
                        "source": filename,
                        "column": col_name,
                    })
        return chunks

    # ── Handle Markdown / plain text ──────────────────────────────────────
    # Split on headers or double newlines
    raw_chunks = re.split(r'\n#{1,3}\s+|\n\n+', content)
    for chunk in raw_chunks:
        chunk = chunk.strip()
        if len(chunk) > 20:    # Skip very short chunks
            chunks.append({"text": chunk[:1000], "source": filename})

    return chunks


def build_rag_context(
    chunks: List[dict],
    query: str,
    top_k: int = 5,
) -> str:
    """
    Retrieve the most relevant chunks for a query using TF-IDF similarity.
    Returns a formatted string for injection into A2's prompt.
    """
    if not chunks:
        return ""

    # Try sentence-transformers for semantic search
    try:
        from sentence_transformers import SentenceTransformer, util
        model = SentenceTransformer("all-MiniLM-L6-v2")
        texts = [c["text"] for c in chunks]
        chunk_embeddings = model.encode(texts, convert_to_tensor=True)
        query_embedding = model.encode(query, convert_to_tensor=True)
        scores = util.cos_sim(query_embedding, chunk_embeddings)[0]
        top_indices = scores.argsort(descending=True)[:top_k].tolist()
        top_chunks = [chunks[i]["text"] for i in top_indices]
        method = "semantic (sentence-transformers)"
    except Exception:
        # Fallback: keyword-based TF-IDF style retrieval
        query_words = set(query.lower().split())
        scored = []
        for chunk in chunks:
            text_words = set(chunk["text"].lower().split())
            score = len(query_words & text_words)
            scored.append((score, chunk["text"]))
        scored.sort(reverse=True)
        top_chunks = [t for _, t in scored[:top_k]]
        method = "keyword (fallback)"

    if not top_chunks:
        return ""

    context = "\n---\n".join(top_chunks)
    logger.info(f"[RAG] Retrieved {len(top_chunks)} chunks using {method}")
    return f"RETRIEVED DATA DICTIONARY CONTEXT:\n{context}"
