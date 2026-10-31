import uuid
from datetime import UTC, datetime
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.config import settings

# SVG is intentionally not accepted: uploaded SVGs are served from the same origin
# and can carry scripts. Use PNG/JPG/WebP for uploads.
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def ensure_upload_dir() -> Path:
    upload_path = Path(settings.upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)
    (upload_path / "projects").mkdir(parents=True, exist_ok=True)
    return upload_path


async def save_upload_file(file: UploadFile) -> tuple[str, str]:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename is required")

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    content = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")

    upload_dir = ensure_upload_dir()
    filename = f"{uuid.uuid4().hex}{extension}"
    destination = upload_dir / "projects" / filename
    destination.write_bytes(content)

    url = f"/uploads/projects/{filename}"
    return url, filename


def list_uploads() -> list[dict]:
    upload_dir = ensure_upload_dir() / "projects"
    items = []
    for path in upload_dir.iterdir():
        if path.is_file() and path.suffix.lower() in ALLOWED_EXTENSIONS | {".svg"}:
            stat = path.stat()
            items.append(
                {
                    "url": f"/uploads/projects/{path.name}",
                    "filename": path.name,
                    "size": stat.st_size,
                    "modifiedAt": datetime.fromtimestamp(stat.st_mtime, UTC),
                }
            )
    items.sort(key=lambda item: item["modifiedAt"], reverse=True)
    return items
