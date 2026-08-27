# Ledger Agent 🔬

> **A production-grade, multi-agent AI data analyst that turns a CSV into statistically rigorous, peer-review-ready insights — and structurally refuses to report findings that statistics cannot support.**

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=for-the-badge)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**[📐 Full Agentic Architecture →](./AGENTIC_ARCHITECTURE.md)** &nbsp;|&nbsp; **[🎨 Design System →](./DESIGN_SYSTEM.md)** &nbsp;|&nbsp; **[🏗️ System Architecture →](./ARCHITECTURE.md)**

</div>

---

## The Problem We Solve

Every existing "chat with your CSV" tool has the same critical flaw: the LLM sees all the data, proposes tests, runs them, and picks the significant ones to report. This is **textbook p-hacking** — the most common cause of irreproducible scientific findings.

Ledger solves this with a structural guarantee, not a prompt engineering trick:

```
The LLM proposes. Deterministic statistics decides. 
The LLM cannot see results before hypotheses are frozen.
```

This is enforced at the **data model level** — not as a rule the LLM is asked to follow.

---

## Architecture in One Diagram

```
  CSV Upload
      │
      ▼
┌─────────────┐    ┌─────────────┐
│  A0 Janitor │───▶│ A1 Profiler │  ◀── Fully Deterministic (No LLM)
└─────────────┘    └──────┬──────┘
                          │ Profile JSON (schema only, no raw data)
                          ▼
                   ┌─────────────┐    ┌──────────────┐
                   │ A2 Proposer │◀───│  RAG: Data   │  ◀── LLM + RAG
                   │    (LLM)    │    │  Dictionary  │
                   └──────┬──────┘
                          │ Hypotheses
                          ▼
                   ┌─────────────┐
                   │ A3 Registrar│  ◀── FREEZE POINT 🔒
                   │ [IMMUTABLE] │       No new hypotheses after this
                   └──────┬──────┘
                          │ Registered H01...H12
                          ▼
              ┌───────────────────────┐
              │   A4 Executor (LLM)   │  ReAct Loop: Think→Code→Run→Fix
              │   + Secure Sandbox    │  (up to 3 self-repair attempts)
              └───────────┬───────────┘
                          │ Raw data (group_a, group_b, x_values...)
                          ▼
              ┌───────────────────────┐
              │  A5 Statistician      │  ◀── Fully Deterministic
              │  - Assumption checks  │       Welch / Mann-Whitney / Chi²
              │  - Test selection     │       Cohen's d / Cramér's V
              │  - BH FDR correction  │       licensed_text generated here
              └───────────┬───────────┘
                          │ licensed_text (ONLY text A6 can use)
                          ▼
              ┌───────────────────────┐
              │   A6 Reporter (LLM)   │  Grounded — cannot cite unverified facts
              └───────────┬───────────┘
                          │ Draft report
                          ▼
              ┌───────────────────────┐
              │  A7 Adversary (LLM)   │  Red-team: finds causal language,
              │  [Red Team Agent]     │  phantom findings, effect overstatement
              └───────────┬───────────┘
                   Pass ◀─┤─▶ Fail → A6 rewrites (max 2 rounds)
                          │
                          ▼
                    ✅ FINAL REPORT
                    (HTML + Jupyter Notebook)

 ─── Parallel Agents ─────────────────────────────────────
  A10 Visual Analyst  →  Plotly dashboard (runs after A0)
  A9  SQL Converter   →  NL→SQL + Mermaid flowchart (on-demand)
  A8  Meta-Agent      →  Self-improving loop (background, scheduled)
```

---

## 📐 [Full Agentic Architecture Document →](./AGENTIC_ARCHITECTURE.md)

The architecture document covers everything a senior engineer or professor needs to understand or replicate this system:

| Section | What's Covered |
|---------|---------------|
| [Agent Deep-Dives](./AGENTIC_ARCHITECTURE.md#agent-deep-dives) | Every agent's exact inputs, outputs, prompts, and decision logic |
| [Tool Calling & Function Chains](./AGENTIC_ARCHITECTURE.md#tool-calling--function-chains) | How agents call tools and chain outputs |
| [ReAct Loop (A4)](./AGENTIC_ARCHITECTURE.md#react-reasoning--acting-loop) | Think → Code → Run → Observe → Repair with full trace |
| [RAG Architecture](./AGENTIC_ARCHITECTURE.md#rag-architecture) | Document ingestion, embedding, retrieval pipeline |
| [Multi-Agent Orchestration](./AGENTIC_ARCHITECTURE.md#multi-agent-orchestration) | SSE streaming, state machine, session management |
| [Self-Improving Loop (A8)](./AGENTIC_ARCHITECTURE.md#a8-meta-agent--self-improving-loop) | Telemetry → pattern detection → prompt patching |
| [NL → SQL Pipeline (A9)](./AGENTIC_ARCHITECTURE.md#a9-nl--sql--mermaid-flowchart) | Full query conversion with live execution |
| [Observability Pipeline](./AGENTIC_ARCHITECTURE.md#observability--telemetry-pipeline) | Every agent event logged, queried, and fed back |
| [Evaluation Framework](./AGENTIC_ARCHITECTURE.md#evaluation-framework) | NULLSET, PLANTED, REALKNOWN, REALWILD suites |
| [Security & Sandbox](./AGENTIC_ARCHITECTURE.md#security--sandbox) | Forbidden keyword scanner, thread isolation |

---

## ✨ Feature Highlights

| Feature | How It Works |
|---------|-------------|
| **Zero p-hacking** | A3 freeze makes post-hoc hypothesis addition a runtime error |
| **No causal hallucination** | A7 red-team audits every sentence — rewrites until clean |
| **Self-improving** | A8 reads failure telemetry and patches agent prompts autonomously |
| **RAG grounding** | Upload a data dictionary → A2 knows what `q3` means |
| **NL → SQL + Diagram** | "Show me top 10 customers by revenue" → SQL + Mermaid flowchart |
| **Live visualization** | A10 auto-generates Plotly distributions, heatmaps, time series |
| **Real-time streaming** | SSE stream shows every agent activating live in the UI |
| **Reproducible** | Same CSV → same hash. Different hash → warning surfaced to user |
| **Multi-turn chat** | Ask "Why did H07 fail?" — grounded answer from the ledger only |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- A [Groq API Key](https://console.groq.com) (free tier is sufficient)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Verify It's Running

```bash
curl http://localhost:8000/api/health
# {"status":"healthy","groq_configured":true,"active_sessions":0}
```

---

## 📡 API Reference

### Core Flow

```bash
# 1. Create a session
curl -X POST http://localhost:8000/api/sessions/create

# 2. Upload CSV and stream the pipeline
curl -X POST http://localhost:8000/api/sessions/{id}/upload \
  -F "file=@your_data.csv" \
  --no-buffer   # SSE stream

# 3. Get the complete report
curl http://localhost:8000/api/sessions/{id}/report
```

### All Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + config status |
| `POST` | `/api/sessions/create` | Create analysis session |
| `POST` | `/api/sessions/{id}/upload` | Upload file → SSE pipeline stream |
| `GET` | `/api/sessions/{id}/status` | Current stage + token usage |
| `GET` | `/api/sessions/{id}/report` | Full report + ledger + dashboard |
| `POST` | `/api/sessions/{id}/sql` | NL → SQL + Mermaid flowchart |
| `POST` | `/api/sessions/{id}/hypotheses` | Add user hypotheses (pre-freeze) |
| `POST` | `/api/sessions/{id}/chat` | Grounded multi-turn Q&A |
| `GET` | `/api/admin/sessions` | List all active sessions |
| `POST` | `/api/admin/meta-agent/run` | Trigger A8 self-improvement |

---

## 📁 Repository Structure

```
Ledger_agent/
│
├── 📄 README.md                      ← You are here
├── 📐 AGENTIC_ARCHITECTURE.md        ← Full architecture deep-dive
├── 🎨 DESIGN_SYSTEM.md               ← UI/UX specifications
├── 🏗️  ARCHITECTURE.md               ← System overview
│
├── backend/
│   ├── main.py                       ← FastAPI app + all routes
│   ├── requirements.txt
│   ├── .env.example                  ← Environment variable template
│   │
│   ├── core/
│   │   ├── ledger.py                 ← Central Pydantic data model
│   │   ├── state_machine.py          ← Async SSE pipeline orchestrator
│   │   ├── sandbox.py                ← Secure Python executor
│   │   ├── llm_client.py             ← Groq → Gemini fallback client
│   │   └── session_store.py          ← In-memory session registry
│   │
│   ├── agents/
│   │   ├── a0_janitor.py             ← Data cleaning + domain detection
│   │   ├── a1_profiler.py            ← Deterministic statistical profiler
│   │   ├── a2_proposer.py            ← LLM hypothesis proposer + RAG
│   │   ├── a3_registrar.py           ← Registry freeze + hash
│   │   ├── a4_executor.py            ← ReAct code executor + self-repair
│   │   ├── a5_statistician.py        ← Test selection + FDR correction
│   │   ├── a6_reporter.py            ← Grounded prose reporter
│   │   ├── a7_adversary.py           ← Red-team auditor
│   │   ├── a8_meta_agent.py          ← Self-improving loop
│   │   ├── a9_sql_converter.py       ← NL → SQL + Mermaid
│   │   └── a10_visual_analyst.py     ← Full Plotly dashboard
│   │
│   ├── rag/
│   │   └── document_ingestor.py      ← Document parsing + retrieval
│   │
│   ├── observability/
│   │   ├── models.py                 ← SQLAlchemy ORM models
│   │   └── telemetry.py              ← Context-manager event logger
│   │
│   └── prompts/
│       └── templates.py              ← Versioned, A8-evolvable prompts
│
└── frontend/
    ├── src/
    │   ├── App.jsx                   ← Root component
    │   └── index.css                 ← TailwindCSS v4 + Design System
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | **Yes** | — | Groq API key (LLM inference for A2, A4, A6, A7, A8, A9) |
| `GEMINI_API_KEY` | No | — | Gemini fallback if Groq is unavailable |
| `DATABASE_URL` | No | `sqlite:///./ledger_telemetry.db` | Telemetry database |

---

## 🧪 Evaluation Framework

Ledger is evaluated against 4 benchmark suites (see [Architecture Doc](./AGENTIC_ARCHITECTURE.md#evaluation-framework)):

| Suite | Size | What It Tests |
|-------|------|---------------|
| **NULLSET** | 200 tables of pure noise | False positive rate (correct answer = 0 findings) |
| **PLANTED** | 300 tables with known relationships | True positive rate + effect size accuracy |
| **REALKNOWN** | ~20 public datasets | Agreement with documented scientific findings |
| **REALWILD** | ~30 unseen public datasets | Expert-adjudicated real-world performance |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add X"`
4. Push and open a Pull Request

Please read [AGENTIC_ARCHITECTURE.md](./AGENTIC_ARCHITECTURE.md) before contributing to understand the agent contracts and invariants.

---

## 📄 License

MIT © 2026 [kumardhruv88](https://github.com/kumardhruv88)

---

<div align="center">

**[📐 Read the Full Architecture →](./AGENTIC_ARCHITECTURE.md)**

*Built as a B.Tech Project (BTP) — solving the multiple comparisons problem in LLM-based data analysis.*

</div>
