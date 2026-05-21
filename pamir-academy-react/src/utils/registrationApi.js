import { apiGet, apiPost, apiPut } from "./api";

export async function getSubjects() {
  return apiGet("/registration/subjects/");
}

// ──── Student Registration ────

export async function getStudentProfile() {
  return apiGet("/registration/student/personal-info/");
}

export async function saveStudentProfile(data) {
  return apiPut("/registration/student/personal-info/", data);
}

export async function getStudentSubjects() {
  return apiGet("/registration/student/subjects/");
}

export async function saveStudentSubjects(subjectNames) {
  return apiPost("/registration/student/subjects/", { subjects: subjectNames });
}

export async function getExamQuestions(subjectName, level, { limit, random } = {}) {
  let url = `/registration/exam/questions/${encodeURIComponent(subjectName)}/${level}/`;
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  if (random) params.set("random", "true");
  const qs = params.toString();
  if (qs) url += `?${qs}`;
  return apiGet(url);
}

export async function submitExam(subject, level, answers, timeSpent, questionIds) {
  const body = { subject, level, answers, time_spent: timeSpent };
  if (questionIds) body.question_ids = questionIds;
  return apiPost("/registration/exam/submit/", body);
}

export async function getExamResults() {
  return apiGet("/registration/exam/results/");
}

export async function getPlacement() {
  return apiGet("/registration/placement/");
}

// ──── Teacher Registration ────

export async function getTeacherProfile() {
  return apiGet("/registration/teacher/profile/");
}

export async function saveTeacherProfile(data) {
  return apiPut("/registration/teacher/profile/", data);
}

export async function saveTeacherSubject(subjectName) {
  return apiPost("/registration/teacher/subject/", { subject: subjectName });
}

export async function submitTeacherExam(subject, answers, timeSpent) {
  return apiPost("/registration/teacher/exam/submit/", {
    subject,
    answers,
    time_spent: timeSpent,
  });
}

export async function completeTeacherDemo() {
  return apiPost("/registration/teacher/demo/complete/", {});
}

// ──── Admin Test Builder ────

export async function getTestBuilderQuestions() {
  return apiGet("/registration/admin/testbuilder/questions/");
}

export async function publishTestBuilder(payload) {
  return apiPost("/registration/admin/testbuilder/publish/", payload);
}

// ──── Admin Course Builder ────

export async function getCourseBuilderCourses() {
  return apiGet("/admin/coursebuilder/courses/");
}

export async function publishCourse(payload) {
  return apiPost("/admin/coursebuilder/publish/", payload);
}
