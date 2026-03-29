from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("register/", views.register_view, name="auth-register"),
    path("verify-email/<uuid:token>/", views.verify_email_view, name="auth-verify-email"),
    path("resend-verification/", views.resend_verification_view, name="auth-resend-verification"),
    path("login/", views.login_view, name="auth-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("me/", views.me_view, name="auth-me"),
    path("password-reset/", views.password_reset_request_view, name="auth-password-reset"),
    path("password-reset/confirm/", views.password_reset_confirm_view, name="auth-password-reset-confirm"),
]
