import { useState, useEffect, useRef } from "react";
import StudentLayout from "./StudentLayout";
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
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default function StudentLiveSession() {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const sessions = await getMySessions();
        if (sessions.length > 0) setSessionData(sessions[0]);
      } catch { /* use fallback */ }
    })();
  }, []);

  const SESSION = {
    topic: sessionData?.topic || "Live Session",
    duration: sessionData?.duration_minutes || 60,
  };

  const [sessionState, setSessionState] = useState("lobby");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [showEndModal, setShowEndModal] = useState(false);
  const [sharedNotes] = useState(sessionData?.notes || "");
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
    if (msg.type === "offer") {
      // Teacher sent an offer — create answer
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
      await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: msg.sdp }));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      signalingRef.current?.send({ type: "answer", sdp: answer.sdp });

    } else if (msg.type === "ice-candidate" && msg.candidate) {
      await pcRef.current?.addIceCandidate(new RTCIceCandidate(msg.candidate));

    } else if (msg.type === "peer-left") {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    }
  };

  const joinSession = async () => {
    setSessionState("live");
    try {
      const stream = await getLocalStream();
      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0];
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const roomId = sessionData?.room_id;
      if (!roomId) return;

      const signaling = connectSignaling(roomId, handleSignalingMessage);
      signalingRef.current = signaling;
    } catch (err) {
      console.error("Failed to join session:", err);
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
        if (cameraTrackRef.current) {
          replaceTrack(pcRef.current, cameraTrackRef.current, "video");
          if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        }
      };
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  const leaveSession = async () => {
    pcRef.current?.close();
    signalingRef.current?.close();
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current = null;
    signalingRef.current = null;
    setSessionState("ended");
    setShowEndModal(false);
    if (sessionData?.id) {
      try { await updateSessionStatus(sessionData.id, "ended"); } catch {}
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
    setMessages(prev => [...prev, { id: Date.now(), sender: "You", text: inputText.trim(), isStudent: true, time: timeStr }]);
    setInputText("");
  };

  const CONTROLS = [
    { icon: cameraOn ? <CameraIcon/> : <CameraOffIcon/>, bg: cameraOn ? "bg-white/20" : "bg-[#c51310]", label: "Camera", onClick: toggleCamera },
    { icon: micOn ? <MicIcon/> : <MicOffIcon/>, bg: micOn ? "bg-white/20" : "bg-[#c51310]", label: "Mic", onClick: toggleMic },
    { icon: <ScreenShareIcon/>, bg: "bg-white/20", label: "Share Screen", onClick: toggleScreenShare },
    { icon: <EndCallIcon/>, bg: "bg-[#c51310]", label: "Leave", onClick: () => setShowEndModal(true) },
  ];

  return (
    <StudentLayout activePage="s-live">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Breadcrumb */}
        <div className="mx-[clamp(12px,2vw,24px)] mt-[clamp(12px,2vw,24px)] bg-[#006236] rounded-full py-2.5 px-[clamp(16px,2vw,32px)] flex items-center justify-between gap-3">
          <span className="text-white text-[clamp(12px,1.2vw,16px)] font-semibold">
            Live Session — {SESSION.topic}
          </span>
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
              <div className="flex-1 bg-white border border-[#006236]/10 rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#006236]/10 flex items-center justify-center">
                  <CameraIcon />
                </div>
                <h3 className="text-gray-800 text-xl font-bold m-0">Ready to join</h3>
                <p className="text-gray-500 text-sm m-0">{SESSION.topic} · {SESSION.duration} min</p>
                <button onClick={joinSession}
                  className="mt-2 flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer text-base font-bold tracking-wider hover:bg-[#004d2a] transition-colors">
                  <CameraIcon /> Join Session
                </button>
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
                    Teacher
                  </div>

                  {/* Main video: remote peer (teacher) */}
                  <video ref={remoteVideoRef} autoPlay playsInline
                    className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 text-lg pointer-events-none">
                    {!remoteVideoRef.current?.srcObject && "Waiting for teacher..."}
                  </div>

                  {/* Student PiP: local camera */}
                  <div className="absolute bottom-16 right-3 w-[clamp(80px,10vw,140px)] h-[clamp(60px,7.5vw,105px)] rounded-xl overflow-hidden border-2 border-[#006236] z-10 shadow-lg">
                    <video ref={localVideoRef} autoPlay playsInline muted
                      className="w-full h-full object-cover" />
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
                <div className="bg-white border border-[#006236]/10 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
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
              <div className="flex-1 bg-white border border-[#006236]/10 rounded-2xl flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#006236] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-gray-800 text-2xl font-bold m-0">Session Complete</h3>
                <p className="text-gray-500 text-sm m-0">{SESSION.topic} · {formatTime(timeElapsed)}</p>
                <button onClick={() => { setSessionState("lobby"); setTimeElapsed(0); }}
                  className="bg-[#006236] text-white px-6 py-2.5 rounded-full border-none cursor-pointer text-sm font-semibold hover:bg-[#004d2a] transition-colors">
                  Back to Lobby
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Chat / Notes */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl bg-[#f4f6f5] border border-[#006236]/10">
            <div className="flex border-b-2 border-[#006236]/15 bg-[#f4f6f5] shrink-0">
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
                <button onClick={leaveSession} className="flex-1 py-2.5 rounded-full border-none bg-[#c51310] text-white cursor-pointer text-sm font-bold hover:bg-[#a00f0d]">Leave</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
