import { useState, useEffect, useRef } from "react";
import TeacherLayout from "./TeacherLayout";
import { getMySessions, updateSessionStatus } from "../../../utils/panelApi";
import { createPeerConnection, getLocalStream, getScreenStream, replaceTrack } from "../../../utils/webrtc";
import { connectSignaling } from "../../../utils/signaling";

/* ---- SVG Icons ---- */
const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const CameraOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/></svg>;
const MicIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>;
const MicOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>;
const ScreenShareIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/><path d="M12 8l-4 4h3v4h2v-4h3z"/></svg>;
const EndCallIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>;
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const WhiteboardIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h4"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

export default function TeacherLiveSession() {
  const [sessionApiData, setSessionApiData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const sessions = await getMySessions();
        if (sessions.length > 0) setSessionApiData(sessions[0]);
      } catch { /* use fallback */ }
    })();
  }, []);

  const SESSION = {
    subject: sessionApiData?.subject_name || "English",
    topic: sessionApiData?.topic || "Live Session",
    duration: sessionApiData?.duration_minutes || 60,
  };

  const LESSON_PLAN = sessionApiData?.notes ? [
    { heading: "Session Notes", content: sessionApiData.notes, visibility: "both" },
  ] : [
    { heading: "No lesson plan loaded", content: "Create session notes via the admin panel.", visibility: "teacher" },
  ];

  const [sessionState, setSessionState] = useState("lobby"); // lobby | live | ended
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("plan"); // plan | chat | whiteboard
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const chatEndRef = useRef(null);

  // WebRTC refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const signalingRef = useRef(null);
  const localStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);

  const totalTime = SESSION.duration * 60;

  useEffect(() => {
    if (sessionState !== "live") return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= totalTime) { clearInterval(timer); return totalTime; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionState, totalTime]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pcRef.current?.close();
      signalingRef.current?.close();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const timeRemaining = totalTime - timeElapsed;
  const progress = (timeElapsed / totalTime) * 100;

  const handleSignalingMessage = async (msg) => {
    if (msg.type === "peer-joined") {
      // Student joined — create offer
      const pc = createPeerConnection(
        (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        },
        (candidate) => {
          signalingRef.current?.send({ type: "ice-candidate", candidate });
        }
      );
      pcRef.current = pc;
      localStreamRef.current?.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      signalingRef.current?.send({ type: "offer", sdp: offer.sdp });

    } else if (msg.type === "answer") {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: msg.sdp }));

    } else if (msg.type === "ice-candidate" && msg.candidate) {
      await pcRef.current?.addIceCandidate(new RTCIceCandidate(msg.candidate));

    } else if (msg.type === "peer-left") {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    }
  };

  const startSession = async () => {
    setSessionState("live");
    try {
      const stream = await getLocalStream();
      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0];
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const roomId = sessionApiData?.room_id;
      if (!roomId) return;

      const signaling = connectSignaling(roomId, handleSignalingMessage);
      signalingRef.current = signaling;
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  const toggleScreenShare = async () => {
    if (!pcRef.current) return;
    try {
      const screenStream = await getScreenStream();
      const screenTrack = screenStream.getVideoTracks()[0];
      replaceTrack(pcRef.current, screenTrack, "video");
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;

      screenTrack.onended = () => {
        // Restore camera when user stops sharing
        if (cameraTrackRef.current) {
          replaceTrack(pcRef.current, cameraTrackRef.current, "video");
          if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        }
      };
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  const endSession = async () => {
    pcRef.current?.close();
    signalingRef.current?.close();
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current = null;
    signalingRef.current = null;
    setSessionState("ended");
    setShowEndModal(false);
    if (sessionApiData?.id) {
      try { await updateSessionStatus(sessionApiData.id, "ended"); } catch {}
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), sender: "You", text: inputText.trim(), isTeacher: true, time: timeStr }]);
    setInputText("");
  };

  const CONTROLS = [
    { icon: cameraOn ? <CameraIcon/> : <CameraOffIcon/>, bg: cameraOn ? "bg-white/20" : "bg-[#c51310]", label: "Camera", onClick: toggleCamera },
    { icon: micOn ? <MicIcon/> : <MicOffIcon/>, bg: micOn ? "bg-white/20" : "bg-[#c51310]", label: "Mic", onClick: toggleMic },
    { icon: <ScreenShareIcon/>, bg: "bg-white/20", label: "Share Screen", onClick: toggleScreenShare },
    { icon: <WhiteboardIcon/>, bg: "bg-white/20", label: "Whiteboard", onClick: () => setActiveTab("whiteboard") },
    { icon: <EndCallIcon/>, bg: "bg-[#c51310]", label: "End", onClick: () => setShowEndModal(true) },
  ];

  return (
    <TeacherLayout activePage="t-live">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Breadcrumb */}
        <div className="mx-[clamp(12px,2vw,24px)] mt-[clamp(12px,2vw,24px)] bg-[#006236] rounded-full py-2.5 px-[clamp(16px,2vw,32px)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white text-[clamp(12px,1.2vw,16px)] font-semibold">
              Live Session — {SESSION.topic}
            </span>
          </div>
          {sessionState === "live" && (
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c51310] animate-pulse inline-block"/>
              <span className="text-white text-[clamp(11px,1vw,14px)] font-semibold">LIVE</span>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="flex-1 p-[clamp(12px,2vw,24px)] grid gap-[clamp(12px,1.5vw,20px)] overflow-hidden" style={{ gridTemplateColumns: "minmax(260px, 1fr) minmax(300px, 1.5fr)", gridTemplateRows: "1fr" }}>

          {/* ---- LEFT: Lesson plan / Chat / Whiteboard ---- */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl bg-[#f4f6f5] border border-[#006236]/10">
            {/* Tabs */}
            <div className="flex border-b-2 border-[#006236]/15 bg-[#f4f6f5] shrink-0">
              {[
                { key: "plan", label: "Lesson Plan" },
                { key: "chat", label: "Chat" },
                { key: "whiteboard", label: "Whiteboard" },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 text-[clamp(11px,1vw,14px)] cursor-pointer border-none transition-colors ${
                    activeTab === tab.key ? "bg-white text-[#006236] font-semibold" : "bg-transparent text-gray-500 hover:text-[#006236]"
                  }`}>{tab.label}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-[clamp(14px,2vw,24px)]">
              {/* Lesson Plan */}
              {activeTab === "plan" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-[#006236] text-[clamp(18px,2vw,24px)] font-bold text-center m-0 pb-3 border-b-2 border-[#006236]/20">{SESSION.topic}</h2>
                  {LESSON_PLAN.map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <h3 className="text-[#006236] text-[clamp(13px,1.3vw,17px)] font-bold m-0">{section.heading}</h3>
                      <p className="text-gray-700 text-[clamp(12px,1.1vw,14px)] m-0 leading-relaxed">{section.content}</p>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[clamp(10px,0.9vw,12px)] self-start ${
                        section.visibility === "teacher" ? "bg-[#c51310]/10 text-[#c51310]" : "bg-[#006236]/10 text-[#006236]"
                      }`}>
                        {section.visibility === "teacher" ? <LockIcon/> : <EyeIcon/>}
                        <span>{section.visibility === "teacher" ? "Only you" : "Shared with student"}</span>
                      </div>
                      {idx < LESSON_PLAN.length - 1 && <div className="h-px bg-[#006236]/15 mt-1"/>}
                    </div>
                  ))}
                </div>
              )}

              {/* Chat */}
              {activeTab === "chat" && (
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isTeacher ? "items-end" : "items-start"}`}>
                        <span className="text-gray-400 text-[10px] mb-0.5 px-1">{msg.time}</span>
                        <div className={`${msg.isTeacher ? "bg-[#006236] rounded-[20px_20px_4px_20px]" : "bg-[#7d807f] rounded-[20px_20px_20px_4px]"} text-white px-4 py-2.5 text-[clamp(13px,1.1vw,15px)] max-w-[85%]`}>
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

              {/* Whiteboard */}
              {activeTab === "whiteboard" && (
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#006236] font-bold text-sm m-0">Shared Whiteboard</h3>
                    <button onClick={() => setSessionNotes("")} className="text-xs text-[#c51310] bg-[#c51310]/10 px-3 py-1 rounded-full cursor-pointer border-none hover:bg-[#c51310]/20">Clear</button>
                  </div>
                  <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)}
                    className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 resize-none min-h-[300px] transition-colors font-mono"
                    placeholder={"Write notes, examples, or explanations here...\n\nBoth you and the student can see this.\n\nExamples:\n  walk → walked\n  go → went\n  eat → ate"}/>
                </div>
              )}
            </div>
          </div>

          {/* ---- RIGHT: Video ---- */}
          <div className="flex flex-col gap-[clamp(10px,1.5vw,16px)] overflow-hidden">

            {/* Lobby */}
            {sessionState === "lobby" && (
              <div className="flex-1 bg-white border border-[#006236]/10 rounded-2xl flex flex-col items-center justify-center gap-6 p-8 text-center">
                <h2 className="text-[#006236] text-[clamp(20px,2.2vw,26px)] font-bold m-0">Ready to start</h2>
                <div className="flex flex-col gap-2 text-gray-700 text-[clamp(13px,1.2vw,16px)]">
                  <p className="m-0"><span className="text-[#006236] font-semibold">Topic:</span> {SESSION.topic}</p>
                  <p className="m-0"><span className="text-[#006236] font-semibold">Duration:</span> {SESSION.duration} minutes</p>
                </div>
                <button onClick={startSession}
                  className="mt-1 flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer text-base font-bold tracking-wider hover:bg-[#004d2a] transition-colors hover:scale-[1.03]">
                  <CameraIcon/> Start Session
                </button>
              </div>
            )}

            {/* Live */}
            {sessionState === "live" && (
              <>
                <div className="flex-1 bg-[#1a1a1a] rounded-2xl relative overflow-hidden min-h-[clamp(220px,30vw,400px)]">
                  {/* Timer */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <div className="bg-[#c51310] text-white px-2 py-1 rounded-full text-[clamp(10px,0.9vw,12px)] font-semibold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse inline-block"/>LIVE
                    </div>
                    <div className="bg-[#006236] text-white px-4 py-1.5 rounded-full text-[clamp(12px,1.1vw,16px)] font-semibold flex items-center gap-1.5">
                      <ClockIcon/> {formatTime(timeRemaining)}
                    </div>
                  </div>

                  {/* Session topic */}
                  <div className="absolute top-3 left-3 z-10 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006236]"/>
                    {SESSION.topic}
                  </div>

                  {/* Main video: remote peer (student) */}
                  <video ref={remoteVideoRef} autoPlay playsInline
                    className="absolute inset-0 w-full h-full object-cover" />
                  {/* Fallback background when no remote stream */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-lg pointer-events-none">
                    {!remoteVideoRef.current?.srcObject && "Waiting for student to join..."}
                  </div>

                  {/* Teacher PiP: local camera */}
                  <div className="absolute bottom-16 right-3 w-[clamp(80px,10vw,140px)] h-[clamp(60px,7.5vw,105px)] rounded-xl overflow-hidden border-2 border-[#006236] z-10 shadow-lg">
                    <video ref={localVideoRef} autoPlay playsInline muted
                      className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[clamp(9px,0.7vw,11px)] text-center py-0.5">You</div>
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-[clamp(6px,1.2vw,14px)] p-3 z-10" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
                    {CONTROLS.map(c => (
                      <button key={c.label} title={c.label} onClick={c.onClick}
                        className={`${c.bg} w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] rounded-full border-none cursor-pointer flex items-center justify-center hover:scale-110 transition-transform`}>
                        {c.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-white border border-[#006236]/10 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
                  <span className="text-[#006236] text-xs font-semibold whitespace-nowrap">{formatTime(timeElapsed)}</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006236] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}/>
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${timeRemaining < 300 ? "text-[#c51310]" : "text-gray-600"}`}>{formatTime(timeRemaining)}</span>
                </div>
              </>
            )}

            {/* Ended */}
            {sessionState === "ended" && (
              <div className="flex-1 bg-white border border-[#006236]/10 rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#006236] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-[#006236] text-2xl font-bold m-0">Session Complete</h3>
                <p className="text-gray-700 text-sm m-0">Duration: <span className="font-semibold text-[#006236]">{formatTime(timeElapsed)}</span></p>
                <button onClick={() => { setSessionState("lobby"); setTimeElapsed(0); }}
                  className="bg-[#006236] text-white px-6 py-2.5 rounded-full border-none cursor-pointer text-sm font-semibold hover:bg-[#004d2a] transition-colors">
                  Back to Lobby
                </button>
              </div>
            )}
          </div>
        </div>

        {/* End session modal */}
        {showEndModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full flex flex-col gap-4 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#c51310]/10 flex items-center justify-center mx-auto text-[#c51310]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-gray-900 text-lg font-bold m-0">End Session?</h3>
              <p className="text-gray-500 text-sm m-0">You still have <strong className="text-[#c51310]">{formatTime(timeRemaining)}</strong> remaining.</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowEndModal(false)} className="flex-1 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-600 cursor-pointer text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button onClick={endSession} className="flex-1 py-2.5 rounded-full border-none bg-[#c51310] text-white cursor-pointer text-sm font-bold hover:bg-[#a00f0d]">End Session</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
