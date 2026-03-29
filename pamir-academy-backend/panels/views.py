from django.contrib.auth import get_user_model
from django.db.models import Q, Max, Count, Subquery, OuterRef
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Group,
    GroupMembership,
    ScheduleSlot,
    ScheduleChangeRequest,
    GroupChangeRequest,
    Message,
)
from .serializers import (
    GroupSerializer,
    GroupListSerializer,
    ScheduleSlotSerializer,
    ScheduleChangeRequestCreateSerializer,
    ScheduleChangeRequestSerializer,
    GroupChangeRequestCreateSerializer,
    GroupChangeRequestSerializer,
    MessageSerializer,
    MessageCreateSerializer,
    ContactSerializer,
)

User = get_user_model()


# ──────────────────── Schedule ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_schedule(request):
    slots = ScheduleSlot.objects.filter(user=request.user).select_related("subject", "counterpart")
    return Response(ScheduleSlotSerializer(slots, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def schedule_change_requests(request):
    if request.method == "GET":
        reqs = ScheduleChangeRequest.objects.filter(student=request.user).select_related("slot")
        return Response(ScheduleChangeRequestSerializer(reqs, many=True).data)

    serializer = ScheduleChangeRequestCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        slot = ScheduleSlot.objects.get(
            id=serializer.validated_data["slot_id"],
            user=request.user,
        )
    except ScheduleSlot.DoesNotExist:
        return Response({"error": "Schedule slot not found."}, status=404)

    obj = ScheduleChangeRequest.objects.create(
        student=request.user,
        slot=slot,
        reason=serializer.validated_data["reason"],
        preferred_time=serializer.validated_data.get("preferred_time", ""),
        notes=serializer.validated_data.get("notes", ""),
    )
    return Response(
        ScheduleChangeRequestSerializer(obj).data,
        status=status.HTTP_201_CREATED,
    )


# ──────────────────── Groups ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_groups(request):
    memberships = GroupMembership.objects.filter(
        student=request.user
    ).select_related("group", "group__subject", "group__teacher")
    groups = [m.group for m in memberships]
    return Response(GroupSerializer(groups, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def available_groups(request):
    current_group_ids = GroupMembership.objects.filter(
        student=request.user
    ).values_list("group_id", flat=True)
    groups = Group.objects.filter(group_type="group").exclude(id__in=current_group_ids)
    return Response(GroupListSerializer(groups, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def group_change_requests(request):
    if request.method == "GET":
        reqs = GroupChangeRequest.objects.filter(student=request.user).select_related(
            "current_group", "target_group"
        )
        return Response(GroupChangeRequestSerializer(reqs, many=True).data)

    serializer = GroupChangeRequestCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        current_group = Group.objects.get(id=serializer.validated_data["current_group_id"])
    except Group.DoesNotExist:
        return Response({"error": "Current group not found."}, status=404)

    if not GroupMembership.objects.filter(group=current_group, student=request.user).exists():
        return Response({"error": "You are not a member of this group."}, status=400)

    target_group = None
    target_id = serializer.validated_data.get("target_group_id")
    if target_id:
        try:
            target_group = Group.objects.get(id=target_id)
        except Group.DoesNotExist:
            return Response({"error": "Target group not found."}, status=404)
        if target_group.spots_left <= 0:
            return Response({"error": "Target group is full."}, status=400)

    obj = GroupChangeRequest.objects.create(
        student=request.user,
        current_group=current_group,
        target_group=target_group,
        reason=serializer.validated_data["reason"],
        notes=serializer.validated_data.get("notes", ""),
    )
    return Response(
        GroupChangeRequestSerializer(obj).data,
        status=status.HTTP_201_CREATED,
    )


# ──────────────────── Messages ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contacts(request):
    user = request.user

    people_ids = set()
    people_ids.update(
        Message.objects.filter(sender=user).values_list("receiver_id", flat=True)
    )
    people_ids.update(
        Message.objects.filter(receiver=user).values_list("sender_id", flat=True)
    )

    if user.role == "student":
        memberships = GroupMembership.objects.filter(student=user).select_related("group")
        for m in memberships:
            if m.group.teacher_id:
                people_ids.add(m.group.teacher_id)
        admin_ids = User.objects.filter(role="admin", is_active=True).values_list("id", flat=True)
        people_ids.update(admin_ids)

    elif user.role == "teacher":
        student_ids = GroupMembership.objects.filter(
            group__teacher=user
        ).values_list("student_id", flat=True)
        people_ids.update(student_ids)
        admin_ids = User.objects.filter(role="admin", is_active=True).values_list("id", flat=True)
        people_ids.update(admin_ids)

    people_ids.discard(user.id)

    contact_list = []
    for person in User.objects.filter(id__in=people_ids):
        last_msg = Message.objects.filter(
            Q(sender=user, receiver=person) | Q(sender=person, receiver=user)
        ).order_by("-created_at").first()

        unread = Message.objects.filter(sender=person, receiver=user, is_read=False).count()

        contact_list.append({
            "id": person.id,
            "email": person.email,
            "display_name": person.display_name or person.email,
            "role": person.role,
            "last_message": last_msg.text[:80] if last_msg else "",
            "last_message_time": last_msg.created_at if last_msg else None,
            "unread_count": unread,
        })

    contact_list.sort(key=lambda c: c["last_message_time"] or "", reverse=True)
    serializer = ContactSerializer(contact_list, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def conversation(request, user_id):
    try:
        other = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    if request.method == "GET":
        messages = Message.objects.filter(
            Q(sender=request.user, receiver=other) | Q(sender=other, receiver=request.user)
        ).select_related("sender")

        Message.objects.filter(sender=other, receiver=request.user, is_read=False).update(is_read=True)

        return Response(
            MessageSerializer(messages, many=True, context={"request": request}).data
        )

    serializer = MessageCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    msg = Message.objects.create(
        sender=request.user,
        receiver=other,
        text=serializer.validated_data["text"],
    )
    return Response(
        MessageSerializer(msg, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )


# ──────────────────── Dashboard summary ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_summary(request):
    user = request.user
    groups = GroupMembership.objects.filter(student=user).select_related(
        "group", "group__subject", "group__teacher"
    )
    slots = ScheduleSlot.objects.filter(user=user, status="booked").select_related("subject", "counterpart")

    subjects_enrolled = len(set(m.group.subject_id for m in groups if m.group.subject_id))
    total_classes_week = slots.count()
    groups_data = GroupSerializer([m.group for m in groups], many=True).data

    return Response({
        "subjects_enrolled": subjects_enrolled,
        "classes_this_week": total_classes_week,
        "groups": groups_data,
        "schedule": ScheduleSlotSerializer(slots, many=True).data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_dashboard_summary(request):
    user = request.user
    groups = Group.objects.filter(teacher=user).select_related("subject")
    slots = ScheduleSlot.objects.filter(user=user, status="booked").select_related("subject", "counterpart")

    total_students = GroupMembership.objects.filter(group__teacher=user).values("student").distinct().count()

    return Response({
        "total_students": total_students,
        "total_groups": groups.count(),
        "classes_this_week": slots.count(),
        "groups": GroupListSerializer(groups, many=True).data,
        "schedule": ScheduleSlotSerializer(slots, many=True).data,
    })
