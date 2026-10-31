from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    database_url: str = "sqlite:///./tmrw.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    contact_notify_email: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_rate_limit_per_hour: int = 10

    # Secrets come from tmrw-backend/.env (see .env.example). No secret is shipped in code:
    # if JWT_SECRET is empty a random per-process secret is generated (dev only).
    jwt_secret: str = ""
    jwt_secret_is_ephemeral: bool = False
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    admin_email: str = "admin@tmrw.unlimited"
    # Initial admin password (only used to create the first admin account). Set in .env.
    admin_password: str = ""
    admin_name: str = "TMRW Admin"

    upload_dir: str = "uploads"
    max_upload_size_mb: int = 5
    port: int = 8000

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"


settings = Settings()

if not settings.jwt_secret:
    if settings.is_production:
        raise RuntimeError("JWT_SECRET must be set in production (see tmrw-backend/.env.example)")
    import secrets as _secrets

    settings.jwt_secret = _secrets.token_urlsafe(48)
    settings.jwt_secret_is_ephemeral = True
