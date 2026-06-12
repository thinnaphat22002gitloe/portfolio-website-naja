#!/usr/bin/env python3
"""Production stack smoke test (run after docker compose up)."""

import json
import sys
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"


def get(path: str) -> tuple[int, dict]:
    req = urllib.request.Request(f"{BASE}{path}")
    with urllib.request.urlopen(req, timeout=15) as response:
        return response.status, json.loads(response.read().decode("utf-8"))


def post(path: str, body: dict) -> tuple[int, dict]:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        return response.status, json.loads(response.read().decode("utf-8"))


def main() -> int:
    print("Testing production stack health ...")
    status, health = get("/api/v1/health")
    assert status == 200 and health["database"] == "ok", health

    print("Testing content with PostgreSQL ...")
    status, content = get("/api/v1/content")
    assert status == 200 and len(content["portfolio"]["projects"]) >= 6

    print("Testing admin login ...")
    status, login = post("/api/v1/admin/auth/login", {
        "email": "admin@tmrw.unlimited",
        "password": "changeme123",
    })
    assert status == 200 and login.get("accessToken")

    print("\nProduction stack smoke test passed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"\nFAILED: {exc}", file=sys.stderr)
        raise SystemExit(1)
