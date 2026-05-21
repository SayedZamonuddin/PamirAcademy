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

    # Admin course builder
    path("admin/coursebuilder/courses/", views.coursebuilder_courses, name="panel-coursebuilder-courses"),
    path("admin/coursebuilder/publish/", views.coursebuilder_publish, name="panel-coursebuilder-publish"),

    # Student course catalog
    path("courses/", views.student_courses, name="panel-student-courses"),
    path("courses/<int:course_id>/", views.student_course_detail, name="panel-student-course-detail"),

    # Announcements
    path("announcements/", views.announcements, name="panel-announcements"),

    # Schedule slot update & availability
    path("schedule/<int:slot_id>/", views.update_schedule_slot, name="panel-update-slot"),
    path("schedule/set-availability/", views.set_availability, name="panel-set-availability"),

    # Teacher stats & payments
    path("teacher/stats/", views.teacher_stats, name="panel-teacher-stats"),
    path("teacher/payments/", views.teacher_payments, name="panel-teacher-payments"),

    # Live sessions
    path("sessions/", views.my_sessions, name="panel-sessions"),
    path("sessions/<int:session_id>/", views.update_session_status, name="panel-update-session"),

    # Admin
    path("dashboard/admin/", views.admin_dashboard_summary, name="panel-admin-dashboard"),
    path("admin/schedule/", views.admin_schedule_overview, name="panel-admin-schedule"),
    path("admin/statistics/", views.admin_statistics, name="panel-admin-statistics"),
    path("admin/teacher/<int:teacher_id>/decision/", views.admin_teacher_decision, name="panel-admin-teacher-decision"),
]
