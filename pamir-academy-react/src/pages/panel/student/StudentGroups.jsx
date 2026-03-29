import { useState } from "react";
import StudentLayout from "./StudentLayout";
import { requestGroupChange } from "../../../utils/panelApi";

const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM5MzI5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1773243906471-bd9153d1a5de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGJveSUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NDAwODY0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1660128355607-2a311a8acfa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwc3R1ZGVudCUyMGdpcmwlMjBzdHVkeWluZyUyMG5vdGVib29rfGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1767619946289-96cea6c14081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1631905131477-eefc1360588a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwdGVlbmFnZXIlMjBib3klMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDAwODY0OXww&ixlib=rb-4.1.0&q=80&w=1080",
];

const MY_GROUPS = [
  {
    id: 1,
    name: "Group A — English Elementary",
    subject: "English",
    level: "Elementary",
    teacher: "Amina Rahimi",
    schedule: "Mon, Wed, Fri — 9:00 AM",
    type: "group",
    members: [
      { name: "Ahmad Nazari", avatar: STUDENT_AVATARS[0], isYou: true },
      { name: "Fatima Karimova", avatar: STUDENT_AVATARS[2] },
      { name: "Daniyal Mirzo", avatar: STUDENT_AVATARS[1] },
      { name: "Layla Ahmadi", avatar: STUDENT_AVATARS[3] },
    ],
  },
  {
    id: 2,
    name: "Math Intermediate — Individual",
    subject: "Math",
    level: "Intermediate",
    teacher: "Dariush Karimi",
    schedule: "Tue, Thu — 11:00 AM",
    type: "individual",
    members: [
      { name: "Ahmad Nazari", avatar: STUDENT_AVATARS[0], isYou: true },
    ],
  },
  {
    id: 3,
    name: "Group B — Physics Elementary",
    subject: "Physics",
    level: "Elementary",
    teacher: "Sarah Nazari",
    schedule: "Wed, Fri — 3:00 PM",
    type: "group",
    members: [
      { name: "Ahmad Nazari", avatar: STUDENT_AVATARS[0], isYou: true },
      { name: "Omar Hassan", avatar: STUDENT_AVATARS[4] },
      { name: "Fatima Karimova", avatar: STUDENT_AVATARS[2] },
    ],
  },
];

const AVAILABLE_GROUPS = [
  { id: 101, name: "Group C — English Elementary", schedule: "Tue, Thu — 10:00 AM", teacher: "Amina Rahimi", spots: 2 },
  { id: 102, name: "Group D — English Elementary", schedule: "Mon, Wed — 2:00 PM", teacher: "Amina Rahimi", spots: 4 },
];

const CHANGE_REASONS = [
  "Schedule conflict",
  "Want to switch to individual",
  "Want to join a group",
  "Prefer a different time",
  "Other",
];

/* ---- SVG Icons ---- */
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const SwapIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function StudentGroups() {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [changeReason, setChangeReason] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const openChangeModal = (group) => {
    setSelectedGroup(group);
    setShowChangeModal(true);
    setSubmitted(false);
    setChangeReason("");
    setTargetGroup("");
    setChangeNote("");
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      await requestGroupChange(
        selectedGroup.id,
        changeReason,
        targetGroup ? parseInt(targetGroup, 10) : null,
        changeNote,
      );
    } catch { /* API may be offline */ }
  };

  return (
    <StudentLayout activePage="s-groups">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-white text-[clamp(24px,3vw,40px)] font-bold m-0">My Groups</h1>
          <p className="text-white/60 text-sm m-0 mt-1">View your study groups and request changes</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Classes", value: MY_GROUPS.length, icon: <UsersIcon/>, color: "bg-[#006236]" },
            { label: "Group Classes", value: MY_GROUPS.filter(g => g.type === "group").length, icon: <UsersIcon/>, color: "bg-blue-500" },
            { label: "Individual", value: MY_GROUPS.filter(g => g.type === "individual").length, icon: <UserIcon/>, color: "bg-amber-500" },
          ].map((card, i) => (
            <div key={i} className="bg-[#d9d9d9] rounded-2xl p-[clamp(14px,1.5vw,24px)] flex items-center gap-3">
              <div className={`${card.color} w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0`}>{card.icon}</div>
              <div>
                <p className="text-gray-500 text-xs m-0">{card.label}</p>
                <p className="text-[#006236] text-[clamp(20px,2vw,28px)] font-bold m-0">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Group Cards */}
        {MY_GROUPS.map(group => (
          <div key={group.id} className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0">{group.name}</h3>
                  <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold ${
                    group.type === "group" ? "bg-[#006236]/15 text-[#006236]" : "bg-amber-100 text-amber-600"
                  }`}>{group.type === "group" ? "Group" : "Individual"}</span>
                </div>
                <p className="text-gray-500 text-xs m-0 flex items-center gap-3">
                  <span>Teacher: {group.teacher}</span>
                  <span className="flex items-center gap-1"><ClockIcon/> {group.schedule}</span>
                </p>
              </div>
              {group.type === "group" && (
                <button onClick={() => openChangeModal(group)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#006236] text-white text-xs font-semibold border-none cursor-pointer hover:bg-[#004d2a] transition-colors">
                  <SwapIcon/> Change Group
                </button>
              )}
            </div>

            {/* Members */}
            <div className="flex flex-col gap-2">
              {group.members.map((m, idx) => (
                <div key={idx} className="bg-white rounded-xl px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#006236]">
                      <img src={m.avatar} alt={m.name} className="w-full h-full object-cover"/>
                    </div>
                    <span className="text-[#006236] font-semibold text-sm">{m.name}</span>
                  </div>
                  {m.isYou && (
                    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-semibold bg-[#006236] text-white">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Change Group Modal */}
      {showChangeModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[480px] w-full flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-[#006236] text-lg font-bold m-0">Request Group Change</h3>
              <button onClick={() => setShowChangeModal(false)} className="text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-600"><CloseIcon/></button>
            </div>

            {!submitted ? (
              <>
                <div className="bg-[#006236]/5 rounded-xl px-4 py-3">
                  <p className="text-[#006236] font-semibold text-sm m-0">Current: {selectedGroup.name}</p>
                  <p className="text-gray-500 text-xs m-0 mt-1">{selectedGroup.teacher} · {selectedGroup.schedule}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for change</label>
                  <div className="flex flex-wrap gap-2">
                    {CHANGE_REASONS.map(r => (
                      <button key={r} onClick={() => setChangeReason(r)}
                        className={`px-3.5 py-1.5 rounded-full text-sm border-none cursor-pointer transition-colors ${
                          changeReason === r ? "bg-[#006236] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}>{r}</button>
                    ))}
                  </div>
                </div>

                {AVAILABLE_GROUPS.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Available groups to switch to</label>
                    <div className="flex flex-col gap-2">
                      {AVAILABLE_GROUPS.map(ag => (
                        <div key={ag.id} onClick={() => setTargetGroup(ag.id)}
                          className={`rounded-xl px-4 py-3 cursor-pointer border-2 transition-colors ${
                            targetGroup === ag.id ? "border-[#006236] bg-[#006236]/5" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[#006236] font-semibold text-sm m-0">{ag.name}</p>
                              <p className="text-gray-400 text-xs m-0 mt-0.5">{ag.teacher} · {ag.schedule}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{ag.spots} spots left</span>
                              {targetGroup === ag.id && <span className="text-[#006236]"><CheckIcon/></span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Additional notes (optional)</label>
                  <textarea value={changeNote} onChange={e => setChangeNote(e.target.value)}
                    placeholder="Any additional details..."
                    className="w-full bg-gray-100 rounded-xl px-5 py-3 border-none outline-none text-sm text-black resize-none h-20"/>
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={() => setShowChangeModal(false)}
                    className="flex-1 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSubmit} disabled={!changeReason}
                    className={`flex-1 py-2.5 rounded-full border-none text-white cursor-pointer text-sm font-bold ${changeReason ? "bg-[#006236] hover:bg-[#004d2a]" : "bg-gray-300 cursor-default"}`}>
                    Submit Request
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-16 h-16 rounded-full bg-[#006236]/10 flex items-center justify-center text-[#006236]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-[#006236] text-lg font-bold m-0">Request Submitted</h3>
                <p className="text-gray-500 text-sm text-center m-0">Your group change request has been sent. The admin will review it and get back to you shortly.</p>
                <button onClick={() => setShowChangeModal(false)}
                  className="mt-2 px-8 py-2.5 rounded-full bg-[#006236] text-white border-none cursor-pointer text-sm font-semibold hover:bg-[#004d2a] transition-colors">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
