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
)


# ──────────────────── Subjects ────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def subject_list(request):
    subjects = Subject.objects.all()
    return Response(SubjectSerializer(subjects, many=True).data)


# ──────────────────── Student Personal Info ────────────────────

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
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

    questions = ExamQuestion.objects.filter(subject=subject, level=level.lower())
    if not questions.exists():
        return Response({"error": f"No questions for {subject_name}/{level}."}, status=404)

    return Response(ExamQuestionSerializer(questions, many=True).data)


# ──────────────────── Exam Submit ────────────────────

def _grade_answers(questions, answers_dict):
    score = 0
    total = questions.count()
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
def exam_submit(request):
    serializer = ExamSubmitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    subject_name = serializer.validated_data["subject"]
    level = serializer.validated_data["level"]
    answers = serializer.validated_data["answers"]
    time_spent = serializer.validated_data.get("time_spent", 0)

    try:
        subject = Subject.objects.get(name__iexact=subject_name)
    except Subject.DoesNotExist:
        return Response({"error": f"Subject '{subject_name}' not found."}, status=404)

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
    elif avg >= 50:
        level = PlacementResult.AssignedLevel.INTERMEDIATE_I
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


# ──────────────────── Teacher Registration ────────────────────

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
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
def teacher_demo_complete(request):
    profile, _ = TeacherProfile.objects.get_or_create(user=request.user)
    profile.demo_completed = True
    if profile.registration_step < 4:
        profile.registration_step = 4
    profile.save(update_fields=["demo_completed", "registration_step"])
    return Response({"message": "Demo session completed.", "demo_completed": True})
