from django.urls import path
from . import views

urlpatterns = [
    # Schedule
    path("schedule/", views.my_schedule, name="panel-schedule"),
    path("schedule/change-requests/", views.schedule_change_requests, name="panel-schedule-change-requests"),

    # Groups
    path("groups/my/", views.my_groups, name="panel-my-groups"),
    path("groups/available/", views.available_groups, name="panel-available-groups"),
    path("groups/change-requests/", views.group_change_requests, name="panel-group-change-requests"),

    # Messages
    path("messages/contacts/", views.contacts, name="panel-contacts"),
    path("messages/<int:user_id>/", views.conversation, name="panel-conversation"),

    # Dashboard summaries
    path("dashboard/student/", views.student_dashboard_summary, name="panel-student-dashboard"),
    path("dashboard/teacher/", views.teacher_dashboard_summary, name="panel-teacher-dashboard"),
]
