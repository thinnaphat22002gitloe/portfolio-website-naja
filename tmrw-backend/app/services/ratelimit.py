import time
from collections import defaultdict


class LoginRateLimiter:
    """In-memory brute-force guard: blocks a client/email pair after repeated failures."""

    def __init__(self, max_failures: int = 5, window_seconds: int = 300) -> None:
        self.max_failures = max_failures
        self.window_seconds = window_seconds
        self._failures: dict[str, list[float]] = defaultdict(list)

    def _prune(self, key: str) -> list[float]:
        cutoff = time.monotonic() - self.window_seconds
        attempts = [t for t in self._failures.get(key, []) if t > cutoff]
        self._failures[key] = attempts
        return attempts

    def is_blocked(self, key: str) -> bool:
        return len(self._prune(key)) >= self.max_failures

    def register_failure(self, key: str) -> None:
        self._prune(key).append(time.monotonic())

    def reset(self, key: str) -> None:
        self._failures.pop(key, None)


login_limiter = LoginRateLimiter()
