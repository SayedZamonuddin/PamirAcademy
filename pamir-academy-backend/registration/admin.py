from django.contrib import admin
from .models import (
    Subject,
    StudentProfile,
    TeacherProfile,
    UserSubjectSelection,
    ExamQuestion,
    ExamResult,
    PlacementResult,
)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "first_name", "last_name", "registration_step", "created_at"]
    list_filter = ["registration_step", "gender"]
    search_fields = ["user__email", "first_name", "last_name"]


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "first_name", "last_name", "subject", "exam_passed", "demo_completed", "registration_step"]
    list_filter = ["exam_passed", "demo_completed", "registration_step"]
    search_fields = ["user__email", "first_name", "last_name"]


@admin.register(UserSubjectSelection)
class UserSubjectSelectionAdmin(admin.ModelAdmin):
    list_display = ["user", "subject"]
    list_filter = ["subject"]


@admin.register(ExamQuestion)
class ExamQuestionAdmin(admin.ModelAdmin):
    list_display = ["subject", "level", "question_type", "question_text_short", "order"]
    list_filter = ["subject", "level", "question_type"]
    search_fields = ["question_text"]

    @admin.display(description="Question")
    def question_text_short(self, obj):
        return obj.question_text[:80]


@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ["user", "subject", "level", "score", "total", "percentage", "submitted_at"]
    list_filter = ["subject", "level"]
    search_fields = ["user__email"]


@admin.register(PlacementResult)
class PlacementResultAdmin(admin.ModelAdmin):
    list_display = ["user", "assigned_level", "primary_subject", "average_percentage", "created_at"]
    list_filter = ["assigned_level"]
