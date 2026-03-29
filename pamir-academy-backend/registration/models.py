from django.conf import settings
from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile"
    )
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    timezone = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to="student_photos/", blank=True)
    registration_step = models.PositiveSmallIntegerField(
        default=1,
        help_text="1=personal_info, 2=subjects, 3=exam, 4=placement, 5=complete",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.email})"


class TeacherProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="teacher_profile"
    )
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    subject = models.ForeignKey(
        Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name="teachers"
    )
    exam_passed = models.BooleanField(default=False)
    exam_score = models.FloatField(null=True, blank=True)
    demo_completed = models.BooleanField(default=False)
    registration_step = models.PositiveSmallIntegerField(
        default=1,
        help_text="1=subjects, 2=exam, 3=demo, 4=complete",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.email})"


class UserSubjectSelection(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subject_selections"
    )
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="selections")

    class Meta:
        unique_together = ["user", "subject"]
        ordering = ["subject__name"]

    def __str__(self):
        return f"{self.user.email} → {self.subject.name}"


class ExamQuestion(models.Model):
    class QuestionType(models.TextChoices):
        RADIO = "radio", "Radio (single choice)"
        CHECKBOX = "checkbox", "Checkbox (multiple choice)"
        SELECT = "select", "Select (dropdown)"
        TEXT = "text", "Text (free input)"

    class Level(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="questions")
    level = models.CharField(max_length=15, choices=Level.choices)
    question_text = models.TextField()
    instruction = models.TextField(blank=True)
    question_type = models.CharField(max_length=10, choices=QuestionType.choices)
    options = models.JSONField(default=list, blank=True, help_text="List of option strings")
    correct_answer = models.CharField(max_length=500, blank=True)
    correct_answers = models.JSONField(default=list, blank=True, help_text="For checkbox type")
    explanation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["subject", "level", "order"]

    def __str__(self):
        return f"[{self.subject.name}/{self.level}] {self.question_text[:60]}"


class ExamResult(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="exam_results"
    )
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    level = models.CharField(max_length=15, choices=ExamQuestion.Level.choices)
    score = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    percentage = models.FloatField(default=0)
    time_spent = models.PositiveIntegerField(default=0, help_text="Seconds")
    answers = models.JSONField(default=dict, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.user.email} — {self.subject.name}/{self.level}: {self.percentage}%"


class PlacementResult(models.Model):
    class AssignedLevel(models.TextChoices):
        BEGINNER = "Beginner", "Beginner"
        INTERMEDIATE_I = "Intermediate I", "Intermediate I"
        INTERMEDIATE_II = "Intermediate II", "Intermediate II"
        ADVANCED = "Advanced", "Advanced"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="placement"
    )
    assigned_level = models.CharField(max_length=20, choices=AssignedLevel.choices)
    primary_subject = models.ForeignKey(
        Subject, on_delete=models.SET_NULL, null=True, blank=True
    )
    average_percentage = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} → {self.assigned_level}"
