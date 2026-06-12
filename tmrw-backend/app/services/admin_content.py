from sqlalchemy.orm import Session, joinedload

from app.models import (
    ContactSubmission,
    Project,
    ProjectFeature,
    ProjectImage,
    ProjectTag,
    Service,
    SiteSettings,
)
from app.services.content import project_to_dict, slugify


def project_admin_to_dict(project: Project) -> dict:
    base = project_to_dict(project)
    return {
        "id": project.id,
        "projectId": project.project_id,
        "slug": project.slug,
        "title": project.title,
        "category": project.category,
        "shortDesc": project.short_desc,
        "fullDesc": project.full_desc,
        "gradient": project.gradient,
        "imagePrefix": project.image_prefix,
        "imageStartIndex": project.image_start_index,
        "imageCount": project.image_count,
        "sortOrder": project.sort_order,
        "isPublished": project.is_published,
        "features": base["features"],
        "tags": base["tags"],
        "imageUrls": base["images"],
    }


def _apply_project_relations(db: Session, project: Project, features: list[str], tags: list[str], image_urls: list[str]) -> None:
    db.query(ProjectFeature).filter(ProjectFeature.project_id == project.id).delete()
    db.query(ProjectTag).filter(ProjectTag.project_id == project.id).delete()
    db.query(ProjectImage).filter(ProjectImage.project_id == project.id).delete()

    for index, feature in enumerate(features):
        db.add(ProjectFeature(project_id=project.id, content=feature, sort_order=index))

    for tag in tags:
        db.add(ProjectTag(project_id=project.id, tag=tag))

    for index, url in enumerate(image_urls):
        db.add(ProjectImage(project_id=project.id, url=url, sort_order=index))


def list_all_projects(db: Session) -> list[dict]:
    projects = (
        db.query(Project)
        .options(joinedload(Project.features), joinedload(Project.tags), joinedload(Project.images))
        .order_by(Project.sort_order.asc())
        .all()
    )
    return [project_admin_to_dict(project) for project in projects]


def get_admin_project(db: Session, project_id: int) -> dict | None:
    project = (
        db.query(Project)
        .options(joinedload(Project.features), joinedload(Project.tags), joinedload(Project.images))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        return None
    return project_admin_to_dict(project)


def create_project(db: Session, payload: dict) -> dict:
    project = Project(
        project_id=payload["projectId"],
        slug=slugify(payload["title"]),
        title=payload["title"],
        category=payload["category"],
        short_desc=payload["shortDesc"],
        full_desc=payload["fullDesc"],
        gradient=payload.get("gradient", "from-primary/20 to-secondary/20"),
        image_prefix=payload.get("imagePrefix", ""),
        image_start_index=payload.get("imageStartIndex", 1),
        image_count=payload.get("imageCount", 1),
        sort_order=payload.get("sortOrder", 0),
        is_published=payload.get("isPublished", True),
    )
    db.add(project)
    db.flush()
    _apply_project_relations(
        db,
        project,
        payload.get("features", []),
        payload.get("tags", []),
        payload.get("imageUrls", []),
    )
    if payload.get("imageUrls"):
        project.image_count = len(payload["imageUrls"])
    db.commit()
    db.refresh(project)
    return get_admin_project(db, project.id)


def update_project(db: Session, project_id: int, payload: dict) -> dict | None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return None

    field_map = {
        "projectId": "project_id",
        "title": "title",
        "category": "category",
        "shortDesc": "short_desc",
        "fullDesc": "full_desc",
        "gradient": "gradient",
        "imagePrefix": "image_prefix",
        "imageStartIndex": "image_start_index",
        "imageCount": "image_count",
        "sortOrder": "sort_order",
        "isPublished": "is_published",
    }

    for key, attr in field_map.items():
        if key in payload and payload[key] is not None:
            setattr(project, attr, payload[key])

    if payload.get("title"):
        project.slug = slugify(project.title)

    features = payload.get("features")
    tags = payload.get("tags")
    image_urls = payload.get("imageUrls")
    if features is not None or tags is not None or image_urls is not None:
        resolved_features = features if features is not None else [item.content for item in project.features]
        resolved_tags = tags if tags is not None else [item.tag for item in project.tags]
        resolved_images = image_urls if image_urls is not None else [item.url for item in project.images]
        _apply_project_relations(db, project, resolved_features, resolved_tags, resolved_images)
        if resolved_images:
            project.image_count = len(resolved_images)

    db.commit()
    return get_admin_project(db, project.id)


def delete_project(db: Session, project_id: int) -> bool:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return False
    db.delete(project)
    db.commit()
    return True


def list_all_services(db: Session) -> list[dict]:
    services = db.query(Service).order_by(Service.sort_order.asc()).all()
    return [
        {
            "id": service.id,
            "serviceId": service.service_id,
            "title": service.title,
            "description": service.description,
            "sortOrder": service.sort_order,
            "isActive": service.is_active,
        }
        for service in services
    ]


def create_service(db: Session, payload: dict) -> dict:
    service = Service(
        service_id=payload["serviceId"],
        title=payload["title"],
        description=payload["description"],
        sort_order=payload.get("sortOrder", 0),
        is_active=payload.get("isActive", True),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return {
        "id": service.id,
        "serviceId": service.service_id,
        "title": service.title,
        "description": service.description,
        "sortOrder": service.sort_order,
        "isActive": service.is_active,
    }


def update_service(db: Session, service_id: int, payload: dict) -> dict | None:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        return None

    if payload.get("serviceId") is not None:
        service.service_id = payload["serviceId"]
    if payload.get("title") is not None:
        service.title = payload["title"]
    if payload.get("description") is not None:
        service.description = payload["description"]
    if payload.get("sortOrder") is not None:
        service.sort_order = payload["sortOrder"]
    if payload.get("isActive") is not None:
        service.is_active = payload["isActive"]

    db.commit()
    db.refresh(service)
    return {
        "id": service.id,
        "serviceId": service.service_id,
        "title": service.title,
        "description": service.description,
        "sortOrder": service.sort_order,
        "isActive": service.is_active,
    }


def delete_service(db: Session, service_id: int) -> bool:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        return False
    db.delete(service)
    db.commit()
    return True


def list_contacts(db: Session) -> list[dict]:
    submissions = db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()
    return [
        {
            "id": item.id,
            "firstName": item.first_name,
            "lastName": item.last_name,
            "email": item.email,
            "company": item.company,
            "service": item.service,
            "message": item.message,
            "status": item.status,
            "createdAt": item.created_at,
        }
        for item in submissions
    ]


def update_contact_status(db: Session, contact_id: int, status_value: str) -> dict | None:
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == contact_id).first()
    if not submission:
        return None
    submission.status = status_value
    db.commit()
    db.refresh(submission)
    return {
        "id": submission.id,
        "firstName": submission.first_name,
        "lastName": submission.last_name,
        "email": submission.email,
        "company": submission.company,
        "service": submission.service,
        "message": submission.message,
        "status": submission.status,
        "createdAt": submission.created_at,
    }


def get_dashboard_stats(db: Session) -> dict:
    projects_total = db.query(Project).count()
    projects_published = db.query(Project).filter(Project.is_published.is_(True)).count()
    services_total = db.query(Service).count()
    contacts_total = db.query(ContactSubmission).count()
    contacts_new = db.query(ContactSubmission).filter(ContactSubmission.status == "new").count()
    return {
        "projectsTotal": projects_total,
        "projectsPublished": projects_published,
        "servicesTotal": services_total,
        "contactsNew": contacts_new,
        "contactsTotal": contacts_total,
    }


def get_site_settings(db: Session) -> dict | None:
    import json

    settings = db.query(SiteSettings).first()
    if not settings:
        return None
    return {
        "heroBadge": settings.hero_badge,
        "heroHeadline": settings.hero_headline,
        "heroDescription": settings.hero_description,
        "typewriterWords": json.loads(settings.typewriter_words),
        "contactEmail": settings.contact_email,
        "contactPhone": settings.contact_phone,
        "contactAddress": settings.contact_address,
        "workingHours": settings.working_hours,
        "logoUrl": getattr(settings, "logo_url", None) or "/assets/logo.svg",
        "socialLinks": json.loads(settings.social_links),
    }


def update_site_settings(db: Session, payload: dict) -> dict | None:
    import json

    settings = db.query(SiteSettings).first()
    if not settings:
        return None

    mapping = {
        "heroBadge": "hero_badge",
        "heroHeadline": "hero_headline",
        "heroDescription": "hero_description",
        "contactEmail": "contact_email",
        "contactPhone": "contact_phone",
        "contactAddress": "contact_address",
        "workingHours": "working_hours",
        "logoUrl": "logo_url",
    }

    for key, attr in mapping.items():
        if payload.get(key) is not None:
            setattr(settings, attr, payload[key])

    if payload.get("typewriterWords") is not None:
        settings.typewriter_words = json.dumps(payload["typewriterWords"])

    if payload.get("socialLinks") is not None:
        settings.social_links = json.dumps(payload["socialLinks"])

    db.commit()
    return get_site_settings(db)
