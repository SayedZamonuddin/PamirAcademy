from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "display_name", "role", "is_email_verified", "is_active", "date_joined"]
    list_filter = ["role", "is_email_verified", "is_active", "is_staff"]
    search_fields = ["email", "display_name"]
    ordering = ["-date_joined"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("display_name", "role")}),
        ("Verification", {"fields": ("is_email_verified", "email_verification_token", "verification_token_created")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("last_login", "date_joined")}),
    )
    readonly_fields = ["email_verification_token", "verification_token_created", "date_joined", "last_login"]

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "role", "display_name"),
        }),
    )
