import { useState, useEffect, useRef } from "react";
import StudentLayout from "./StudentLayout";

const TEACHER_IMG = "https://images.unsplash.com/photo-1726618069974-c1d5d27f612b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGZlbWFsZSUyMHRlYWNoZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQwMDg2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080";
const STUDENT_IMG = "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM5MzI5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080";

/* ---- SVG Icons ---- */
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const CameraOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/></svg>;
const MicIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>;
const MicOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>;
const ScreenShareIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/><path d="M12 8l-4 4h3v4h2v-4h3z"/></svg>;
const EndCallIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>;
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const SESSION = {
  teacher: "Amina Rahimi",
  subject: "English",
  level: "Elementary",
  topic: "Past Simple Tense",
  duration: 60,
};

const INITIAL_MESSAGES = [
  { id: 1, sender: "Teacher", text: "Good morning Ahmad! Ready for today's lesson?", isStudent: false, time: "10:00 AM" },
  { id: 2, sender: "You", text: "Good morning teacher! Yes, I did the homework too.", isStudent: true, time: "10:01 AM" },
  { id: 3, sender: "Teacher", text: "Great! Let's start with a quick review of yesterday's vocabulary.", isStudent: false, time: "10:02 AM" },
];

const SHARED_NOTES_INITIAL = "Past Simple Tense — Key Rules\n\nRegular verbs: add -ed\n  walk → walked\n  play → played\n\nIrregular verbs:\n  go → went\n  eat → ate\n  see → saw\n\nNegatives: did not + base form\n  I did not walk → I didn't walk";

export default function StudentLiveSession() {
  const [sessionState, setSessionState] = useState("lobby");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [showEndModal, setShowEndModal] = useState(false);
  const [sharedNotes] = useState(SHARED_NOTES_INITIAL);
  const chatEndRef = useRef(null);

  const totalTime = SESSION.duration * 60;

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const timeRemaining = totalTime - timeElapsed;
  const progress = (timeElapsed / totalTime) * 100;

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), sender: "You", text: inputText.trim(), isStudent: true, time: timeStr }]);
    setInputText("");
    setTimeout(() => {
      const replies = ["Good job!", "Let's move on to the next exercise.", "Can you try that again?", "Exactly right!", "Remember the rule we discussed."];
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "Teacher", text: replies[Math.floor(Math.random() * replies.length)], isStudent: false, time: t }]);
    }, 2500);
  };

  const CONTROLS = [
    { icon: cameraOn ? <CameraIcon/> : <CameraOffIcon/>, bg: cameraOn ? "bg-white/20" : "bg-[#c51310]", label: "Camera", onClick: () => setCameraOn(!cameraOn) },
    { icon: micOn ? <MicIcon/> : <MicOffIcon/>, bg: micOn ? "bg-white/20" : "bg-[#c51310]", label: "Mic", onClick: () => setMicOn(!micOn) },
    { icon: <ScreenShareIcon/>, bg: "bg-white/20", label: "Share Screen", onClick: () => {} },
    { icon: <EndCallIcon/>, bg: "bg-[#c51310]", label: "Leave", onClick: () => setShowEndModal(true) },
  ];

  const BREADCRUMBS = [SESSION.subject, SESSION.level, SESSION.topic];

  return (
    <StudentLayout activePage="s-live">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Breadcrumb */}
        <div className="mx-[clamp(12px,2vw,24px)] mt-[clamp(12px,2vw,24px)] bg-[#006236] rounded-full py-2.5 px-[clamp(16px,2vw,32px)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white text-[clamp(12px,1.2vw,16px)] font-semibold">Live Session</span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="#fff" className="opacity-60"><path d="M0 0 L8 4 L0 8 Z"/></svg>
            {BREADCRUMBS.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span className="text-white text-[clamp(12px,1.2vw,16px)]">{crumb}</span>
                {idx < BREADCRUMBS.length - 1 && <svg width="8" height="8" viewBox="0 0 8 8" fill="#fff" className="opacity-60"><path d="M0 0 L8 4 L0 8 Z"/></svg>}
              </span>
            ))}
          </div>
          {sessionState === "live" && (
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c51310] animate-pulse inline-block"/>
              <span className="text-white text-[clamp(11px,1vw,14px)] font-semibold">LIVE</span>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="flex-1 p-[clamp(12px,2vw,24px)] grid gap-[clamp(12px,1.5vw,20px)] overflow-hidden" style={{ gridTemplateColumns: "minmax(300px, 1.5fr) minmax(240px, 1fr)", gridTemplateRows: "1fr" }}>

          {/* LEFT: Video */}
          <div className="flex flex-col gap-[clamp(10px,1.5vw,16px)] overflow-hidden">

            {/* Lobby */}
            {sessionState === "lobby" && (
              <div className="flex-1 bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #006236 1px, transparent 1px), radial-gradient(circle at 75% 75%, #006236 1px, transparent 1px)", backgroundSize: "40px 40px" }}/>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-[#006236] overflow-hidden">
                    <img src={TEACHER_IMG} alt="Teacher" className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold m-0">{SESSION.teacher}</h3>
                    <p className="text-gray-400 text-sm m-0">{SESSION.subject} — {SESSION.level}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-6 py-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Topic:</span> {SESSION.topic}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Duration:</span> {SESSION.duration} minutes
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-[#006236] font-semibold">Time:</span> 10:00 AM — 11:00 AM
                    </div>
                  </div>
                  <button onClick={() => setSessionState("live")}
                    className="mt-2 flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer text-base font-bold tracking-wider hover:bg-[#004d2a] transition-colors hover:scale-[1.03]">
                    <CameraIcon /> Join Session
                  </button>
                </div>
              </div>
            )}

            {/* Live */}
            {sessionState === "live" && (
              <>
                <div className="flex-1 bg-[#1a1a1a] rounded-2xl relative overflow-hidden min-h-[clamp(220px,30vw,400px)]">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <div className="bg-[#c51310] text-white px-2 py-1 rounded-full text-[clamp(10px,0.9vw,12px)] font-semibold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse inline-block"/>LIVE
                    </div>
                    <div className="bg-[#006236] text-white px-4 py-1.5 rounded-full text-[clamp(12px,1.1vw,16px)] font-semibold flex items-center gap-1.5">
                      <ClockIcon /> {formatTime(timeRemaining)}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 z-10 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006236]"/>
                    {SESSION.teacher} — Teacher
                  </div>
                  <img src={TEACHER_IMG} alt="Teacher" className="absolute inset-0 w-full h-full object-cover"/>
                  <div className="absolute bottom-16 right-3 w-[clamp(80px,10vw,140px)] h-[clamp(60px,7.5vw,105px)] rounded-xl overflow-hidden border-2 border-[#006236] z-10 shadow-lg">
                    {cameraOn ? (
                      <img src={STUDENT_IMG} alt="You" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-lg font-bold">AN</div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[clamp(9px,0.7vw,11px)] text-center py-0.5">You</div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-[clamp(6px,1.2vw,14px)] p-3 z-10" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
                    {CONTROLS.map(c => (
                      <button key={c.label} title={c.label} onClick={c.onClick}
                        className={`${c.bg} w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] rounded-full border-none cursor-pointer flex items-center justify-center hover:scale-110 transition-transform`}>
                        {c.icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-[#d9d9d9] rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
                  <span className="text-[#006236] text-xs font-semibold whitespace-nowrap">{formatTime(timeElapsed)}</span>
                  <div className="flex-1 h-2.5 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006236] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}/>
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${timeRemaining < 300 ? "text-[#c51310]" : "text-gray-500"}`}>{formatTime(timeRemaining)}</span>
                </div>
              </>
            )}

            {/* Ended */}
            {sessionState === "ended" && (
              <div className="flex-1 bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#006236] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-white text-2xl font-bold m-0">Session Complete</h3>
                <p className="text-gray-400 text-sm m-0 max-w-[400px] leading-relaxed">
                  Great work! Your session with {SESSION.teacher} has ended.
                </p>
                <div className="bg-white/10 rounded-xl px-6 py-4 flex flex-col gap-1.5 w-full max-w-[300px]">
                  <div className="flex justify-between text-gray-300 text-sm"><span>Teacher:</span><span className="text-white font-semibold">{SESSION.teacher}</span></div>
                  <div className="flex justify-between text-gray-300 text-sm"><span>Duration:</span><span className="text-white font-semibold">{formatTime(timeElapsed)}</span></div>
                  <div className="flex justify-between text-gray-300 text-sm"><span>Topic:</span><span className="text-white font-semibold">{SESSION.topic}</span></div>
                </div>
                <button onClick={() => { setSessionState("lobby"); setTimeElapsed(0); }}
                  className="bg-[#006236] text-white px-6 py-2.5 rounded-full border-none cursor-pointer text-sm font-semibold hover:bg-[#004d2a] transition-colors">
                  Back to Lobby
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Chat / Notes */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl bg-[#d9d9d9]">
            <div className="flex border-b-2 border-[#006236]/15 bg-[#d9d9d9] shrink-0">
              {[{ key: "chat", label: "Chat" }, { key: "notes", label: "Shared Notes" }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 text-[clamp(11px,1vw,14px)] cursor-pointer border-none transition-colors ${
                    activeTab === tab.key ? "bg-white text-[#006236] font-semibold" : "bg-transparent text-gray-500 hover:text-[#006236]"
                  }`}>{tab.label}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-[clamp(14px,2vw,24px)] flex flex-col">
              {activeTab === "chat" && (
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isStudent ? "items-end" : "items-start"}`}>
                        <span className="text-gray-400 text-[10px] mb-0.5 px-1">{msg.time}</span>
                        <div className={`${
                          msg.isStudent
                            ? "bg-[#006236] rounded-[20px_20px_4px_20px]"
                            : "bg-[#7d807f] rounded-[20px_20px_20px_4px]"
                        } text-white px-4 py-2.5 text-[clamp(13px,1.1vw,15px)] max-w-[85%]`}>
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
                      className="flex-1 border-none outline-none bg-transparent text-sm text-black"/>
                    <button onClick={sendMessage} className="bg-transparent border-none cursor-pointer flex items-center p-1"><SendIcon/></button>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="flex flex-col gap-3 h-full">
                  <h3 className="text-[#006236] font-bold text-sm m-0">Shared Notes from Teacher</h3>
                  <div className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-[#006236]/20 bg-white text-sm text-gray-700 whitespace-pre-wrap leading-relaxed overflow-y-auto font-mono">
                    {sharedNotes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave session modal */}
        {showEndModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full flex flex-col gap-4 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#c51310]/10 flex items-center justify-center mx-auto text-[#c51310]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-gray-900 text-lg font-bold m-0">Leave Session?</h3>
              <p className="text-gray-500 text-sm m-0">There are still <strong className="text-[#c51310]">{formatTime(timeRemaining)}</strong> remaining in this session.</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowEndModal(false)} className="flex-1 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={() => { setSessionState("ended"); setShowEndModal(false); }} className="flex-1 py-2.5 rounded-full border-none bg-[#c51310] text-white cursor-pointer text-sm font-bold hover:bg-[#a00f0d]">Leave</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
