from rest_framework import serializers
from .models import (
    Subject,
    StudentProfile,
    TeacherProfile,
    UserSubjectSelection,
    ExamQuestion,
    ExamResult,
    PlacementResult,
)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name"]


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = [
            "first_name", "last_name", "gender", "birth_date",
            "whatsapp", "timezone", "location", "photo", "registration_step",
        ]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if instance.registration_step < 2:
            instance.registration_step = 2
        instance.save()
        return instance


class TeacherProfileSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = TeacherProfile
        fields = [
            "first_name", "last_name", "subject", "subject_name",
            "exam_passed", "exam_score", "demo_completed", "registration_step",
        ]
        read_only_fields = ["exam_passed", "exam_score", "demo_completed"]


class SubjectSelectionSerializer(serializers.Serializer):
    subjects = serializers.ListField(
        child=serializers.CharField(max_length=50),
        min_length=1,
        help_text="List of subject names",
    )


class ExamQuestionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = ExamQuestion
        fields = [
            "id", "subject_name", "level", "question_text", "instruction",
            "question_type", "options", "order",
        ]


class ExamSubmitSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=50)
    level = serializers.ChoiceField(choices=ExamQuestion.Level.choices)
    answers = serializers.DictField(help_text="Question ID → answer")
    time_spent = serializers.IntegerField(min_value=0, default=0)


class ExamResultSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)

    class Meta:
        model = ExamResult
        fields = [
            "id", "subject_name", "level", "score", "total",
            "percentage", "time_spent", "submitted_at",
        ]


class PlacementResultSerializer(serializers.ModelSerializer):
    primary_subject_name = serializers.CharField(source="primary_subject.name", read_only=True)

    class Meta:
        model = PlacementResult
        fields = [
            "assigned_level", "primary_subject_name", "average_percentage", "created_at",
        ]


class TeacherExamSubmitSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=50)
    answers = serializers.DictField(help_text="Question ID → answer")
    time_spent = serializers.IntegerField(min_value=0, default=0)
