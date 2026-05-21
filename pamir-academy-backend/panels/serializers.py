from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import (
    Group,
    GroupMembership,
    ScheduleSlot,
    ScheduleChangeRequest,
    GroupChangeRequest,
    Message,
    Announcement,
    Payment,
    LiveSession,
)

User = get_user_model()


class GroupMemberSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source="student.email", read_only=True)
    display_name = serializers.CharField(source="student.display_name", read_only=True)

    class Meta:
        model = GroupMembership
        fields = ["email", "display_name", "joined_at"]


class GroupSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.display_name", read_only=True)
    teacher_email = serializers.CharField(source="teacher.email", read_only=True)
    members = GroupMemberSerializer(source="memberships", many=True, read_only=True)
    member_count = serializers.IntegerField(read_only=True)
    spots_left = serializers.IntegerField(read_only=True)

    class Meta:
        model = Group
        fields = [
            "id", "name", "subject_name", "level", "teacher_name", "teacher_email",
            "schedule_description", "group_type", "max_members",
            "member_count", "spots_left", "members",
        ]


class GroupListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing available groups (no members)."""
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.display_name", read_only=True)
    spots_left = serializers.IntegerField(read_only=True)

    class Meta:
        model = Group
        fields = [
            "id", "name", "subject_name", "level", "teacher_name",
            "schedule_description", "group_type", "spots_left",
        ]


class ScheduleSlotSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source="get_day_of_week_display", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True, default="")
    counterpart_name = serializers.CharField(source="counterpart.display_name", read_only=True, default="")
    counterpart_email = serializers.CharField(source="counterpart.email", read_only=True, default="")

    class Meta:
        model = ScheduleSlot
        fields = [
            "id", "day_of_week", "day_name", "hour", "status",
            "subject_name", "counterpart_name", "counterpart_email", "level",
        ]


class ScheduleChangeRequestCreateSerializer(serializers.Serializer):
    slot_id = serializers.IntegerField()
    reason = serializers.CharField(max_length=200)
    preferred_time = serializers.CharField(max_length=100, required=False, default="")
    notes = serializers.CharField(required=False, default="")


class ScheduleChangeRequestSerializer(serializers.ModelSerializer):
    slot_info = ScheduleSlotSerializer(source="slot", read_only=True)

    class Meta:
        model = ScheduleChangeRequest
        fields = ["id", "slot_info", "reason", "preferred_time", "notes", "status", "created_at"]


class GroupChangeRequestCreateSerializer(serializers.Serializer):
    current_group_id = serializers.IntegerField()
    target_group_id = serializers.IntegerField(required=False, allow_null=True, default=None)
    reason = serializers.CharField(max_length=200)
    notes = serializers.CharField(required=False, default="")


class GroupChangeRequestSerializer(serializers.ModelSerializer):
    current_group_name = serializers.CharField(source="current_group.name", read_only=True)
    target_group_name = serializers.CharField(source="target_group.name", read_only=True, default="")

    class Meta:
        model = GroupChangeRequest
        fields = [
            "id", "current_group_name", "target_group_name",
            "reason", "notes", "status", "created_at",
        ]


class ContactSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    display_name = serializers.CharField()
    role = serializers.CharField()
    last_message = serializers.CharField(allow_blank=True)
    last_message_time = serializers.DateTimeField(allow_null=True)
    unread_count = serializers.IntegerField()


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.email", read_only=True)
    sender_name = serializers.CharField(source="sender.display_name", read_only=True)
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "sender_email", "sender_name", "text", "is_read", "created_at", "is_mine"]

    def get_is_mine(self, obj):
        request = self.context.get("request")
        return request and obj.sender_id == request.user.id


class MessageCreateSerializer(serializers.Serializer):
    text = serializers.CharField(min_length=1)


class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.display_name", read_only=True, default="")

    class Meta:
        model = Announcement
        fields = ["id", "text", "audience", "created_by_name", "created_at"]


class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.display_name", read_only=True, default="")
    subject_name = serializers.CharField(source="subject.name", read_only=True, default="")

    class Meta:
        model = Payment
        fields = [
            "id", "date", "student_name", "subject_name", "level",
            "sessions", "rate", "amount", "status", "method",
        ]


class LiveSessionSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.display_name", read_only=True, default="")
    student_name = serializers.CharField(source="student.display_name", read_only=True, default="")
    subject_name = serializers.CharField(source="subject.name", read_only=True, default="")

    class Meta:
        model = LiveSession
        fields = [
            "id", "teacher_name", "student_name", "subject_name",
            "topic", "scheduled_at", "duration_minutes", "status", "notes", "created_at",
            "room_id",
        ]
