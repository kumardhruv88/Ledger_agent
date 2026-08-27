# Ledger Agent 🔬

**A multi-agent AI data analyst that turns a CSV into statistically rigorous insights — and refuses to report the ones that statistics cannot support.**

> *LLM proposes, deterministic statistics decides. No hallucination. No p-hacking.*

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🏗️ Architecture

Ledger uses a **10-agent state machine** where a strict ordering constraint makes selective reporting structurally impossible:

```
A0 → A1 → A2 → [A3 FREEZE] → A4 ↔ A5 → A6 ↔ A7 → COMPLETE
                   ↑
        No hypotheses can be added after this point
```

| Agent | Role | Nature |
|-------|------|--------|
| A0 Janitor | Data cleaning, type coercion, domain detection | Hybrid |
| A1 Profiler | Deep statistical column profiling | **Fully Deterministic** |
| A2 Proposer | Proposes testable hypotheses (+ RAG from data dict) | LLM |
| A3 Registrar | Freezes the hypothesis registry — immutable after this | **Fully Deterministic** |
| A4 Executor | Writes Pandas code with ReAct self-repair loop | LLM |
| A5 Statistician | Auto-selects test, effect sizes, BH FDR correction | **Fully Deterministic** |
| A6 Reporter | Writes grounded prose from `licensed_text` only | LLM |
| A7 Adversary | Red-team audits report for causal/phantom violations | LLM |
| A8 Meta-Agent | **Self-improving loop** — patches prompts from telemetry | LLM |
| A9 SQL Converter | NL → SQL + Mermaid workflow diagram | LLM |
| A10 Visual Analyst | Full Plotly visualization dashboard | **Fully Deterministic** |

## ✨ Key Features

- **Zero selective reporting** — A3 freeze makes post-hoc hypothesis addition impossible
- **No causal hallucination** — A7 red-team audits every sentence before output
- **Self-improving** — A8 reads telemetry and autonomously patches agent prompts
- **RAG grounding** — Upload a data dictionary to ground A2's hypothesis proposals
- **NL → SQL + Diagram** — Convert plain English questions to SQL with visual flowcharts
- **Live visualization** — Auto-generated Plotly dashboard (distributions, heatmaps, time series)
- **Real-time streaming** — Server-Sent Events show every agent step live in the UI
- **Reproducible** — Every session produces a deterministic hash; same CSV = same hash

## 🚀 Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key for LLM inference (free tier available) |
| `GEMINI_API_KEY` | No | Gemini fallback (optional) |
| `DATABASE_URL` | No | SQLite path for telemetry (default: `./ledger_telemetry.db`) |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sessions/create` | Create analysis session |
| `POST` | `/api/sessions/{id}/upload` | Upload CSV/Excel → SSE stream |
| `GET` | `/api/sessions/{id}/report` | Get final report + dashboard |
| `POST` | `/api/sessions/{id}/sql` | NL → SQL + Mermaid flowchart |
| `POST` | `/api/sessions/{id}/chat` | Multi-turn follow-up Q&A |
| `POST` | `/api/admin/meta-agent/run` | Trigger A8 self-improvement |

## 📁 Project Structure

```
Ledger_agent/
├── backend/
│   ├── main.py                # FastAPI entry point
│   ├── core/                  # Ledger model, state machine, sandbox
│   ├── agents/                # A0–A10 agent implementations
│   ├── rag/                   # Document ingestor + retriever
│   ├── observability/         # SQLAlchemy telemetry
│   └── prompts/               # Versioned, evolvable prompt templates
├── frontend/                  # React + Vite + TailwindCSS v4
├── ARCHITECTURE.md            # Full system architecture
├── DESIGN_SYSTEM.md           # UI/UX design specifications
└── README.md
```

## 🎓 Academic Context

This is a **B.Tech Project (BTP)** implementation of a novel multi-agent data analysis framework designed to structurally prevent the most common failure modes of LLM-based data analysis:
1. The **multiple comparisons problem** (solved by A3 freeze + BH FDR)
2. **Hallucinated statistical significance** (solved by fully deterministic A5)
3. **Causal language overreach** (solved by A7 adversarial auditing)
4. **Static prompt quality** (solved by A8 self-improving loop)

## 📄 License

MIT
