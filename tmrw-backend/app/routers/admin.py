from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.deps import get_current_admin
from app.models import AdminUser
from app.schemas.admin import (
    ContactAdminOut,
    ContactStatusUpdate,
    DashboardStats,
    LoginRequest,
    ProjectAdminOut,
    ProjectCreate,
    ProjectUpdate,
    ServiceAdminOut,
    ServiceCreate,
    ServiceUpdate,
    SiteSettingsOut,
    SiteSettingsUpdate,
    TokenResponse,
    UploadResponse,
    AdminUserOut,
)
from app.services.admin_content import (
    create_project,
    create_service,
    delete_project,
    delete_service,
    get_admin_project,
    get_dashboard_stats,
    get_site_settings,
    list_all_projects,
    list_all_services,
    list_contacts,
    update_contact_status,
    update_project,
    update_service,
    update_site_settings,
)
from app.services.auth import authenticate_admin, create_access_token
from app.services.upload import save_upload_file

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    admin = authenticate_admin(db, payload.email, payload.password)
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(admin.email)
    return TokenResponse(accessToken=token, expiresInMinutes=settings.jwt_expire_minutes)


@router.get("/me", response_model=AdminUserOut)
def get_me(admin: AdminUser = Depends(get_current_admin)) -> AdminUserOut:
    return AdminUserOut(id=admin.id, email=admin.email, name=admin.name, role=admin.role)


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> DashboardStats:
    return DashboardStats(**get_dashboard_stats(db))


@router.get("/projects", response_model=list[ProjectAdminOut])
def admin_list_projects(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> list[ProjectAdminOut]:
    return [ProjectAdminOut(**project) for project in list_all_projects(db)]


@router.get("/projects/{project_id}", response_model=ProjectAdminOut)
def admin_get_project(project_id: int, _: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> ProjectAdminOut:
    project = get_admin_project(db, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return ProjectAdminOut(**project)


@router.post("/projects", response_model=ProjectAdminOut, status_code=status.HTTP_201_CREATED)
def admin_create_project(
    payload: ProjectCreate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectAdminOut:
    project = create_project(db, payload.model_dump())
    return ProjectAdminOut(**project)


@router.patch("/projects/{project_id}", response_model=ProjectAdminOut)
def admin_update_project(
    project_id: int,
    payload: ProjectUpdate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectAdminOut:
    project = update_project(db, project_id, payload.model_dump(exclude_unset=True))
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return ProjectAdminOut(**project)


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_project(project_id: int, _: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> None:
    if not delete_project(db, project_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")


@router.get("/services", response_model=list[ServiceAdminOut])
def admin_list_services(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> list[ServiceAdminOut]:
    return [ServiceAdminOut(**service) for service in list_all_services(db)]


@router.post("/services", response_model=ServiceAdminOut, status_code=status.HTTP_201_CREATED)
def admin_create_service(
    payload: ServiceCreate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceAdminOut:
    service = create_service(db, payload.model_dump())
    return ServiceAdminOut(**service)


@router.patch("/services/{service_id}", response_model=ServiceAdminOut)
def admin_update_service(
    service_id: int,
    payload: ServiceUpdate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceAdminOut:
    service = update_service(db, service_id, payload.model_dump(exclude_unset=True))
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return ServiceAdminOut(**service)


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_service(service_id: int, _: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> None:
    if not delete_service(db, service_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")


@router.get("/contacts", response_model=list[ContactAdminOut])
def admin_list_contacts(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> list[ContactAdminOut]:
    return [ContactAdminOut(**contact) for contact in list_contacts(db)]


@router.patch("/contacts/{contact_id}", response_model=ContactAdminOut)
def admin_update_contact(
    contact_id: int,
    payload: ContactStatusUpdate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ContactAdminOut:
    contact = update_contact_status(db, contact_id, payload.status)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    return ContactAdminOut(**contact)


@router.get("/settings", response_model=SiteSettingsOut)
def admin_get_settings(_: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)) -> SiteSettingsOut:
    settings_data = get_site_settings(db)
    if not settings_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not found")
    return SiteSettingsOut(**settings_data)


@router.patch("/settings", response_model=SiteSettingsOut)
def admin_update_settings(
    payload: SiteSettingsUpdate,
    _: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> SiteSettingsOut:
    settings_data = update_site_settings(db, payload.model_dump(exclude_unset=True))
    if not settings_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not found")
    return SiteSettingsOut(**settings_data)


@router.post("/upload", response_model=UploadResponse)
async def admin_upload(
    file: UploadFile = File(...),
    _: AdminUser = Depends(get_current_admin),
) -> UploadResponse:
    url, filename = await save_upload_file(file)
    return UploadResponse(url=url, filename=filename)
