import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { adminTeacherDecision, getConversation, sendMessage as sendApiMessage } from "../../../utils/panelApi";
import { createPeerConnection, getLocalStream, getScreenStream, replaceTrack } from "../../../utils/webrtc";
import { connectSignaling } from "../../../utils/signaling";

const CameraIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>;
const CameraOffIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/></svg>;
const MicIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>;
const ScreenShareIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/><path d="M12 8l-4 4h3v4h2v-4h3z"/></svg>;
const EndCallIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>;
const SendIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#006236"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

const LESSON_PLAN = {
  title: "Past Simple",
  sections: [
    { heading: "Rules", content: "Regular verbs: add -ed (walk → walked). Irregular verbs: memorize (go → went). Negative: didn't + base form. Questions: Did + subject + base form?", visibility: "both" },
    { heading: "Exercises", content: "Word like, multiple choice single / multiple, true false", visibility: "teacher" },
    { heading: "Home Task", content: "Write 10 sentences using past simple tense about your weekend activities.", visibility: "both" },
  ],
};

export default function TeacherDemo() {
  const { teacherId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [decision, setDecision] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // WebRTC refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const signalingRef = useRef(null);
  const localStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);

  useEffect(() => {
    if (!teacherId) return;
    getConversation(parseInt(teacherId, 10))
      .then(data => {
        const msgs = (Array.isArray(data) ? data : data.results || []).map(m => ({
          id: m.id,
          sender: m.is_mine ? "Admin" : "Applicant",
          text: m.text,
          isAdmin: m.is_mine,
        }));
        setMessages(msgs);
      })
      .catch(() => {});
  }, [teacherId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pcRef.current?.close();
      signalingRef.current?.close();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleSignalingMessage = async (msg) => {
    if (msg.type === "peer-joined") {
      // Teacher joined the demo — create offer (admin is offerer)
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

  const startDemoSession = async () => {
    setSessionStarted(true);
    try {
      const stream = await getLocalStream();
      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0];
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // Use demo-teacherId as room ID for demo sessions
      const roomId = `demo-${teacherId || "1"}`;
      const signaling = connectSignaling(roomId, handleSignalingMessage);
      signalingRef.current = signaling;
    } catch (err) {
      console.error("Failed to start demo session:", err);
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

  const endDemoSession = () => {
    pcRef.current?.close();
    signalingRef.current?.close();
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current = null;
    signalingRef.current = null;
    setSessionStarted(false);
  };

  const handleDecision = async (type) => {
    setDecision(type === "accept" ? "accepted" : "refused");
    setShowConfirm(null);
    try { await adminTeacherDecision(parseInt(teacherId, 10) || 1, type); } catch { /* API may be offline */ }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !teacherId) return;
    try {
      const msg = await sendApiMessage(parseInt(teacherId, 10), inputText.trim());
      setMessages(prev => [...prev, {
        id: msg.id || Date.now(),
        sender: "Admin",
        text: inputText.trim(),
        isAdmin: true,
      }]);
      setInputText("");
    } catch { /* API may be offline */ }
  };

  const CONTROLS = [
    { icon: <CameraIcon/>, bg: "bg-white/20", label: "Camera", onClick: () => {} },
    { icon: <CameraOffIcon/>, bg: "bg-white/20", label: "Screen", onClick: toggleScreenShare },
    { icon: <MicIcon/>, bg: "bg-white/20", label: "Mic", onClick: () => {} },
    { icon: <ScreenShareIcon/>, bg: "bg-white/20", label: "Share", onClick: toggleScreenShare },
    { icon: <EndCallIcon/>, bg: "bg-[#c51310]", label: "End", onClick: endDemoSession },
  ];

  return (
    <DashboardLayout activePage="demo">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Breadcrumb */}
        <div className="mx-[clamp(12px,2vw,24px)] mt-[clamp(12px,2vw,24px)] bg-[#006236] rounded-full py-2.5 px-[clamp(16px,2vw,32px)] flex items-center justify-center">
          <span className="text-white text-[clamp(12px,1.2vw,16px)] whitespace-nowrap text-center">
            Demo Session — {LESSON_PLAN.title}
          </span>
        </div>

        {/* Main grid */}
        <div className="flex-1 p-[clamp(12px,2vw,24px)] grid gap-[clamp(12px,1.5vw,20px)]" style={{ gridTemplateColumns: "minmax(260px, 1fr) minmax(300px, 1.4fr)", gridTemplateRows: "auto 1fr" }}>
          {/* Lesson Plan */}
          <div className="row-span-2 bg-white border border-[#006236]/10 rounded-2xl p-[clamp(16px,2vw,28px)] flex flex-col gap-5 overflow-y-auto">
            <h2 className="text-[#006236] text-[clamp(20px,2.2vw,32px)] font-bold text-center m-0 pb-3 border-b-2 border-[#006236]/20">{LESSON_PLAN.title}</h2>
            {LESSON_PLAN.sections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h3 className="text-[#006236] text-[clamp(16px,1.6vw,22px)] font-bold m-0">{section.heading}</h3>
                <p className="text-gray-700 text-[clamp(12px,1.1vw,15px)] m-0 leading-relaxed">{section.content}</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[clamp(10px,0.9vw,13px)] self-start ${section.visibility === "teacher" ? "bg-[#c51310]/10 text-[#c51310]" : "bg-[#006236]/10 text-[#006236]"}`}>
                  {section.visibility === "teacher" ? <LockIcon/> : <EyeIcon/>}
                  <span>{section.visibility === "teacher" ? "Only teachers can see" : "Both teacher & student can see"}</span>
                </div>
                {idx < LESSON_PLAN.sections.length - 1 && <div className="h-px bg-[#006236]/15 mt-1"/>}
              </div>
            ))}
          </div>

          {/* Video area */}
          <div className="bg-[#1a1a1a] rounded-2xl relative overflow-hidden min-h-[clamp(200px,28vw,380px)]">
            <div className="absolute top-3 right-3 bg-[#006236] text-white px-4 py-1.5 rounded-full text-[clamp(12px,1.1vw,16px)] font-semibold z-2">
              Demo Session
            </div>

            {!sessionStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <p className="text-white/60 text-sm">Click to start the demo video session</p>
                <button onClick={startDemoSession}
                  className="flex items-center gap-2 bg-[#006236] text-white px-6 py-3 rounded-full border-none cursor-pointer text-sm font-bold hover:bg-[#004d2a] transition-colors">
                  <CameraIcon/> Start Video
                </button>
              </div>
            ) : (
              <>
                {/* Main video: remote peer (teacher applicant) */}
                <video ref={remoteVideoRef} autoPlay playsInline
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-lg pointer-events-none">
                  {!remoteVideoRef.current?.srcObject && "Waiting for teacher to join..."}
                </div>

                {/* Admin PiP: local camera */}
                <div className="absolute bottom-16 left-3 w-[clamp(80px,10vw,130px)] h-[clamp(60px,7.5vw,100px)] rounded-xl overflow-hidden border-2 border-[#006236] z-2">
                  <video ref={localVideoRef} autoPlay playsInline muted
                    className="w-full h-full object-cover" />
                </div>

                <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-[clamp(8px,1.5vw,16px)] p-3 z-2" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                  {CONTROLS.map(c => (
                    <button key={c.label} title={c.label} onClick={c.onClick}
                      className={`${c.bg} w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] rounded-full border-none cursor-pointer flex items-center justify-center hover:scale-110 transition-transform`}>
                      {c.icon}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Chat */}
          <div className="flex flex-col gap-3 min-h-[200px]">
            <div className="flex items-center gap-2.5 bg-white border border-[#006236]/15 rounded-full py-2 pr-4 pl-6">
              <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                placeholder="Enter you text to chat..."
                className="flex-1 border-none outline-none bg-transparent text-[clamp(13px,1.2vw,18px)] text-black"/>
              <button onClick={handleSendMessage} className="bg-transparent border-none cursor-pointer flex items-center p-1.5"><SendIcon/></button>
            </div>
            <div className="flex-1 bg-[#f4f6f5] border border-[#006236]/10 rounded-2xl p-[clamp(12px,1.5vw,20px)] flex flex-col gap-3 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? "items-end" : "items-start"}`}>
                  <span className="text-gray-500 text-[clamp(10px,0.9vw,12px)] mb-0.5">{msg.sender}</span>
                  <div className={`${msg.isAdmin ? "bg-[#006236] rounded-[20px_20px_4px_20px]" : "bg-[#7d807f] rounded-[20px_20px_20px_4px]"} text-white px-5 py-2.5 text-[clamp(13px,1.2vw,18px)] max-w-[75%]`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision bar */}
        <div className={`mx-[clamp(12px,2vw,24px)] mb-[clamp(12px,2vw,24px)] rounded-2xl px-[clamp(20px,3vw,40px)] py-[clamp(16px,2vw,24px)] flex items-center justify-between flex-wrap gap-4 transition-all duration-300
          ${decision ? (decision === "accepted" ? "bg-[#006236]/15 border-2 border-[#006236]" : "bg-[#c51310]/15 border-2 border-[#c51310]") : "bg-[#e4e8e6] border-2 border-[#006236]/20"}`}>

          {decision ? (
            <div className="flex items-center gap-3 flex-1 justify-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${decision === "accepted" ? "bg-[#006236]" : "bg-[#c51310]"}`}>
                {decision === "accepted" ? <CheckIcon/> : <XIcon/>}
              </div>
              <span className="text-gray-800 text-[clamp(16px,1.8vw,24px)] font-semibold">
                {decision === "accepted" ? "Teacher Accepted — Offer letter will be sent." : "Teacher Refused — Applicant will be notified."}
              </span>
              <button onClick={() => setDecision(null)} className="ml-auto bg-transparent text-gray-800 border border-[#006236]/30 rounded-full px-5 py-2 cursor-pointer text-[clamp(12px,1vw,15px)]">Undo</button>
            </div>
          ) : showConfirm ? (
            <div className="flex items-center gap-4 flex-1 justify-center flex-wrap">
              <span className="text-gray-800 text-[clamp(14px,1.4vw,20px)]">
                {showConfirm === "accept" ? "Are you sure you want to accept this teacher?" : "Are you sure you want to refuse this teacher?"}
              </span>
              <button onClick={() => handleDecision(showConfirm)}
                className={`${showConfirm === "accept" ? "bg-[#006236]" : "bg-[#c51310]"} text-white px-7 py-2.5 rounded-full border-none cursor-pointer text-[clamp(14px,1.3vw,18px)] font-semibold`}>
                Yes, {showConfirm === "accept" ? "Accept" : "Refuse"}
              </button>
              <button onClick={() => setShowConfirm(null)} className="bg-transparent text-gray-800 px-7 py-2.5 rounded-full border border-[#006236]/40 cursor-pointer text-[clamp(14px,1.3vw,18px)]">Cancel</button>
            </div>
          ) : (
            <>
              <div className="text-gray-800 text-[clamp(13px,1.2vw,18px)] opacity-80">After observing the demo lesson, make your decision:</div>
              <div className="flex items-center gap-4">
                <button onClick={() => setShowConfirm("accept")}
                  className="flex items-center gap-2 bg-[#006236] text-white px-[clamp(24px,3vw,40px)] py-3 rounded-full border-none cursor-pointer text-[clamp(16px,1.6vw,22px)] font-bold tracking-wide hover:scale-[1.03] transition-transform">
                  <CheckIcon/> Accept
                </button>
                <button onClick={() => setShowConfirm("refuse")}
                  className="flex items-center gap-2 bg-[#c51310] text-white px-[clamp(24px,3vw,40px)] py-3 rounded-full border-none cursor-pointer text-[clamp(16px,1.6vw,22px)] font-bold tracking-wide hover:scale-[1.03] transition-transform">
                  <XIcon/> Refuse
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
