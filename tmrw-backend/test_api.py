#!/usr/bin/env python3
"""Simple integration tests for TMRW UNLIMIT API."""

import json
import sys
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"


def request(method: str, path: str, body: dict | None = None) -> tuple[int, dict | list | str]:
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(f"{BASE}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            payload = raw
        return exc.code, payload


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    print("Testing GET /api/v1/health ...")
    status, health = request("GET", "/api/v1/health")
    assert_true(status == 200, f"health status={status}")
    assert_true(health["status"] == "ok", "health status not ok")
    assert_true(health["database"] == "ok", "database not ok")
    print("  OK")

    print("Testing GET /api/v1/content ...")
    status, content = request("GET", "/api/v1/content")
    assert_true(status == 200, f"content status={status}")
    assert_true(len(content["portfolio"]["projects"]) == 6, "expected 6 projects")
    assert_true(len(content["services"]["items"]) == 5, "expected 5 services")
    print("  OK")

    print("Testing GET /api/v1/projects ...")
    status, projects = request("GET", "/api/v1/projects")
    assert_true(status == 200, f"projects status={status}")
    assert_true(len(projects) == 6, "expected 6 projects in list")
    print("  OK")

    slug = projects[0]["slug"]
    print(f"Testing GET /api/v1/projects/{slug} ...")
    status, project = request("GET", f"/api/v1/projects/{slug}")
    assert_true(status == 200, f"project detail status={status}")
    assert_true(project["slug"] == slug, "slug mismatch")
    print("  OK")

    print("Testing POST /api/v1/contact ...")
    payload = {
        "firstName": "Test",
        "lastName": "User",
        "email": "test@example.com",
        "company": "TMRW QA",
        "service": "web",
        "message": "Integration test message from Phase 1 script.",
    }
    status, contact = request("POST", "/api/v1/contact", payload)
    assert_true(status == 201, f"contact status={status}")
    assert_true(contact["success"] is True, "contact success flag missing")
    assert_true(isinstance(contact["id"], int), "contact id missing")
    print("  OK")

    print("\nAll Phase 1 API tests passed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"\nFAILED: {exc}", file=sys.stderr)
        raise SystemExit(1)
