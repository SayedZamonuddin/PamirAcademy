from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)
from .emails import send_verification_email, send_password_reset_email

User = get_user_model()


def _get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    send_verification_email(user)
    return Response(
        {
            "message": "Account created. Please check your email to verify your account.",
            "user": UserSerializer(user).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def verify_email_view(request, token):
    try:
        user = User.objects.get(email_verification_token=token)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid verification link."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user.verification_token_valid:
        return Response(
            {"error": "Verification link has expired. Please request a new one."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user.is_email_verified:
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

    tokens = _get_tokens_for_user(user)
    return Response({
        "message": "Email verified successfully.",
        "tokens": tokens,
        "user": UserSerializer(user).data,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def resend_verification_view(request):
    email = request.data.get("email", "").lower()
    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response(
            {"message": "If that email exists, a verification link has been sent."}
        )

    if user.is_email_verified:
        return Response({"message": "Email is already verified."})

    user.generate_verification_token()
    send_verification_email(user)
    return Response({"message": "Verification email resent. Please check your inbox."})


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data["email"].lower()
    password = serializer.validated_data["password"]
    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_email_verified:
        return Response(
            {"error": "Please verify your email before logging in."},
            status=status.HTTP_403_FORBIDDEN,
        )

    tokens = _get_tokens_for_user(user)
    return Response({
        "tokens": tokens,
        "user": UserSerializer(user).data,
    })


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def me_view(request):
    if request.method == "GET":
        return Response(UserSerializer(request.user).data)

    serializer = UserSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_request_view(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data["email"].lower()
    try:
        user = User.objects.get(email__iexact=email)
        user.generate_verification_token()
        send_password_reset_email(user)
    except User.DoesNotExist:
        pass

    return Response(
        {"message": "If that email exists, a password reset link has been sent."}
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_confirm_view(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    token = serializer.validated_data["token"]
    new_password = serializer.validated_data["new_password"]

    try:
        user = User.objects.get(email_verification_token=token)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid or expired reset link."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not user.verification_token_valid:
        return Response(
            {"error": "Reset link has expired."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.set_password(new_password)
    user.generate_verification_token()
    user.save()

    return Response({"message": "Password reset successfully. You can now log in."})
