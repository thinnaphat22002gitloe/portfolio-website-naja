"""Generate SVG placeholder images for portfolio projects."""

from pathlib import Path

from sqlalchemy.orm import Session

from app.models import Project, ProjectImage
from app.services.upload import ensure_upload_dir

GRADIENTS = [
    ("#ff8c35", "#e8405a"),
    ("#6c63ff", "#00d4ff"),
    ("#00d4ff", "#ff6b9d"),
    ("#a855f7", "#6c63ff"),
    ("#ff8c35", "#6c63ff"),
    ("#7e22ce", "#3b82f6"),
]


def _svg_content(title: str, subtitle: str, color_a: str, color_b: str) -> str:
    safe_title = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    safe_sub = subtitle.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">
      <stop stop-color="{color_a}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="{color_b}" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="#0f172a"/>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="80" y="80" width="1040" height="640" rx="32" stroke="white" stroke-opacity="0.15" stroke-width="2"/>
  <text x="600" y="360" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="52" font-weight="800">{safe_title}</text>
  <text x="600" y="430" text-anchor="middle" fill="white" fill-opacity="0.7" font-family="Arial,sans-serif" font-size="24">{safe_sub}</text>
  <text x="600" y="520" text-anchor="middle" fill="white" fill-opacity="0.45" font-family="Arial,sans-serif" font-size="18">TMRW UNLIMIT · Portfolio Preview</text>
</svg>"""


def seed_project_placeholders(db: Session) -> None:
    upload_dir = ensure_upload_dir() / "projects"
    projects = db.query(Project).all()

    for index, project in enumerate(projects):
        if project.images:
            continue

        color_a, color_b = GRADIENTS[index % len(GRADIENTS)]
        count = max(project.image_count, 1)

        for offset in range(count):
            filename = f"placeholder-{project.project_id}-{offset + 1}.svg"
            destination = upload_dir / filename
            if not destination.exists():
                svg = _svg_content(project.title, project.category, color_a, color_b)
                destination.write_text(svg, encoding="utf-8")

            url = f"/uploads/projects/{filename}"
            db.add(ProjectImage(project_id=project.id, url=url, sort_order=offset))

        project.image_count = count

    db.commit()
