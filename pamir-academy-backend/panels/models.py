from django.conf import settings
from django.db import models


class Group(models.Model):
    class GroupType(models.TextChoices):
        GROUP = "group", "Group"
        INDIVIDUAL = "individual", "Individual"

    name = models.CharField(max_length=200)
    subject = models.ForeignKey(
        "registration.Subject", on_delete=models.CASCADE, related_name="groups"
    )
    level = models.CharField(max_length=30, blank=True)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="taught_groups",
    )
    schedule_description = models.CharField(max_length=200, blank=True)
    group_type = models.CharField(max_length=12, choices=GroupType.choices, default=GroupType.GROUP)
    max_members = models.PositiveSmallIntegerField(default=6)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.memberships.count()

    @property
    def spots_left(self):
        return max(0, self.max_members - self.member_count)


class GroupMembership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="memberships")
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_memberships"
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["group", "student"]
        ordering = ["joined_at"]

    def __str__(self):
        return f"{self.student.email} in {self.group.name}"


class ScheduleSlot(models.Model):
    class DayOfWeek(models.IntegerChoices):
        MON = 0, "Monday"
        TUE = 1, "Tuesday"
        WED = 2, "Wednesday"
        THU = 3, "Thursday"
        FRI = 4, "Friday"
        SAT = 5, "Saturday"
        SUN = 6, "Sunday"

    class Status(models.TextChoices):
        BOOKED = "booked", "Booked"
        AVAILABLE = "available", "Available"
        UNAVAILABLE = "unavailable", "Unavailable"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="schedule_slots"
    )
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    hour = models.PositiveSmallIntegerField(help_text="0-23, the starting hour of the slot")
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.UNAVAILABLE)
    subject = models.ForeignKey(
        "registration.Subject", on_delete=models.SET_NULL, null=True, blank=True
    )
    counterpart = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="counterpart_slots",
        help_text="The teacher (for students) or student (for teachers) in this slot",
    )
    level = models.CharField(max_length=30, blank=True)

    class Meta:
        unique_together = ["user", "day_of_week", "hour"]
        ordering = ["day_of_week", "hour"]

    def __str__(self):
        day = self.get_day_of_week_display()
        return f"{self.user.email} — {day} {self.hour}:00 ({self.status})"


class ScheduleChangeRequest(models.Model):
    class RequestStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        DENIED = "denied", "Denied"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="schedule_change_requests"
    )
    slot = models.ForeignKey(ScheduleSlot, on_delete=models.CASCADE, related_name="change_requests")
    reason = models.CharField(max_length=200)
    preferred_time = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=10, choices=RequestStatus.choices, default=RequestStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Schedule change: {self.student.email} — {self.status}"


class GroupChangeRequest(models.Model):
    class RequestStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        DENIED = "denied", "Denied"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_change_requests"
    )
    current_group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="outgoing_requests"
    )
    target_group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="incoming_requests"
    )
    reason = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=10, choices=RequestStatus.choices, default=RequestStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Group change: {self.student.email} — {self.current_group.name} → {self.status}"


class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages"
    )
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.email} → {self.receiver.email}: {self.text[:50]}"
