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
                text("ALTER TABLE site_settings ADD COLUMN logo_url VARCHAR(512) DEFAULT '/logo/LOGO UNBG2.png'")
            )

            connection.execute(
                text("UPDATE site_settings SET logo_url = '/logo/LOGO UNBG2.png' WHERE logo_url IS NULL")
            )

    with engine.begin() as connection:
        connection.execute(
            text("UPDATE site_settings SET logo_url = '/logo/LOGO UNBG2.png' WHERE logo_url = '/assets/logo.svg'")
        )

    if inspector.has_table("project_images"):
        with engine.begin() as connection:
            connection.execute(
                text("DELETE FROM project_images WHERE url LIKE '%placeholder-%'")
            )
