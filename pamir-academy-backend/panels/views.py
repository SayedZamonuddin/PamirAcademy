from datetime import datetime as dt

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
    Course,
    Announcement,
    Payment,
    LiveSession,
)
from registration.models import Subject
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
    AnnouncementSerializer,
    PaymentSerializer,
    LiveSessionSerializer,
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

    elif user.role == "admin":
        all_active_ids = User.objects.filter(is_active=True).exclude(id=user.id).values_list("id", flat=True)
        people_ids.update(all_active_ids)

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

    contact_list.sort(key=lambda c: c["last_message_time"] or dt.min, reverse=True)
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


# ──────────────────── Admin Course Builder ────────────────────

def _require_admin(request):
    if request.user.role != User.Role.ADMIN:
        return Response(
            {"error": "You do not have permission to access this endpoint."},
            status=status.HTTP_403_FORBIDDEN,
        )
    return None


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def coursebuilder_courses(request):
    """Return every published course grouped by subject__level."""
    denied = _require_admin(request)
    if denied:
        return denied

    courses = Course.objects.select_related("subject").all()
    grouped = {}
    for c in courses:
        key = f"{c.subject.name}__{c.level}"
        grouped[key] = {
            "title": c.title,
            "description": c.description,
            "structure": c.structure,
        }
    return Response(grouped)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def coursebuilder_publish(request):
    """Publish / update a course for a subject + level."""
    denied = _require_admin(request)
    if denied:
        return denied

    subject_name = (request.data.get("subject") or "").strip()
    level = (request.data.get("level") or "").strip().lower()
    title = (request.data.get("title") or "").strip()
    description = (request.data.get("description") or "").strip()
    structure = request.data.get("structure", [])

    if not subject_name:
        return Response({"error": "Subject name is required."}, status=400)
    if level not in ("beginner", "intermediate", "advanced"):
        return Response({"error": "Level must be beginner, intermediate, or advanced."}, status=400)
    if not isinstance(structure, list):
        return Response({"error": "Structure must be a list of units."}, status=400)

    try:
        subject, _ = Subject.objects.get_or_create(name=subject_name)
        course, _ = Course.objects.update_or_create(
            subject=subject,
            level=level,
            defaults={
                "title": title,
                "description": description,
                "structure": structure,
            },
        )
        return Response(
            {"message": f"Course published for {subject_name}/{level}."},
            status=status.HTTP_201_CREATED,
        )
    except Exception as exc:
        return Response(
            {"error": f"Server error while publishing: {exc}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ──────────────────── Student Course Catalog ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_courses(request):
    """Return all published courses as a flat list for student browsing."""
    courses = Course.objects.select_related("subject").all()
    result = []
    for c in courses:
        structure = c.structure if isinstance(c.structure, list) else []
        unit_count = len(structure)
        lesson_count = 0
        for unit in structure:
            if not isinstance(unit, dict):
                continue
            lessons = unit.get("lessons", [])
            if isinstance(lessons, list):
                lesson_count += len(lessons)
        result.append({
            "id": c.id,
            "subject": c.subject.name,
            "level": c.level,
            "title": c.title,
            "description": c.description,
            "unit_count": unit_count,
            "lesson_count": lesson_count,
            "updated_at": c.updated_at.isoformat(),
        })
    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_course_detail(request, course_id):
    """Return full course structure for a single course."""
    try:
        course = Course.objects.select_related("subject").get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found."}, status=404)
    return Response({
        "id": course.id,
        "subject": course.subject.name,
        "level": course.level,
        "title": course.title,
        "description": course.description,
        "structure": course.structure if isinstance(course.structure, list) else [],
    })


# ──────────────────── Announcements ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def announcements(request):
    user = request.user
    qs = Announcement.objects.all()
    if user.role == "student":
        qs = qs.filter(audience__in=["all", "students"])
    elif user.role == "teacher":
        qs = qs.filter(audience__in=["all", "teachers"])
    return Response(AnnouncementSerializer(qs[:20], many=True).data)


# ──────────────────── Schedule Slot Update ────────────────────

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_schedule_slot(request, slot_id):
    try:
        slot = ScheduleSlot.objects.get(id=slot_id, user=request.user)
    except ScheduleSlot.DoesNotExist:
        return Response({"error": "Slot not found."}, status=404)

    if slot.status == "booked":
        return Response({"error": "Cannot change a booked slot."}, status=400)

    new_status = request.data.get("status")
    if new_status not in ("available", "unavailable"):
        return Response({"error": "Invalid status."}, status=400)

    slot.status = new_status
    slot.save()
    return Response(ScheduleSlotSerializer(slot).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def set_availability(request):
    """Bulk set availability for all slots in a week."""
    slots_data = request.data.get("slots", [])
    if not isinstance(slots_data, list):
        return Response({"error": "slots must be a list."}, status=400)

    results = []
    for s in slots_data:
        day = s.get("day_of_week")
        hour = s.get("hour")
        slot_status = s.get("status", "available")

        if not isinstance(day, int) or day < 0 or day > 6:
            return Response(
                {"error": f"Invalid day_of_week: {day}. Must be 0-6."},
                status=400,
            )
        if not isinstance(hour, int) or hour < 0 or hour > 23:
            return Response(
                {"error": f"Invalid hour: {hour}. Must be 0-23."},
                status=400,
            )
        if slot_status not in ("available", "unavailable"):
            return Response(
                {"error": f"Invalid status: {slot_status}. Must be 'available' or 'unavailable'."},
                status=400,
            )

        slot, created = ScheduleSlot.objects.update_or_create(
            user=request.user,
            day_of_week=day,
            hour=hour,
            defaults={"status": slot_status},
        )
        results.append(ScheduleSlotSerializer(slot).data)
    return Response(results)


# ──────────────────── Teacher Statistics ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_stats(request):
    user = request.user
    memberships = GroupMembership.objects.filter(group__teacher=user)
    student_ids = memberships.values_list("student_id", flat=True).distinct()
    total_students = student_ids.count()
    active_students = memberships.filter(
        student__is_active=True
    ).values("student").distinct().count()

    groups = Group.objects.filter(teacher=user)
    group_students = memberships.filter(group__group_type="group").values("student").distinct().count()
    individual_students = memberships.filter(group__group_type="individual").values("student").distinct().count()

    # Level distribution
    level_dist = list(groups.values("level").annotate(count=Count("id")).order_by("level"))

    # Group vs Individual breakdown
    group_vs_individual = [
        {"label": "Group", "count": groups.filter(group_type="group").count()},
        {"label": "Individual", "count": groups.filter(group_type="individual").count()},
    ]

    slots = ScheduleSlot.objects.filter(user=user, status="booked")
    total_sessions = slots.count()

    # Weekday activity
    weekday_activity = list(slots.values("day_of_week").annotate(sessions=Count("id")).order_by("day_of_week"))

    return Response({
        "total_students": total_students,
        "active_students": active_students,
        "group_students": group_students,
        "individual_students": individual_students,
        "level_distribution": level_dist,
        "group_vs_individual": group_vs_individual,
        "total_sessions": total_sessions,
        "weekday_activity": weekday_activity,
    })


# ──────────────────── Teacher Payments ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_payments(request):
    payments = Payment.objects.filter(teacher=request.user).select_related("student", "subject")
    return Response(PaymentSerializer(payments, many=True).data)


# ──────────────────── Live Sessions ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_sessions(request):
    user = request.user
    if user.role == "teacher":
        sessions = LiveSession.objects.filter(teacher=user)
    else:
        sessions = LiveSession.objects.filter(student=user)
    return Response(LiveSessionSerializer(sessions.select_related("teacher", "student", "subject"), many=True).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_session_status(request, session_id):
    try:
        session = LiveSession.objects.get(id=session_id)
    except LiveSession.DoesNotExist:
        return Response({"error": "Session not found."}, status=404)

    if request.user.id not in (session.teacher_id, session.student_id):
        return Response({"error": "Not authorized."}, status=403)

    new_status = request.data.get("status")
    if new_status not in ("live", "ended"):
        return Response({"error": "Invalid status."}, status=400)

    session.status = new_status
    session.save()
    return Response(LiveSessionSerializer(session).data)


# ──────────────────── Admin Dashboard ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_dashboard_summary(request):
    denied = _require_admin(request)
    if denied:
        return denied

    total_students = User.objects.filter(role="student", is_active=True).count()
    total_teachers = User.objects.filter(role="teacher", is_active=True).count()
    total_groups = Group.objects.count()
    total_courses = Course.objects.count()
    pending_teachers = User.objects.filter(role="teacher", is_active=False).count()

    return Response({
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_groups": total_groups,
        "total_courses": total_courses,
        "pending_teacher_approvals": pending_teachers,
    })


# ──────────────────── Admin Schedule ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_schedule_overview(request):
    denied = _require_admin(request)
    if denied:
        return denied
    slots = ScheduleSlot.objects.all().select_related("user", "subject", "counterpart")
    data = []
    for slot in slots:
        slot_data = ScheduleSlotSerializer(slot).data
        slot_data["user_email"] = slot.user.email
        slot_data["user_name"] = slot.user.display_name or slot.user.email
        slot_data["user_role"] = slot.user.role
        data.append(slot_data)
    return Response(data)


# ──────────────────── Admin Statistics ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_statistics(request):
    denied = _require_admin(request)
    if denied:
        return denied

    total_students = User.objects.filter(role="student").count()
    total_teachers = User.objects.filter(role="teacher").count()
    total_courses = Course.objects.count()
    total_groups = Group.objects.count()

    return Response({
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_courses": total_courses,
        "total_groups": total_groups,
        "students_by_country": [],
    })


# ──────────────────── Admin Teacher Decision ────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_teacher_decision(request, teacher_id):
    denied = _require_admin(request)
    if denied:
        return denied

    decision = request.data.get("decision")
    try:
        teacher = User.objects.get(id=teacher_id, role="teacher")
    except User.DoesNotExist:
        return Response({"error": "Teacher not found."}, status=404)

    if decision == "accept":
        teacher.is_active = True
        teacher.save()
        return Response({"message": "Teacher accepted."})
    elif decision == "refuse":
        teacher.is_active = False
        teacher.save()
        return Response({"message": "Teacher refused."})
    return Response({"error": "Invalid decision."}, status=400)
