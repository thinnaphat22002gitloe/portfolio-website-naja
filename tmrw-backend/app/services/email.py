import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def send_contact_notification(payload: dict, submission_id: int) -> None:
    recipient = settings.contact_notify_email or settings.smtp_user
    if not recipient or not settings.smtp_host:
        logger.info(
            "Contact submission #%s saved (email notification skipped — SMTP not configured)",
            submission_id,
        )
        return

    message = EmailMessage()
    message["Subject"] = f"[TMRW UNLIMIT] New contact from {payload['firstName']} {payload['lastName']}"
    message["From"] = settings.smtp_user or recipient
    message["To"] = recipient
    message.set_content(
        "\n".join(
            [
                f"Submission ID: {submission_id}",
                f"Name: {payload['firstName']} {payload['lastName']}",
                f"Email: {payload['email']}",
                f"Company: {payload.get('company') or '-'}",
                f"Service: {payload['service']}",
                "",
                "Message:",
                payload["message"],
            ]
        )
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
        logger.info("Contact notification email sent for submission #%s", submission_id)
    except Exception:
        logger.exception("Failed to send contact notification for submission #%s", submission_id)
