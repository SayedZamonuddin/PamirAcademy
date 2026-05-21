import { apiGet, apiPost, apiPatch } from "./api";

// ──── Schedule ────

export async function getMySchedule() {
  return apiGet("/schedule/");
}

export async function getScheduleChangeRequests() {
  return apiGet("/schedule/change-requests/");
}

export async function requestScheduleChange(slotId, reason, preferredTime = "", notes = "") {
  return apiPost("/schedule/change-requests/", {
    slot_id: slotId,
    reason,
    preferred_time: preferredTime,
    notes,
  });
}

// ──── Groups ────

export async function getMyGroups() {
  return apiGet("/groups/my/");
}

export async function getAvailableGroups() {
  return apiGet("/groups/available/");
}

export async function getGroupChangeRequests() {
  return apiGet("/groups/change-requests/");
}

export async function requestGroupChange(currentGroupId, reason, targetGroupId = null, notes = "") {
  return apiPost("/groups/change-requests/", {
    current_group_id: currentGroupId,
    target_group_id: targetGroupId,
    reason,
    notes,
  });
}

// ──── Messages ────

export async function getContacts() {
  return apiGet("/messages/contacts/");
}

export async function getConversation(userId) {
  return apiGet(`/messages/${userId}/`);
}

export async function sendMessage(userId, text) {
  return apiPost(`/messages/${userId}/`, { text });
}

// ──── Dashboards ────

export async function getStudentDashboard() {
  return apiGet("/dashboard/student/");
}

export async function getTeacherDashboard() {
  return apiGet("/dashboard/teacher/");
}

// ──── Student Course Catalog ────

export async function getStudentCourses() {
  return apiGet("/courses/");
}

export async function getStudentCourseDetail(courseId) {
  return apiGet(`/courses/${courseId}/`);
}

// ──── Announcements ────

export async function getAnnouncements() {
  return apiGet("/announcements/");
}

// ──── Schedule Slot Updates ────

export async function updateScheduleSlot(slotId, status) {
  return apiPatch(`/schedule/${slotId}/`, { status });
}

export async function setAvailability(slots) {
  return apiPost("/schedule/set-availability/", { slots });
}

// ──── Teacher Stats & Payments ────

export async function getTeacherStats() {
  return apiGet("/teacher/stats/");
}

export async function getTeacherPayments() {
  return apiGet("/teacher/payments/");
}

// ──── Live Sessions ────

export async function getMySessions() {
  return apiGet("/sessions/");
}

export async function updateSessionStatus(sessionId, status) {
  return apiPatch(`/sessions/${sessionId}/`, { status });
}

// ──── Admin ────

export async function getAdminDashboard() {
  return apiGet("/dashboard/admin/");
}

export async function getAdminSchedule() {
  return apiGet("/admin/schedule/");
}

export async function getAdminStatistics() {
  return apiGet("/admin/statistics/");
}

export async function adminTeacherDecision(teacherId, decision) {
  return apiPost(`/admin/teacher/${teacherId}/decision/`, { decision });
}
