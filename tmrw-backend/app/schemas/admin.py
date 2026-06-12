from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    expiresInMinutes: int


class AdminUserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str


class DashboardStats(BaseModel):
    projectsTotal: int
    projectsPublished: int
    servicesTotal: int
    contactsNew: int
    contactsTotal: int


class ProjectAdminOut(BaseModel):
    id: int
    projectId: str
    slug: str
    title: str
    category: str
    shortDesc: str
    fullDesc: str
    gradient: str
    imagePrefix: str
    imageStartIndex: int
    imageCount: int
    sortOrder: int
    isPublished: bool
    features: list[str]
    tags: list[str]
    imageUrls: list[str]


class ProjectCreate(BaseModel):
    projectId: str = Field(min_length=1, max_length=8)
    title: str = Field(min_length=1, max_length=255)
    category: str = Field(min_length=1, max_length=255)
    shortDesc: str = Field(min_length=1)
    fullDesc: str = Field(min_length=1)
    gradient: str = "from-primary/20 to-secondary/20"
    imagePrefix: str = ""
    imageStartIndex: int = 1
    imageCount: int = 1
    sortOrder: int = 0
    isPublished: bool = True
    features: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    imageUrls: list[str] = Field(default_factory=list)


class ProjectUpdate(BaseModel):
    projectId: str | None = None
    title: str | None = None
    category: str | None = None
    shortDesc: str | None = None
    fullDesc: str | None = None
    gradient: str | None = None
    imagePrefix: str | None = None
    imageStartIndex: int | None = None
    imageCount: int | None = None
    sortOrder: int | None = None
    isPublished: bool | None = None
    features: list[str] | None = None
    tags: list[str] | None = None
    imageUrls: list[str] | None = None


class ServiceAdminOut(BaseModel):
    id: int
    serviceId: str
    title: str
    description: str
    sortOrder: int
    isActive: bool


class ServiceCreate(BaseModel):
    serviceId: str = Field(min_length=1, max_length=8)
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    sortOrder: int = 0
    isActive: bool = True


class ServiceUpdate(BaseModel):
    serviceId: str | None = None
    title: str | None = None
    description: str | None = None
    sortOrder: int | None = None
    isActive: bool | None = None


class ContactAdminOut(BaseModel):
    id: int
    firstName: str
    lastName: str
    email: EmailStr
    company: str | None
    service: str
    message: str
    status: str
    createdAt: datetime


class ContactStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|read|replied|archived)$")


class SiteSettingsUpdate(BaseModel):
    heroBadge: str | None = None
    heroHeadline: str | None = None
    heroDescription: str | None = None
    typewriterWords: list[str] | None = None
    contactEmail: EmailStr | None = None
    contactPhone: str | None = None
    contactAddress: str | None = None
    workingHours: str | None = None
    logoUrl: str | None = None
    socialLinks: list[dict] | None = None


class SiteSettingsOut(BaseModel):
    heroBadge: str
    heroHeadline: str
    heroDescription: str
    typewriterWords: list[str]
    contactEmail: str
    contactPhone: str
    contactAddress: str
    workingHours: str
    logoUrl: str
    socialLinks: list[dict]


class UploadResponse(BaseModel):
    url: str
    filename: str
