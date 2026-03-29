import { useState, useEffect, useRef } from "react";
import { completeTeacherDemo } from "../../../utils/registrationApi";

/* ---- Images ---- */
const TEACHER_IMG = "https://images.unsplash.com/photo-1713946598534-c5523c97ba60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0ZWFjaGVyJTIwd2ViY2FtJTIwvidZWQlMjBjYWxsJTIwbGFwdG9wfGVufDF8fHx8MTc3NDAwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const PROCTOR_IMG = "https://images.unsplash.com/photo-1581595220975-119360b1c63f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwcm9jdG9yJTIwZXhhbWluZXIlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NDAwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080";

/* ---- Inline SVG Icons ---- */
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const CameraOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/></svg>;
const MicIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>;
const MicOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>;
const ScreenShareIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/><path d="M12 8l-4 4h3v4h2v-4h3z"/></svg>;
const EndCallIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>;
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const CheckCircleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const CircleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const NoteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const AlertIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const HandIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v1M14 10V4a2 2 0 0 0-4 0v6M10 10V5a2 2 0 0 0-4 0v9"/><path d="M18 11a2 2 0 0 1 4 0v5a8 8 0 0 1-8 8h-2c-2.76 0-5.26-1.12-7.07-2.93L2 18.14"/></svg>;
const FullscreenIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;

/* ---- Session data ---- */
const SESSION_INFO = {
  subject: "English",
  level: "Elementary",
  topic: "Past Simple",
  subtopic: "Grammar",
  proctorName: "Sarah Johnson",
  proctorTitle: "Senior Proctor",
  scheduledTime: "10:00 AM – 10:40 AM",
  date: "March 20, 2026",
};

const LESSON_PLAN = {
  title: "Past Simple — Demo Lesson",
  objectives: [
    "Explain regular and irregular past simple verb forms",
    "Demonstrate engaging teaching methodology",
    "Conduct interactive exercises with students",
    "Assign and explain home tasks clearly",
  ],
  sections: [
    {
      heading: "Introduction (5 min)",
      content: "Greet the student. Briefly introduce the topic and its importance. Ask warm-up questions like 'What did you do yesterday?' to naturally introduce past simple.",
      visibility: "teacher",
    },
    {
      heading: "Rules & Explanation (10 min)",
      content: "Regular verbs: add -ed (walk → walked, play → played). Spelling rules: consonant doubling (stop → stopped), -e ending (live → lived), -y ending (study → studied). Irregular verbs: memorize forms (go → went, eat → ate, see → saw). Negative: didn't + base form. Questions: Did + subject + base form?",
      visibility: "both",
    },
    {
      heading: "Interactive Exercises (15 min)",
      content: "Exercise 1: Fill in the blanks with correct past simple form. Exercise 2: Multiple choice — choose the correct sentence. Exercise 3: True/False statements about a short passage. Exercise 4: Ask students to form their own sentences.",
      visibility: "teacher",
    },
    {
      heading: "Home Task (5 min)",
      content: "Write 10 sentences using past simple tense about your weekend activities. Include at least 3 irregular verbs.",
      visibility: "both",
    },
    {
      heading: "Wrap-up (5 min)",
      content: "Quick recap of key points. Ask if there are any questions. Thank the student and provide encouragement.",
      visibility: "teacher",
    },
  ],
};

const PREPARATION_CHECKLIST = [
  { id: "c1", text: "Test your camera and microphone" },
  { id: "c2", text: "Have your lesson plan ready" },
  { id: "c3", text: "Prepare any materials or slides" },
  { id: "c4", text: "Find a quiet, well-lit space" },
  { id: "c5", text: "Close unnecessary applications" },
  { id: "c6", text: "Have a glass of water nearby" },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: "Proctor", text: "Good morning! I'm Sarah, your proctor for today's demo session.", isProctor: true, time: "10:00 AM" },
  { id: 2, sender: "You", text: "Good morning, Sarah! I'm ready to begin.", isProctor: false, time: "10:01 AM" },
  { id: 3, sender: "Proctor", text: "Great! Please start whenever you're comfortable. I'll be observing and taking notes.", isProctor: true, time: "10:01 AM" },
];

/* ============================================================
   Session Status
   ============================================================ */
const SESSION_STATES = {
  waiting: { label: "Waiting to Start", color: "bg-amber-500", pulse: true },
  connecting: { label: "Connecting...", color: "bg-blue-500", pulse: true },
  live: { label: "Live Session", color: "bg-[#c51310]", pulse: true },
  ended: { label: "Session Ended", color: "bg-gray-500", pulse: false },
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function DemoSession() {
  const [sessionState, setSessionState] = useState("waiting");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalTime] = useState(40 * 60); // 40 minutes
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [checklist, setChecklist] = useState(PREPARATION_CHECKLIST.map(c => ({ ...c, done: false })));
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("plan"); // plan | chat | notes | checklist
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const chatEndRef = useRef(null);

  // Timer
  useEffect(() => {
    if (sessionState !== "live") return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= totalTime) { clearInterval(timer); setSessionState("ended"); return totalTime; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionState, totalTime]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const timeRemaining = totalTime - timeElapsed;
  const progress = (timeElapsed / totalTime) * 100;

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), sender: "You", text: inputText.trim(), isProctor: false, time: timeStr }]);
    setInputText("");
    // Simulate proctor response
    setTimeout(() => {
      const responses = [
        "Noted, please continue.",
        "Good approach! Keep going.",
        "I see, that's an interesting method.",
        "Thank you for clarifying.",
        "Please proceed to the next section.",
      ];
      const resp = responses[Math.floor(Math.random() * responses.length)];
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "Proctor", text: resp, isProctor: true, time: t }]);
    }, 2000);
  };

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const startSession = () => {
    setSessionState("connecting");
    setTimeout(() => setSessionState("live"), 2000);
  };

  const endSession = async () => {
    setSessionState("ended");
    setShowEndConfirm(false);
    try { await completeTeacherDemo(); } catch { /* API may be offline */ }
  };

  const allChecked = checklist.every(c => c.done);
  const statusInfo = SESSION_STATES[sessionState];
  const BREADCRUMBS = ["Demo", SESSION_INFO.subject, SESSION_INFO.level, SESSION_INFO.subtopic, SESSION_INFO.topic];

  const CONTROLS = [
    { icon: cameraOn ? <CameraIcon/> : <CameraOffIcon/>, bg: cameraOn ? "bg-white/20" : "bg-[#c51310]", label: "Camera", onClick: () => setCameraOn(!cameraOn) },
    { icon: micOn ? <MicIcon/> : <MicOffIcon/>, bg: micOn ? "bg-white/20" : "bg-[#c51310]", label: "Mic", onClick: () => setMicOn(!micOn) },
    { icon: <ScreenShareIcon/>, bg: "bg-white/20", label: "Screen Share", onClick: () => {} },
    { icon: <HandIcon/>, bg: handRaised ? "bg-amber-500" : "bg-white/20", label: "Raise Hand", onClick: () => setHandRaised(!handRaised) },
    { icon: <FullscreenIcon/>, bg: "bg-white/20", label: "Fullscreen", onClick: () => {} },
    { icon: <EndCallIcon/>, bg: "bg-[#c51310]", label: "End", onClick: () => setShowEndConfirm(true) },
  ];

  const TAB_ITEMS = [
    { key: "plan", label: "Lesson Plan", icon: <NoteIcon/> },
    { key: "chat", label: "Chat", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { key: "notes", label: "My Notes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { key: "checklist", label: "Checklist", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  ];

  return (
    <div className="font-['Nunito_Sans'] w-screen min-h-screen flex flex-col bg-[#a7a7a7] overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[60px] flex items-center">
          <img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" />
        </div>
        <button className="bg-[#006236] text-white px-8 py-2.5 rounded-full border-none cursor-pointer tracking-wider">LOGIN</button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ---- BREADCRUMB + STATUS ---- */}
        <div className="mx-[clamp(12px,2vw,24px)] mt-[clamp(12px,2vw,24px)] bg-[#006236] rounded-full py-2.5 px-[clamp(16px,2vw,32px)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {BREADCRUMBS.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="text-white text-[clamp(12px,1.2vw,16px)] whitespace-nowrap">{crumb}</span>
                {idx < BREADCRUMBS.length - 1 && <svg width="8" height="8" viewBox="0 0 8 8" fill="#fff" className="opacity-60"><path d="M0 0 L8 4 L0 8 Z"/></svg>}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className={`${statusInfo.color} h-2.5 w-2.5 rounded-full inline-block ${statusInfo.pulse ? "animate-pulse" : ""}`}/>
            <span className="text-white text-[clamp(11px,1vw,14px)] font-semibold">{statusInfo.label}</span>
          </div>
        </div>

        {/* ---- MAIN GRID ---- */}
        <div className="flex-1 p-[clamp(12px,2vw,24px)] grid gap-[clamp(12px,1.5vw,20px)] overflow-hidden" style={{ gridTemplateColumns: "minmax(280px, 1fr) minmax(320px, 1.6fr)", gridTemplateRows: "1fr" }}>

          {/* ===== LEFT PANEL: Tabs ===== */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl bg-[#d9d9d9]">
            {/* Tab bar */}
            <div className="flex border-b-2 border-[#006236]/15 bg-[#d9d9d9] shrink-0">
              {TAB_ITEMS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1 py-3 text-[clamp(10px,1vw,13px)] cursor-pointer border-none transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-[#006236] font-semibold border-b-2 border-[#006236]"
                      : "bg-transparent text-gray-500 hover:text-[#006236]"
                  }`}>
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-[clamp(14px,2vw,24px)]">

              {/* --- LESSON PLAN TAB --- */}
              {activeTab === "plan" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-[#006236] text-[clamp(18px,2vw,26px)] font-bold text-center m-0 pb-3 border-b-2 border-[#006236]/20">
                    {LESSON_PLAN.title}
                  </h2>
                  {/* Objectives */}
                  <div className="bg-[#006236]/10 rounded-xl p-3">
                    <h4 className="text-[#006236] text-sm font-bold m-0 mb-2">Learning Objectives</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
                      {LESSON_PLAN.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 text-[clamp(12px,1.1vw,14px)]">
                          <span className="text-[#006236] mt-0.5 shrink-0">•</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Sections */}
                  {LESSON_PLAN.sections.map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <h3 className="text-[#006236] text-[clamp(14px,1.4vw,18px)] font-bold m-0">{section.heading}</h3>
                      <p className="text-gray-700 text-[clamp(12px,1.1vw,15px)] m-0 leading-relaxed">{section.content}</p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[clamp(10px,0.9vw,12px)] self-start ${
                        section.visibility === "teacher" ? "bg-[#c51310]/10 text-[#c51310]" : "bg-[#006236]/10 text-[#006236]"
                      }`}>
                        {section.visibility === "teacher" ? <LockIcon/> : <EyeIcon/>}
                        <span>{section.visibility === "teacher" ? "Only you can see" : "Visible to proctor"}</span>
                      </div>
                      {idx < LESSON_PLAN.sections.length - 1 && <div className="h-px bg-[#006236]/15 mt-1"/>}
                    </div>
                  ))}
                </div>
              )}

              {/* --- CHAT TAB --- */}
              {activeTab === "chat" && (
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isProctor ? "items-start" : "items-end"}`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-gray-500 text-[clamp(10px,0.9vw,12px)]">{msg.sender}</span>
                          <span className="text-gray-400 text-[clamp(9px,0.8vw,11px)]">{msg.time}</span>
                        </div>
                        <div className={`${msg.isProctor
                          ? "bg-[#006236] rounded-[20px_20px_20px_4px]"
                          : "bg-[#7d807f] rounded-[20px_20px_4px_20px]"
                        } text-white px-4 py-2.5 text-[clamp(13px,1.1vw,16px)] max-w-[85%]`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef}/>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full py-2 pr-3 pl-5 shrink-0 border border-[#006236]/20">
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                      placeholder="Type a message..."
                      className="flex-1 border-none outline-none bg-transparent text-[clamp(13px,1.1vw,16px)] text-black"/>
                    <button onClick={sendMessage} className="bg-transparent border-none cursor-pointer flex items-center p-1"><SendIcon/></button>
                  </div>
                </div>
              )}

              {/* --- NOTES TAB --- */}
              {activeTab === "notes" && (
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex items-center gap-2 text-[#006236]">
                    <NoteIcon/>
                    <h3 className="m-0 text-sm font-bold">Personal Notes</h3>
                  </div>
                  <p className="text-gray-400 text-xs m-0">These notes are private and only visible to you. Use them to jot down reminders during the session.</p>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 resize-none min-h-[200px] transition-colors"
                    placeholder="Take notes during your demo session...&#10;&#10;• Things to remember&#10;• Proctor feedback&#10;• Areas to improve"/>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{notes.length} characters</span>
                    <button onClick={() => { localStorage.setItem("demoSessionNotes", notes); }}
                      className="px-4 py-1.5 rounded-full bg-[#006236] text-white text-xs cursor-pointer border-none hover:bg-[#004d2a] transition-colors">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {/* --- CHECKLIST TAB --- */}
              {activeTab === "checklist" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="m-0 text-[#006236] text-sm font-bold">Pre-Session Checklist</h3>
                    <span className="text-xs text-gray-400">{checklist.filter(c => c.done).length}/{checklist.length} done</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006236] rounded-full transition-all duration-300"
                      style={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    {checklist.map(item => (
                      <button key={item.id} onClick={() => toggleChecklist(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-none text-left transition-colors ${
                          item.done ? "bg-[#006236]/10" : "bg-white hover:bg-gray-50"
                        }`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          item.done ? "bg-[#006236] text-white" : "border-2 border-gray-300"
                        }`}>
                          {item.done && <CheckCircleIcon/>}
                        </span>
                        <span className={`text-[clamp(13px,1.1vw,15px)] ${item.done ? "text-[#006236] line-through opacity-70" : "text-gray-700"}`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                  {allChecked && (
                    <div className="bg-[#006236]/10 border border-[#006236]/20 rounded-xl p-3 text-center text-[#006236] text-sm font-semibold flex items-center justify-center gap-2">
                      <CheckCircleIcon/> All set! You're ready for your demo session.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===== RIGHT PANEL: Video + Info ===== */}
          <div className="flex flex-col gap-[clamp(10px,1.5vw,16px)] overflow-hidden">

            {/* --- Waiting / Pre-session view --- */}
            {sessionState === "waiting" && (
              <div className="flex-1 bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #006236 1px, transparent 1px), radial-gradient(circle at 75% 75%, #006236 1px, transparent 1px)", backgroundSize: "40px 40px" }}/>

                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-[#006236] overflow-hidden">
                    <img src={PROCTOR_IMG} alt="Proctor" className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold m-0">{SESSION_INFO.proctorName}</h3>
                    <p className="text-gray-400 text-sm m-0">{SESSION_INFO.proctorTitle}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-6 py-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Subject:</span> {SESSION_INFO.subject} — {SESSION_INFO.level}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Topic:</span> {SESSION_INFO.subtopic} — {SESSION_INFO.topic}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Date:</span> {SESSION_INFO.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Time:</span> {SESSION_INFO.scheduledTime}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Duration:</span> 40 minutes
                    </div>
                  </div>

                  <button onClick={startSession}
                    className="mt-2 flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer text-base font-bold tracking-wider hover:bg-[#004d2a] transition-colors hover:scale-[1.03]">
                    <CameraIcon/> Join Session
                  </button>
                  <p className="text-gray-500 text-xs m-0 flex items-center gap-1"><AlertIcon/> Make sure your camera and microphone are working before joining.</p>
                </div>
              </div>
            )}

            {/* --- Connecting view --- */}
            {sessionState === "connecting" && (
              <div className="flex-1 bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-16 h-16 rounded-full border-4 border-[#006236] border-t-transparent animate-spin"/>
                <h3 className="text-white text-xl font-bold m-0">Connecting to session...</h3>
                <p className="text-gray-400 text-sm m-0">Please wait while we connect you with your proctor.</p>
              </div>
            )}

            {/* --- Live session view --- */}
            {sessionState === "live" && (
              <>
                {/* Video area */}
                <div className="flex-1 bg-[#1a1a1a] rounded-2xl relative overflow-hidden min-h-[clamp(220px,30vw,400px)]">
                  {/* Timer badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <div className="bg-[#c51310] text-white px-2 py-1 rounded-full text-[clamp(10px,0.9vw,12px)] font-semibold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse inline-block"/>
                      LIVE
                    </div>
                    <div className="bg-[#006236] text-white px-4 py-1.5 rounded-full text-[clamp(12px,1.1vw,16px)] font-semibold flex items-center gap-1.5">
                      <ClockIcon/> {formatTime(timeRemaining)}
                    </div>
                  </div>

                  {/* Hand raised indicator */}
                  {handRaised && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 animate-bounce">
                      ✋ Hand Raised
                    </div>
                  )}

                  {/* Main video feed — teacher */}
                  {cameraOn ? (
                    <img src={TEACHER_IMG} alt="Your camera" className="absolute inset-0 w-full h-full object-cover"/>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                      <div className="w-20 h-20 rounded-full bg-[#006236] flex items-center justify-center text-white text-3xl font-bold">T</div>
                      <p className="text-gray-400 text-sm mt-3">Camera is off</p>
                    </div>
                  )}

                  {/* Proctor PiP */}
                  <div className="absolute bottom-16 left-3 w-[clamp(80px,10vw,140px)] h-[clamp(60px,7.5vw,105px)] rounded-xl overflow-hidden border-2 border-[#006236] z-10 shadow-lg">
                    <img src={PROCTOR_IMG} alt="Proctor" className="w-full h-full object-cover"/>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[clamp(9px,0.7vw,11px)] text-center py-0.5 truncate px-1">
                      {SESSION_INFO.proctorName}
                    </div>
                  </div>

                  {/* Controls bar */}
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-[clamp(6px,1.2vw,14px)] p-3 z-10" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
                    {CONTROLS.map(c => (
                      <button key={c.label} title={c.label} onClick={c.onClick}
                        className={`${c.bg} w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] rounded-full border-none cursor-pointer flex items-center justify-center hover:scale-110 transition-transform`}>
                        {c.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session progress bar */}
                <div className="bg-[#d9d9d9] rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
                  <span className="text-[#006236] text-xs font-semibold whitespace-nowrap">{formatTime(timeElapsed)}</span>
                  <div className="flex-1 h-2.5 bg-gray-300 rounded-full overflow-hidden relative">
                    <div className="h-full bg-[#006236] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}/>
                    {/* Warning zone */}
                    {progress > 75 && <div className="absolute right-0 top-0 h-full w-[25%] bg-amber-400/30 rounded-r-full"/>}
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${timeRemaining < 300 ? "text-[#c51310]" : "text-gray-500"}`}>{formatTime(timeRemaining)}</span>
                </div>
              </>
            )}

            {/* --- Session ended view --- */}
            {sessionState === "ended" && (
              <div className="flex-1 bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#006236] flex items-center justify-center">
                  <CheckCircleIcon/>
                </div>
                <h3 className="text-white text-2xl font-bold m-0">Demo Session Complete</h3>
                <p className="text-gray-400 text-sm m-0 max-w-[400px] leading-relaxed">
                  Thank you for completing your demo session! The proctor will review your performance and you will be notified of the result shortly.
                </p>
                <div className="bg-white/10 rounded-xl px-6 py-4 flex flex-col gap-1.5 w-full max-w-[300px]">
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Duration:</span>
                    <span className="text-white font-semibold">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Subject:</span>
                    <span className="text-white font-semibold">{SESSION_INFO.subject}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Topic:</span>
                    <span className="text-white font-semibold">{SESSION_INFO.topic}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>Status:</span>
                    <span className="text-amber-400 font-semibold">Awaiting Review</span>
                  </div>
                </div>
                <button onClick={() => { setSessionState("waiting"); setTimeElapsed(0); }}
                  className="mt-2 bg-[#006236] text-white px-6 py-2.5 rounded-full border-none cursor-pointer text-sm font-semibold hover:bg-[#004d2a] transition-colors">
                  Back to Lobby
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---- END CALL CONFIRMATION MODAL ---- */}
        {showEndConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full flex flex-col gap-4 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#c51310]/10 flex items-center justify-center mx-auto text-[#c51310]">
                <AlertIcon/>
              </div>
              <h3 className="text-gray-900 text-lg font-bold m-0">End Demo Session?</h3>
              <p className="text-gray-500 text-sm m-0">
                Are you sure you want to end this session? You still have <strong className="text-[#c51310]">{formatTime(timeRemaining)}</strong> remaining. This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={endSession}
                  className="flex-1 py-2.5 rounded-full border-none bg-[#c51310] text-white cursor-pointer text-sm font-bold hover:bg-[#a00f0d] transition-colors">
                  End Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- BOTTOM INFO BAR (live only) ---- */}
        {sessionState === "live" && (
          <div className="mx-[clamp(12px,2vw,24px)] mb-[clamp(12px,2vw,24px)] bg-[#006236]/10 border-2 border-[#006236]/20 rounded-2xl px-[clamp(16px,2vw,32px)] py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-[#006236] text-sm">
              <AlertIcon/>
              <span>Your proctor <strong>{SESSION_INFO.proctorName}</strong> is observing. Teach naturally and follow your lesson plan.</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${cameraOn ? "bg-[#006236]" : "bg-[#c51310]"}`}/>
                Camera {cameraOn ? "On" : "Off"}
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${micOn ? "bg-[#006236]" : "bg-[#c51310]"}`}/>
                Mic {micOn ? "On" : "Off"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}