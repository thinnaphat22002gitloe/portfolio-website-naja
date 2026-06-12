from sqlalchemy import inspect, text

from app.database import engine


def run_migrations() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("site_settings"):
        return

    columns = {column["name"] for column in inspector.get_columns("site_settings")}
    if "logo_url" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE site_settings ADD COLUMN logo_url VARCHAR(512) DEFAULT '/assets/logo.svg'")
            )

            connection.execute(
                text("UPDATE site_settings SET logo_url = '/assets/logo.svg' WHERE logo_url IS NULL")
            )
