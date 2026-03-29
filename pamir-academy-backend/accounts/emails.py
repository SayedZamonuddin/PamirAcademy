from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_verification_email(user):
    verification_url = (
        f"{settings.FRONTEND_URL}/verify-email?token={user.email_verification_token}"
    )
    subject = "Verify your Pamir Academy account"
    html_message = render_to_string("emails/verification_email.html", {
        "user": user,
        "verification_url": verification_url,
        "frontend_url": settings.FRONTEND_URL,
    })
    plain_message = (
        f"Hi {user.display_name or user.email},\n\n"
        f"Welcome to Pamir Academy! Please verify your email by visiting:\n"
        f"{verification_url}\n\n"
        f"This link expires in 24 hours.\n\n"
        f"— Pamir Academy Team"
    )
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_email(user):
    reset_url = (
        f"{settings.FRONTEND_URL}/reset-password?token={user.email_verification_token}"
    )
    subject = "Reset your Pamir Academy password"
    plain_message = (
        f"Hi {user.display_name or user.email},\n\n"
        f"You requested a password reset. Visit the link below:\n"
        f"{reset_url}\n\n"
        f"This link expires in 24 hours. If you didn't request this, ignore this email.\n\n"
        f"— Pamir Academy Team"
    )
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
