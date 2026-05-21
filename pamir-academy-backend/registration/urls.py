from django.urls import path
from . import views

urlpatterns = [
    # Reference data
    path("subjects/", views.subject_list, name="reg-subjects"),

    # Admin test-builder
    path("admin/testbuilder/questions/", views.testbuilder_questions, name="reg-testbuilder-questions"),
    path("admin/testbuilder/publish/", views.testbuilder_publish, name="reg-testbuilder-publish"),

    # Student registration flow
    path("student/personal-info/", views.student_personal_info, name="reg-student-personal-info"),
    path("student/subjects/", views.student_subjects, name="reg-student-subjects"),
    path("exam/questions/<str:subject_name>/<str:level>/", views.exam_questions, name="reg-exam-questions"),
    path("exam/submit/", views.exam_submit, name="reg-exam-submit"),
    path("exam/results/", views.exam_results, name="reg-exam-results"),
    path("placement/", views.placement, name="reg-placement"),

    # Teacher registration flow
    path("teacher/profile/", views.teacher_profile, name="reg-teacher-profile"),
    path("teacher/subject/", views.teacher_subject_select, name="reg-teacher-subject"),
    path("teacher/exam/submit/", views.teacher_exam_submit, name="reg-teacher-exam-submit"),
    path("teacher/demo/complete/", views.teacher_demo_complete, name="reg-teacher-demo-complete"),
]
