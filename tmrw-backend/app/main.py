from contextlib import asynccontextmanager
from pathlib import Path
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers.admin import router as admin_router
from app.routers.public import router as public_router
from app.services.auth import seed_admin_user
from app.services.content import seed_database
from app.services.migrate import run_migrations
from app.services.placeholders import seed_project_placeholders
from app.services.upload import ensure_upload_dir

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.is_production and settings.jwt_secret == "dev-secret-change-in-production":
        logger.warning("JWT_SECRET is using the default value in production")

    Base.metadata.create_all(bind=engine)
    run_migrations()
    ensure_upload_dir()
    db = SessionLocal()
    try:
        seed_database(db)
        seed_admin_user(db)
        seed_project_placeholders(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="TMRW UNLIMIT API",
    description="Backend API for TMRW UNLIMIT portfolio storefront",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_path = Path(settings.upload_dir)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_path)), name="uploads")

app.include_router(public_router)
app.include_router(admin_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "TMRW UNLIMIT API", "docs": "/docs", "admin": "/api/v1/admin"}
