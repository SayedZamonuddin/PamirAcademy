import { apiGet, apiPost } from "./api";

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
