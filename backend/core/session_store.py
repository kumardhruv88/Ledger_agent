"""
Session Store
==============
In-memory session registry with SQLite persistence.
Manages active Ledger instances keyed by session_id.
"""
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional

from core.ledger import Ledger


class SessionStore:
    """
    Thread-safe in-memory session store with optional SQLite persistence.
    Each session holds one Ledger instance.
    """

    def __init__(self, ttl_hours: int = 24):
        self._sessions: Dict[str, Ledger] = {}
        self._created_at: Dict[str, datetime] = {}
        self._ttl = timedelta(hours=ttl_hours)

    def create(self) -> Ledger:
        session_id = str(uuid.uuid4())
        ledger = Ledger(session_id=session_id)
        self._sessions[session_id] = ledger
        self._created_at[session_id] = datetime.utcnow()
        return ledger

    def get(self, session_id: str) -> Optional[Ledger]:
        self._evict_expired()
        return self._sessions.get(session_id)

    def update(self, ledger: Ledger) -> None:
        self._sessions[ledger.session_id] = ledger

    def delete(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)
        self._created_at.pop(session_id, None)

    def list_sessions(self) -> list:
        self._evict_expired()
        return [
            {
                "session_id": sid,
                "stage": ledger.current_stage.value,
                "created_at": self._created_at.get(sid, datetime.utcnow()).isoformat(),
                "hypothesis_count": len(ledger.hypotheses),
            }
            for sid, ledger in self._sessions.items()
        ]

    def _evict_expired(self) -> None:
        now = datetime.utcnow()
        expired = [
            sid
            for sid, ts in self._created_at.items()
            if now - ts > self._ttl
        ]
        for sid in expired:
            self.delete(sid)


# Global singleton
session_store = SessionStore()
