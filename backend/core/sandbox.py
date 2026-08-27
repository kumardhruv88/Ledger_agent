"""
Secure Python Sandbox for A4 Executor
======================================
Executes LLM-generated Pandas code in a restricted, time-limited environment.
Returns stdout, stderr, and any extracted data variables.
"""
import io
import sys
import traceback
import signal
import threading
from typing import Any, Dict, Optional, Tuple


# ─── Restricted builtins ──────────────────────────────────────────────────────

_SAFE_BUILTINS = {
    "abs": abs, "all": all, "any": any, "bin": bin, "bool": bool,
    "bytes": bytes, "callable": callable, "chr": chr, "complex": complex,
    "dict": dict, "dir": dir, "divmod": divmod, "enumerate": enumerate,
    "filter": filter, "float": float, "format": format, "frozenset": frozenset,
    "getattr": getattr, "hasattr": hasattr, "hash": hash, "hex": hex,
    "id": id, "input": None, "int": int, "isinstance": isinstance,
    "issubclass": issubclass, "iter": iter, "len": len, "list": list,
    "locals": locals, "map": map, "max": max, "min": min, "next": next,
    "object": object, "oct": oct, "ord": ord, "pow": pow, "print": print,
    "property": property, "range": range, "repr": repr, "reversed": reversed,
    "round": round, "set": set, "setattr": None, "slice": slice,
    "sorted": sorted, "staticmethod": staticmethod, "str": str, "sum": sum,
    "super": super, "tuple": tuple, "type": type, "vars": vars, "zip": zip,
    "__build_class__": __build_class__, "__name__": "__main__",
    "__import__": None,  # Blocked — use pre-imported modules only
}

_FORBIDDEN_KEYWORDS = [
    "import os", "import sys", "import subprocess", "import socket",
    "import shutil", "open(", "exec(", "eval(", "__import__",
    "os.system", "os.popen", "subprocess.run", "subprocess.Popen",
    "socket.connect", "urllib", "requests.get", "requests.post",
]


class SandboxResult:
    def __init__(
        self,
        success: bool,
        stdout: str,
        stderr: str,
        extracted_data: Optional[Dict[str, Any]] = None,
        execution_time_ms: float = 0.0,
    ):
        self.success = success
        self.stdout = stdout
        self.stderr = stderr
        self.extracted_data = extracted_data or {}
        self.execution_time_ms = execution_time_ms

    def to_dict(self) -> Dict:
        return {
            "success": self.success,
            "stdout": self.stdout,
            "stderr": self.stderr,
            "extracted_data": self.extracted_data,
            "execution_time_ms": self.execution_time_ms,
        }


class ExecutionTimeoutError(Exception):
    pass


class ForbiddenCodeError(Exception):
    pass


def _security_check(code: str) -> None:
    """Pre-execution static analysis. Raises ForbiddenCodeError if unsafe patterns found."""
    for pattern in _FORBIDDEN_KEYWORDS:
        if pattern in code:
            raise ForbiddenCodeError(
                f"Security violation: forbidden pattern '{pattern}' detected in generated code."
            )


def run_sandboxed(
    code: str,
    df_context: Dict[str, Any],
    timeout_seconds: int = 30,
    extract_vars: Optional[list] = None,
) -> SandboxResult:
    """
    Execute code in a restricted namespace with a DataFrame context.
    
    Args:
        code: Python code string to execute.
        df_context: Dict of variables to inject (e.g., {"df": dataframe}).
        timeout_seconds: Maximum allowed execution time.
        extract_vars: Variable names to extract after execution.
    
    Returns:
        SandboxResult with success flag, stdout/stderr, and extracted variables.
    """
    import time
    import pandas as pd
    import numpy as np

    # Security pre-check
    try:
        _security_check(code)
    except ForbiddenCodeError as e:
        return SandboxResult(
            success=False,
            stdout="",
            stderr=str(e),
        )

    # Build restricted global namespace with safe libraries
    exec_globals = {
        "__builtins__": _SAFE_BUILTINS,
        "pd": pd,
        "np": np,
    }
    exec_globals.update(df_context)

    # Capture stdout
    old_stdout = sys.stdout
    sys.stdout = captured_stdout = io.StringIO()

    result_container = {"result": None, "error": None, "locals": {}}
    exec_locals = {}

    def _run():
        try:
            exec(compile(code, "<sandbox>", "exec"), exec_globals, exec_locals)
            result_container["locals"] = exec_locals
        except Exception as e:
            result_container["error"] = traceback.format_exc()

    start_time = time.time()
    thread = threading.Thread(target=_run, daemon=True)
    thread.start()
    thread.join(timeout=timeout_seconds)
    elapsed_ms = (time.time() - start_time) * 1000

    # Restore stdout
    sys.stdout = old_stdout
    stdout_val = captured_stdout.getvalue()

    if thread.is_alive():
        return SandboxResult(
            success=False,
            stdout=stdout_val,
            stderr=f"ExecutionTimeoutError: Code exceeded {timeout_seconds}s timeout.",
            execution_time_ms=elapsed_ms,
        )

    if result_container["error"]:
        return SandboxResult(
            success=False,
            stdout=stdout_val,
            stderr=result_container["error"],
            execution_time_ms=elapsed_ms,
        )

    # Extract requested variables
    extracted = {}
    if extract_vars:
        for var in extract_vars:
            if var in result_container["locals"]:
                val = result_container["locals"][var]
                # Serialize to JSON-safe types
                if hasattr(val, "to_dict"):
                    extracted[var] = val.to_dict()
                elif hasattr(val, "tolist"):
                    extracted[var] = val.tolist()
                else:
                    try:
                        import json
                        json.dumps(val)
                        extracted[var] = val
                    except (TypeError, ValueError):
                        extracted[var] = str(val)

    return SandboxResult(
        success=True,
        stdout=stdout_val,
        stderr="",
        extracted_data=extracted,
        execution_time_ms=elapsed_ms,
    )
