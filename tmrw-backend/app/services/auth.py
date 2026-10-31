import logging

import bcrypt
from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.models import AdminUser

logger = logging.getLogger(__name__)
WEAK_DEFAULT_PASSWORDS = {"changeme123", "admin", "password", "123456"}


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(subject: str) -> str:
    expire = datetime.now(UTC) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        subject = payload.get("sub")
        return subject if isinstance(subject, str) else None
    except JWTError:
        return None


def authenticate_admin(db: Session, email: str, password: str) -> AdminUser | None:
    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.is_active.is_(True)).first()
    if not admin or not verify_password(password, admin.password_hash):
        return None
    return admin


def seed_admin_user(db: Session) -> None:
    existing = db.query(AdminUser).filter(AdminUser.email == settings.admin_email).first()
    if existing:
        return
    if db.query(AdminUser).count() > 0 and not settings.admin_password:
        return
    if not settings.admin_password:
        logger.warning(
            "ADMIN_PASSWORD is not set - no admin account created. "
            "Copy tmrw-backend/.env.example to tmrw-backend/.env and set ADMIN_EMAIL / ADMIN_PASSWORD."
        )
        return
    if settings.is_production and settings.admin_password in WEAK_DEFAULT_PASSWORDS:
        raise RuntimeError("Refusing to create the production admin with the documented dev password. Set ADMIN_PASSWORD.")

    db.add(
        AdminUser(
            email=settings.admin_email,
            name=settings.admin_name,
            password_hash=hash_password(settings.admin_password),
            role="admin",
        )
    )
    db.commit()
