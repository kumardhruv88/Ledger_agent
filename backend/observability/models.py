"""
Observability — SQLAlchemy ORM Models
=======================================
Stores telemetry for every agent action.
This data feeds the A8 Self-Improving Meta-Agent.
"""
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    Text, DateTime, create_engine
)
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "sqlite:///./ledger_telemetry.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class AgentEvent(Base):
    """One row per agent invocation."""
    __tablename__ = "agent_events"

    id            = Column(Integer, primary_key=True, index=True)
    session_id    = Column(String, index=True, nullable=False)
    agent_name    = Column(String, nullable=False)        # e.g., "A4_EXECUTOR"
    timestamp     = Column(DateTime, default=datetime.utcnow)
    success       = Column(Boolean, default=True)
    duration_ms   = Column(Float, default=0.0)
    tokens_used   = Column(Integer, default=0)
    input_summary = Column(Text, default="")              # Truncated input
    output_summary= Column(Text, default="")              # Truncated output
    error_message = Column(Text, nullable=True)


class HypothesisEvent(Base):
    """One row per hypothesis adjudication."""
    __tablename__ = "hypothesis_events"

    id              = Column(Integer, primary_key=True, index=True)
    session_id      = Column(String, index=True)
    hypothesis_id   = Column(String)                      # e.g., "H03"
    statement       = Column(Text)
    columns_involved= Column(Text)                        # JSON list
    test_selected   = Column(String, nullable=True)
    raw_p_value     = Column(Float, nullable=True)
    fdr_p_value     = Column(Float, nullable=True)
    decision        = Column(String)                      # SUPPORTED | REJECTED
    repair_count    = Column(Integer, default=0)
    timestamp       = Column(DateTime, default=datetime.utcnow)


class AdversaryEvent(Base):
    """One row per A7 critique."""
    __tablename__ = "adversary_events"

    id             = Column(Integer, primary_key=True, index=True)
    session_id     = Column(String, index=True)
    violation_type = Column(String)
    sentence       = Column(Text)
    severity       = Column(String)
    timestamp      = Column(DateTime, default=datetime.utcnow)


class PromptVersion(Base):
    """Tracks prompt template versions. A8 writes new rows here."""
    __tablename__ = "prompt_versions"

    id          = Column(Integer, primary_key=True, index=True)
    agent_name  = Column(String, index=True)
    version     = Column(Integer, default=1)
    template    = Column(Text)
    rationale   = Column(Text, default="")               # Why A8 changed this
    created_at  = Column(DateTime, default=datetime.utcnow)
    is_active   = Column(Boolean, default=True)


def create_tables():
    Base.metadata.create_all(bind=engine)
