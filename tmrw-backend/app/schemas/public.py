import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class HeroContent(BaseModel):
    badge: str
    headline: str
    description: str
    typewriterWords: list[str]
    ctaPrimary: str = "นัดหมายขอรับคำปรึกษา"
    ctaSecondary: str = "ดูบริการของเรา"


class AboutCardOut(BaseModel):
    id: str
    title: str
    icon: str
    description: str


class StatOut(BaseModel):
    value: str
    label: str


class AboutContent(BaseModel):
    sectionLabel: str = "01 — ABOUT US"
    title: str
    subtitle: str
    cards: list[AboutCardOut]
    stats: list[StatOut]


class ServiceOut(BaseModel):
    id: str
    title: str
    description: str


class ServicesContent(BaseModel):
    sectionLabel: str = "02 — SERVICES"
    title: str
    description: str
    items: list[ServiceOut]


class ProjectOut(BaseModel):
    id: str
    slug: str
    title: str
    category: str
    desc: str
    fullDesc: str
    features: list[str]
    tags: list[str]
    gradient: str
    imageCount: int
    imagePrefix: str
    imageStartIndex: int
    coverImage: str
    images: list[str]


class PortfolioContent(BaseModel):
    sectionLabel: str = "03 — PORTFOLIO"
    title: str
    description: str
    projects: list[ProjectOut]


class ContactInfo(BaseModel):
    email: str
    phone: str
    address: str
    workingHours: str


class SocialLink(BaseModel):
    platform: str
    label: str
    href: str


class ContactContent(BaseModel):
    sectionLabel: str = "04 — CONTACT"
    title: str
    description: str
    info: ContactInfo


class SiteContent(BaseModel):
    logoUrl: str = "/assets/logo.svg"
    hero: HeroContent
    about: AboutContent
    services: ServicesContent
    portfolio: PortfolioContent
    contact: ContactContent
    social: list[SocialLink]


class ContactCreate(BaseModel):
    firstName: str = Field(min_length=2, max_length=128)
    lastName: str = Field(min_length=2, max_length=128)
    email: EmailStr
    company: str | None = Field(default=None, max_length=255)
    service: str = Field(min_length=1, max_length=64)
    message: str = Field(min_length=10, max_length=5000)

    @field_validator("firstName", "lastName", "message")
    @classmethod
    def strip_whitespace(cls, value: str) -> str:
        return value.strip()


class ContactResponse(BaseModel):
    success: bool
    id: int
    message: str


class HealthResponse(BaseModel):
    status: str
    database: str


def slugify(value: str) -> str:
    slug = value.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")
