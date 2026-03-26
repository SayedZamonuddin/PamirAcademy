import { useState } from "react";
import StudentLayout from "./StudentLayout";

/* ---- Data ---- */
const WEEK_DATES = [
  { day: "Mon", date: "Mar 16" },
  { day: "Tue", date: "Mar 17" },
  { day: "Wed", date: "Mar 18" },
  { day: "Thu", date: "Mar 19" },
  { day: "Fri", date: "Mar 20" },
  { day: "Sat", date: "Mar 21" },
  { day: "Sun", date: "Mar 22" },
];

const HOURS = Array.from({ length: 13 }, (_, i) => {
  const h = i + 8;
  return `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;
});

const MY_CLASSES = {
  "0-1": { subject: "English", teacher: "Amina Rahimi", level: "Elementary" },
  "0-5": { subject: "Math", teacher: "Dariush Karimi", level: "Intermediate" },
  "2-1": { subject: "English", teacher: "Amina Rahimi", level: "Elementary" },
  "2-7": { subject: "Physics", teacher: "Sarah Nazari", level: "Elementary" },
  "3-3": { subject: "Math", teacher: "Dariush Karimi", level: "Intermediate" },
  "4-1": { subject: "English", teacher: "Amina Rahimi", level: "Elementary" },
  "4-5": { subject: "Physics", teacher: "Sarah Nazari", level: "Elementary" },
};

const SUBJECT_COLORS = {
  English: "bg-[#006236]",
  Math: "bg-blue-500",
  Physics: "bg-amber-500",
};

const CHANGE_REASONS = [
  "Time conflict with another class",
  "Personal obligation / appointment",
  "Health reasons",
  "Time zone change",
  "Other",
];

/* ---- SVG Icons ---- */
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function StudentSchedule() {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeTarget, setChangeTarget] = useState(null);
  const [changeReason, setChangeReason] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalClasses = Object.keys(MY_CLASSES).length;

  const subjectCounts = {};
  Object.values(MY_CLASSES).forEach(cls => {
    subjectCounts[cls.subject] = (subjectCounts[cls.subject] || 0) + 1;
  });

  const openChangeRequest = (key) => {
    setChangeTarget({ key, ...MY_CLASSES[key] });
    const [di, hi] = key.split("-").map(Number);
    setPreferredTime(`${WEEK_DATES[di].day} ${HOURS[hi]}`);
    setShowChangeModal(true);
    setSubmitted(false);
    setChangeReason("");
    setChangeNote("");
  };

  const handleSubmitChange = () => {
    setSubmitted(true);
  };

  return (
    <StudentLayout activePage="s-schedule">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white text-[clamp(24px,3vw,40px)] font-bold m-0">My Schedule</h1>
            <p className="text-white/60 text-sm m-0 mt-1">View your weekly classes and request changes</p>
          </div>
        </div>

        {/* Stats + Legend */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="bg-[#006236] rounded-xl px-5 py-3 flex items-center gap-2">
            <span className="text-white/70 text-sm">Total classes / week:</span>
            <span className="text-white font-bold text-lg">{totalClasses}</span>
          </div>
          <div className="flex items-center gap-4 ml-auto flex-wrap">
            {Object.entries(SUBJECT_COLORS).map(([subj, color]) => (
              <div key={subj} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded ${color}`}/>
                <span className="text-white text-[clamp(11px,1vw,14px)] whitespace-nowrap">{subj} ({subjectCounts[subj] || 0})</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-[#e5e5e5]"/>
              <span className="text-white text-[clamp(11px,1vw,14px)]">Free</span>
            </div>
          </div>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setWeekOffset(w => w - 1)} className="w-8 h-8 rounded-full bg-[#006236] text-white flex items-center justify-center border-none cursor-pointer hover:bg-[#004d2a] transition-colors"><ChevronLeft/></button>
          <span className="text-white text-[clamp(16px,1.8vw,22px)] font-semibold">March 16 — 22, 2026</span>
          <button onClick={() => setWeekOffset(w => w + 1)} className="w-8 h-8 rounded-full bg-[#006236] text-white flex items-center justify-center border-none cursor-pointer hover:bg-[#004d2a] transition-colors"><ChevronRight/></button>
        </div>

        {/* Schedule Grid */}
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(8px,2vw,20px)] overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: "3px", minWidth: "650px" }}>
            <thead>
              <tr>
                <th className="p-2 text-[#006236] text-[clamp(11px,1vw,14px)] text-left w-[80px]"><ClockIcon/></th>
                {WEEK_DATES.map(wd => (
                  <th key={wd.day} className="p-2 text-center">
                    <div className="text-[#006236] text-[clamp(12px,1.1vw,15px)] font-bold">{wd.day}</div>
                    <div className="text-gray-500 text-[clamp(10px,0.9vw,12px)]">{wd.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour, hi) => (
                <tr key={hi}>
                  <td className="px-2 py-1 text-[#006236] text-[clamp(10px,0.9vw,13px)] font-semibold whitespace-nowrap">{hour}</td>
                  {WEEK_DATES.map((_, di) => {
                    const key = `${di}-${hi}`;
                    const cls = MY_CLASSES[key];
                    return (
                      <td key={key} className="p-0.5 relative"
                        onMouseEnter={() => setHoveredSlot(key)}
                        onMouseLeave={() => setHoveredSlot(null)}>
                        <div
                          onClick={cls ? () => openChangeRequest(key) : undefined}
                          className={`${cls ? SUBJECT_COLORS[cls.subject] || "bg-[#006236]" : "bg-[#e5e5e5]"} rounded-md h-[clamp(28px,3.5vw,40px)] w-full transition-colors flex items-center justify-center ${cls ? "cursor-pointer hover:opacity-80" : ""}`}>
                          {cls && (
                            <span className="text-white text-[clamp(8px,0.7vw,10px)] font-semibold truncate px-1">{cls.subject}</span>
                          )}
                        </div>
                        {hoveredSlot === key && cls && (
                          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#006236] text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                            <div className="font-bold">{cls.subject} — {cls.level}</div>
                            <div className="text-white/70">{cls.teacher}</div>
                            <div className="text-white/70">{hour}</div>
                            <div className="text-white/50 mt-1 text-[10px]">Click to request change</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#006236]"/>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,2vw,28px)]">
          <h3 className="text-[#006236] text-[clamp(16px,1.6vw,22px)] font-bold m-0 mb-4">This Week's Classes</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(MY_CLASSES).map(([key, cls]) => {
              const [di, hi] = key.split("-").map(Number);
              return (
                <div key={key} className="bg-white rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${SUBJECT_COLORS[cls.subject]} flex items-center justify-center text-white font-bold text-sm`}>
                      {cls.subject[0]}
                    </div>
                    <div>
                      <p className="text-[#006236] font-semibold text-sm m-0">{cls.subject} — {cls.level}</p>
                      <p className="text-gray-400 text-xs m-0">{cls.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#006236] text-sm font-semibold flex items-center gap-1"><ClockIcon/> {HOURS[hi]}</span>
                    <span className="text-gray-400 text-xs">{WEEK_DATES[di]?.day}, {WEEK_DATES[di]?.date}</span>
                    <button onClick={() => openChangeRequest(key)}
                      className="px-3 py-1.5 rounded-full bg-[#006236]/10 text-[#006236] text-xs font-semibold border-none cursor-pointer hover:bg-[#006236]/20 transition-colors flex items-center gap-1">
                      <EditIcon/> Request Change
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schedule Change Request Modal */}
      {showChangeModal && changeTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[480px] w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[#006236] text-lg font-bold m-0">Request Schedule Change</h3>
              <button onClick={() => setShowChangeModal(false)} className="text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-600"><CloseIcon/></button>
            </div>

            {!submitted ? (
              <>
                <div className="bg-[#006236]/5 rounded-xl px-4 py-3">
                  <p className="text-[#006236] font-semibold text-sm m-0">{changeTarget.subject} — {changeTarget.level}</p>
                  <p className="text-gray-500 text-xs m-0 mt-1">{changeTarget.teacher} · Current time: {preferredTime}</p>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred new time (optional)</label>
                  <input type="text" value={preferredTime} onChange={e => setPreferredTime(e.target.value)}
                    placeholder="e.g. Tue 2:00 PM"
                    className="w-full bg-gray-100 rounded-full px-5 py-3 border-none outline-none text-sm text-black"/>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Additional notes (optional)</label>
                  <textarea value={changeNote} onChange={e => setChangeNote(e.target.value)}
                    placeholder="Any additional details..."
                    className="w-full bg-gray-100 rounded-xl px-5 py-3 border-none outline-none text-sm text-black resize-none h-20"/>
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={() => setShowChangeModal(false)}
                    className="flex-1 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSubmitChange} disabled={!changeReason}
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
                <p className="text-gray-500 text-sm text-center m-0">Your schedule change request has been sent to the admin. You will be notified once it's processed.</p>
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
