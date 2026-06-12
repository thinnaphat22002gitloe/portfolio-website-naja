from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas import ContactCreate, ContactResponse, HealthResponse, ProjectOut, SiteContent
from app.services.content import (
    build_site_content,
    count_recent_submissions,
    create_contact_submission,
    get_project_by_slug,
    get_published_projects,
)
from app.services.email import send_contact_notification

router = APIRouter(prefix="/api/v1", tags=["public"])


@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    from sqlalchemy import text

    try:
        db.execute(text("SELECT 1"))
        database_status = "ok"
    except Exception:
        database_status = "error"

    return HealthResponse(status="ok", database=database_status)


@router.get("/content", response_model=SiteContent)
def get_content(db: Session = Depends(get_db)) -> SiteContent:
    return SiteContent(**build_site_content(db))


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)) -> list[ProjectOut]:
    return [ProjectOut(**project) for project in get_published_projects(db)]


@router.get("/projects/{slug}", response_model=ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)) -> ProjectOut:
    project = get_project_by_slug(db, slug)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return ProjectOut(**project)


@router.post("/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate, request: Request, db: Session = Depends(get_db)) -> ContactResponse:
    ip_address = request.client.host if request.client else None
    recent_count = count_recent_submissions(db, ip_address, hours=1)

    if recent_count >= settings.contact_rate_limit_per_hour:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many contact submissions. Please try again later.",
        )

    submission = create_contact_submission(db, payload.model_dump(), ip_address)
    send_contact_notification(payload.model_dump(), submission.id)

    return ContactResponse(
        success=True,
        id=submission.id,
        message="Message sent successfully. We'll get back to you as soon as possible.",
    )
