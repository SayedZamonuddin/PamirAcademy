from django.contrib import admin
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


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ["name", "subject", "level", "teacher", "group_type", "max_members", "member_count"]
    list_filter = ["group_type", "subject", "level"]
    search_fields = ["name"]


@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ["group", "student", "joined_at"]
    list_filter = ["group"]


@admin.register(ScheduleSlot)
class ScheduleSlotAdmin(admin.ModelAdmin):
    list_display = ["user", "day_of_week", "hour", "status", "subject", "counterpart"]
    list_filter = ["day_of_week", "status"]
    search_fields = ["user__email"]


@admin.register(ScheduleChangeRequest)
class ScheduleChangeRequestAdmin(admin.ModelAdmin):
    list_display = ["student", "slot", "reason", "status", "created_at"]
    list_filter = ["status"]


@admin.register(GroupChangeRequest)
class GroupChangeRequestAdmin(admin.ModelAdmin):
    list_display = ["student", "current_group", "target_group", "reason", "status", "created_at"]
    list_filter = ["status"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["sender", "receiver", "text_short", "is_read", "created_at"]
    list_filter = ["is_read"]
    search_fields = ["sender__email", "receiver__email", "text"]

    @admin.display(description="Text")
    def text_short(self, obj):
        return obj.text[:60]


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["text_short", "audience", "created_by", "created_at"]
    list_filter = ["audience"]

    @admin.display(description="Text")
    def text_short(self, obj):
        return obj.text[:80]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["teacher", "student", "subject", "amount", "status", "date"]
    list_filter = ["status", "date"]
    search_fields = ["teacher__email", "student__email"]


@admin.register(LiveSession)
class LiveSessionAdmin(admin.ModelAdmin):
    list_display = ["teacher", "student", "subject", "topic", "scheduled_at", "status"]
    list_filter = ["status"]
    search_fields = ["teacher__email", "student__email", "topic"]
