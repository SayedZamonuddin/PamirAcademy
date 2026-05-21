from functools import wraps

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Avg
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Subject,
    StudentProfile,
    TeacherProfile,
    UserSubjectSelection,
    ExamQuestion,
    ExamResult,
    PlacementResult,
)
from .serializers import (
    SubjectSerializer,
    StudentProfileSerializer,
    TeacherProfileSerializer,
    SubjectSelectionSerializer,
    ExamQuestionSerializer,
    ExamSubmitSerializer,
    ExamResultSerializer,
    PlacementResultSerializer,
    TeacherExamSubmitSerializer,
    TestBuilderPublishSerializer,
)

User = get_user_model()

QUESTIONS_PER_LEVEL = 5


def require_role(*roles):
    """Return 403 if the authenticated user's role is not in *roles*."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if request.user.role not in roles:
                return Response(
                    {"error": "You do not have permission to access this endpoint."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


# ──────────────────── Subjects ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def subject_list(request):
    subjects = Subject.objects.all()
    return Response(SubjectSerializer(subjects, many=True).data)


# ──────────────────── Student Personal Info ────────────────────

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.STUDENT, User.Role.ADMIN)
def student_personal_info(request):
    profile, _ = StudentProfile.objects.get_or_create(user=request.user)

    if request.method == "GET":
        return Response(StudentProfileSerializer(profile).data)

    serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ──────────────────── Student Subject Selection ────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.STUDENT, User.Role.ADMIN)
def student_subjects(request):
    if request.method == "GET":
        selections = UserSubjectSelection.objects.filter(user=request.user).select_related("subject")
        names = [s.subject.name for s in selections]
        return Response({"subjects": names})

    serializer = SubjectSelectionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    subject_names = serializer.validated_data["subjects"]

    UserSubjectSelection.objects.filter(user=request.user).delete()

    created = []
    for name in subject_names:
        subject, _ = Subject.objects.get_or_create(name=name)
        UserSubjectSelection.objects.create(user=request.user, subject=subject)
        created.append(name)

    profile, _ = StudentProfile.objects.get_or_create(user=request.user)
    if profile.registration_step < 3:
        profile.registration_step = 3
        profile.save(update_fields=["registration_step"])

    return Response({"subjects": created}, status=status.HTTP_201_CREATED)


# ──────────────────── Exam Questions ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def exam_questions(request, subject_name, level):
    try:
        subject = Subject.objects.get(name__iexact=subject_name)
    except Subject.DoesNotExist:
        return Response({"error": f"Subject '{subject_name}' not found."}, status=404)

    qs = ExamQuestion.objects.filter(subject=subject, level=level.lower())

    use_random = request.query_params.get("random", "").lower() in ("true", "1")
    try:
        limit = int(request.query_params.get("limit", 0))
    except (ValueError, TypeError):
        limit = 0

    if limit > 0:
        available = qs.count()
        if available < limit:
            return Response(
                {
                    "error": (
                        f"Not enough questions for {subject_name}/{level}. "
                        f"Need {limit}, but only {available} exist. "
                        f"An admin needs to add more questions."
                    ),
                    "available": available,
                    "required": limit,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if use_random:
            qs = qs.order_by("?")
        qs = qs[:limit]
    elif not qs.exists():
        return Response({"error": f"No questions for {subject_name}/{level}."}, status=404)

    return Response(ExamQuestionSerializer(qs, many=True).data)


# ──────────────────── Exam Submit ────────────────────

def _grade_answers(questions, answers_dict):
    total = len(questions) if isinstance(questions, list) else questions.count()
    score = 0
    for q in questions:
        user_answer = answers_dict.get(str(q.id))
        if user_answer is None:
            continue
        if q.question_type == "checkbox":
            correct = set(q.correct_answers) if q.correct_answers else set()
            given = set(user_answer) if isinstance(user_answer, list) else set()
            if given == correct:
                score += 1
        else:
            if str(user_answer).strip().lower() == str(q.correct_answer).strip().lower():
                score += 1
    percentage = round((score / total) * 100, 1) if total > 0 else 0
    return score, total, percentage


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.STUDENT, User.Role.ADMIN)
def exam_submit(request):
    serializer = ExamSubmitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    subject_name = serializer.validated_data["subject"]
    level = serializer.validated_data["level"]
    answers = serializer.validated_data["answers"]
    question_ids = serializer.validated_data.get("question_ids")
    time_spent = serializer.validated_data.get("time_spent", 0)

    try:
        subject = Subject.objects.get(name__iexact=subject_name)
    except Subject.DoesNotExist:
        return Response({"error": f"Subject '{subject_name}' not found."}, status=404)

    if question_ids:
        questions = list(ExamQuestion.objects.filter(id__in=question_ids, subject=subject, level=level))
        if len(questions) != len(question_ids):
            return Response(
                {"error": "Some question IDs are invalid or do not match this subject/level."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        questions = ExamQuestion.objects.filter(subject=subject, level=level)

    score, total, percentage = _grade_answers(questions, answers)

    result = ExamResult.objects.create(
        user=request.user,
        subject=subject,
        level=level,
        score=score,
        total=total,
        percentage=percentage,
        time_spent=time_spent,
        answers=answers,
    )

    profile, _ = StudentProfile.objects.get_or_create(user=request.user)
    if profile.registration_step < 4:
        profile.registration_step = 4
        profile.save(update_fields=["registration_step"])

    return Response(ExamResultSerializer(result).data, status=status.HTTP_201_CREATED)


# ──────────────────── Exam Results ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def exam_results(request):
    results = ExamResult.objects.filter(user=request.user).select_related("subject")
    return Response(ExamResultSerializer(results, many=True).data)


# ──────────────────── Placement ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.STUDENT, User.Role.ADMIN)
def placement(request):
    existing = PlacementResult.objects.filter(user=request.user).first()
    if existing:
        return Response(PlacementResultSerializer(existing).data)

    results = ExamResult.objects.filter(user=request.user)
    if not results.exists():
        return Response(
            {"error": "No exam results found. Please complete exams first."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    avg = results.aggregate(avg_pct=Avg("percentage"))["avg_pct"] or 0

    if avg >= 80:
        level = PlacementResult.AssignedLevel.ADVANCED
    elif avg >= 65:
        level = PlacementResult.AssignedLevel.INTERMEDIATE_II
    else:
        level = PlacementResult.AssignedLevel.BEGINNER

    selections = UserSubjectSelection.objects.filter(user=request.user).select_related("subject")
    primary_subject = selections.first().subject if selections.exists() else None

    placement_obj = PlacementResult.objects.create(
        user=request.user,
        assigned_level=level,
        primary_subject=primary_subject,
        average_percentage=round(avg, 1),
    )

    profile, _ = StudentProfile.objects.get_or_create(user=request.user)
    if profile.registration_step < 5:
        profile.registration_step = 5
        profile.save(update_fields=["registration_step"])

    return Response(PlacementResultSerializer(placement_obj).data)


# ──────────────────── Admin Test Builder ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.ADMIN)
def testbuilder_questions(request):
    """Return every published question grouped by subject → level."""
    qs = ExamQuestion.objects.select_related("subject").order_by("subject__name", "level", "order")
    grouped = {}
    for q in qs:
        key = f"{q.subject.name}__{q.level}"
        if key not in grouped:
            grouped[key] = []
        grouped[key].append({
            "id": q.id,
            "question_text": q.question_text,
            "instruction": q.instruction,
            "question_type": q.question_type,
            "options": q.options,
            "correct_answer": q.correct_answer,
            "correct_answers": q.correct_answers,
            "explanation": q.explanation,
            "order": q.order,
        })
    return Response(grouped)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.ADMIN)
def testbuilder_publish(request):
    serializer = TestBuilderPublishSerializer(data=request.data)
    if not serializer.is_valid():
        flat = _flatten_serializer_errors(serializer.errors)
        return Response(
            {"error": flat or "Invalid data. Check your questions and try again."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    subject_name = serializer.validated_data["subject"]
    levels_data = serializer.validated_data["levels"]

    try:
        subject, _ = Subject.objects.get_or_create(name=subject_name)

        created_total = 0
        with transaction.atomic():
            for level_entry in levels_data:
                lvl = level_entry["level"]
                questions = level_entry["questions"]

                ExamQuestion.objects.filter(subject=subject, level=lvl).delete()

                objs = []
                for order, q in enumerate(questions, start=1):
                    options = [o for o in q.get("options", []) if o.strip()]
                    correct_answers = [a for a in q.get("correct_answers", []) if a.strip()]
                    objs.append(ExamQuestion(
                        subject=subject,
                        level=lvl,
                        question_text=q["question_text"],
                        instruction=q.get("instruction", ""),
                        question_type=q["question_type"],
                        options=options,
                        correct_answer=q.get("correct_answer", ""),
                        correct_answers=correct_answers,
                        explanation=q.get("explanation", ""),
                        order=order,
                    ))
                ExamQuestion.objects.bulk_create(objs)
                created_total += len(objs)

        return Response(
            {"message": f"Published {created_total} questions for {subject_name}."},
            status=status.HTTP_201_CREATED,
        )
    except Exception as exc:
        return Response(
            {"error": f"Server error while publishing: {exc}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def _flatten_serializer_errors(errors, prefix=""):
    """Walk nested DRF error dicts/lists and return the first human-readable message."""
    if isinstance(errors, list):
        for i, item in enumerate(errors):
            if isinstance(item, str):
                return f"{prefix}: {item}" if prefix else item
            if isinstance(item, dict):
                result = _flatten_serializer_errors(item, f"{prefix}[{i}]")
                if result:
                    return result
    elif isinstance(errors, dict):
        for key, val in errors.items():
            new_prefix = f"{prefix}.{key}" if prefix else key
            result = _flatten_serializer_errors(val, new_prefix)
            if result:
                return result
    elif isinstance(errors, str):
        return f"{prefix}: {errors}" if prefix else errors
    return ""


# ──────────────────── Teacher Registration ────────────────────

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.TEACHER, User.Role.ADMIN)
def teacher_profile(request):
    profile, _ = TeacherProfile.objects.get_or_create(user=request.user)

    if request.method == "GET":
        return Response(TeacherProfileSerializer(profile).data)

    serializer = TeacherProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.TEACHER, User.Role.ADMIN)
def teacher_subject_select(request):
    subject_name = request.data.get("subject", "").strip()
    if not subject_name:
        return Response({"error": "Subject name is required."}, status=400)

    subject, _ = Subject.objects.get_or_create(name=subject_name)
    profile, _ = TeacherProfile.objects.get_or_create(user=request.user)
    profile.subject = subject
    if profile.registration_step < 2:
        profile.registration_step = 2
    profile.save(update_fields=["subject", "registration_step"])

    return Response({"subject": subject.name})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.TEACHER, User.Role.ADMIN)
def teacher_exam_submit(request):
    serializer = TeacherExamSubmitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    subject_name = serializer.validated_data["subject"]
    answers = serializer.validated_data["answers"]
    time_spent = serializer.validated_data.get("time_spent", 0)

    try:
        subject = Subject.objects.get(name__iexact=subject_name)
    except Subject.DoesNotExist:
        return Response({"error": f"Subject '{subject_name}' not found."}, status=404)

    questions = ExamQuestion.objects.filter(subject=subject, level="advanced")
    if not questions.exists():
        questions = ExamQuestion.objects.filter(subject=subject)

    score, total, percentage = _grade_answers(questions, answers)
    passed = percentage >= 70

    ExamResult.objects.create(
        user=request.user,
        subject=subject,
        level="advanced",
        score=score,
        total=total,
        percentage=percentage,
        time_spent=time_spent,
        answers=answers,
    )

    profile, _ = TeacherProfile.objects.get_or_create(user=request.user)
    profile.exam_passed = passed
    profile.exam_score = percentage
    if passed and profile.registration_step < 3:
        profile.registration_step = 3
    profile.save(update_fields=["exam_passed", "exam_score", "registration_step"])

    return Response({
        "passed": passed,
        "score": score,
        "total": total,
        "percentage": percentage,
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@require_role(User.Role.TEACHER, User.Role.ADMIN)
def teacher_demo_complete(request):
    profile, _ = TeacherProfile.objects.get_or_create(user=request.user)
    profile.demo_completed = True
    if profile.registration_step < 4:
        profile.registration_step = 4
    profile.save(update_fields=["demo_completed", "registration_step"])
    return Response({"message": "Demo session completed.", "demo_completed": True})
