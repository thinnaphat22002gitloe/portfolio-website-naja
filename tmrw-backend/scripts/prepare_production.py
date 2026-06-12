#!/usr/bin/env python3
"""Generate production environment files with secure secrets."""

import secrets
import string
from pathlib import Path


def generate_password(length: int = 24) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    backend_env = root / "tmrw-backend" / ".env.production.generated"
    frontend_env = root / ".env.production.generated"

    jwt_secret = secrets.token_urlsafe(48)
    admin_password = generate_password()

    backend_env.write_text(
        "\n".join(
            [
                "# Generated production env — review before deploy",
                "APP_ENV=production",
                "DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/tmrw",
                "CORS_ORIGINS=https://your-frontend.vercel.app",
                f"JWT_SECRET={jwt_secret}",
                "JWT_EXPIRE_MINUTES=1440",
                "ADMIN_EMAIL=admin@tmrw.unlimited",
                f"ADMIN_PASSWORD={admin_password}",
                "ADMIN_NAME=TMRW Admin",
                "UPLOAD_DIR=uploads",
                "MAX_UPLOAD_SIZE_MB=5",
                "",
                "# Optional SMTP",
                "CONTACT_NOTIFY_EMAIL=team@yourcompany.com",
                "SMTP_HOST=smtp.gmail.com",
                "SMTP_PORT=587",
                "SMTP_USER=",
                "SMTP_PASSWORD=",
                "",
            ]
        ),
        encoding="utf-8",
    )

    frontend_env.write_text(
        "\n".join(
            [
                "# Generated production env — review before deploy",
                "VITE_API_URL=https://your-api.onrender.com",
                "VITE_BASE_PATH=/",
                "",
            ]
        ),
        encoding="utf-8",
    )

    print("Generated production env files:")
    print(f"  - {backend_env}")
    print(f"  - {frontend_env}")
    print("\nAdmin password (save this now):")
    print(f"  {admin_password}")


if __name__ == "__main__":
    main()
