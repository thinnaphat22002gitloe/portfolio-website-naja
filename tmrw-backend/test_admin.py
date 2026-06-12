#!/usr/bin/env python3
"""Phase 2 admin API integration tests."""

import json
import sys
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"
ADMIN_EMAIL = "admin@tmrw.unlimited"
ADMIN_PASSWORD = "changeme123"


def request(method: str, path: str, body: dict | None = None, token: str | None = None) -> tuple[int, dict | list | str]:
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"

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
    print("Testing POST /api/v1/admin/auth/login ...")
    status, login = request("POST", "/api/v1/admin/auth/login", {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
    })
    assert_true(status == 200, f"login status={status} body={login}")
    token = login["accessToken"]
    print("  OK")

    print("Testing GET /api/v1/admin/me ...")
    status, me = request("GET", "/api/v1/admin/me", token=token)
    assert_true(status == 200 and me["email"] == ADMIN_EMAIL, "admin me failed")
    print("  OK")

    print("Testing GET /api/v1/admin/dashboard ...")
    status, dashboard = request("GET", "/api/v1/admin/dashboard", token=token)
    assert_true(status == 200 and dashboard["projectsTotal"] >= 6, "dashboard failed")
    print("  OK")

    print("Testing GET /api/v1/admin/projects ...")
    status, projects = request("GET", "/api/v1/admin/projects", token=token)
    assert_true(status == 200 and len(projects) >= 6, "admin projects failed")
    print("  OK")

    print("Testing PATCH /api/v1/admin/settings ...")
    status, settings = request("PATCH", "/api/v1/admin/settings", {
        "heroBadge": "Software Development · Thailand",
    }, token=token)
    assert_true(status == 200, "settings update failed")
    print("  OK")

    print("Testing GET /api/v1/admin/contacts ...")
    status, contacts = request("GET", "/api/v1/admin/contacts", token=token)
    assert_true(status == 200, "contacts list failed")
    if contacts:
        contact_id = contacts[0]["id"]
        status, updated = request("PATCH", f"/api/v1/admin/contacts/{contact_id}", {"status": "read"}, token=token)
        assert_true(status == 200 and updated["status"] == "read", "contact update failed")
    print("  OK")

    print("Testing unauthorized access ...")
    status, _ = request("GET", "/api/v1/admin/projects")
    assert_true(status == 401, "expected 401 without token")
    print("  OK")

    print("\nAll Phase 2 admin API tests passed.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"\nFAILED: {exc}", file=sys.stderr)
        raise SystemExit(1)
