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

export async function getExamQuestions(subjectName, level) {
  return apiGet(`/registration/exam/questions/${encodeURIComponent(subjectName)}/${level}/`);
}

export async function submitExam(subject, level, answers, timeSpent) {
  return apiPost("/registration/exam/submit/", { subject, level, answers, time_spent: timeSpent });
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
