import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/lesson/lesson-environment.css";

const LessonEnvironment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupData, lessonTopic } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "Tutor",
      text: "Hello everyone! Welcome to today's lesson.",
      isOwn: false,
    },
    { id: 2, sender: "Alex M.", text: "Hello!", isOwn: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("rules");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as MM:min
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}min`;
  };

  // Camera toggle
  const toggleCamera = async () => {
    if (isCameraOn) {
      // Turn off camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        // Set srcObject immediately since video element always exists
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions.");
      }
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "You",
          text: newMessage.trim(),
          isOwn: true,
        },
      ]);
      setNewMessage("");
    }
  };

  // Leave lesson
  const handleLeaveLesson = () => {
    if (window.confirm("Are you sure you want to leave the lesson?")) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      navigate("/");
    }
  };

  // Lesson content based on tab
  const lessonContent = {
    rules: {
      title: "Rules",
      content: [
        "The Past Simple tense is used to describe completed actions in the past.",
        "Regular verbs: Add -ed (walk → walked, play → played)",
        "Irregular verbs: Change form (go → went, see → saw)",
        "Negative: Subject + did not (didn't) + base form",
        "Question: Did + subject + base form?",
      ],
    },
    exercises: {
      title: "Exercises",
      teacherOnly: true,
      content: [
        "Exercise 1: Fill in the blanks with the correct past tense form",
        "Exercise 2: Multiple choice - Select the correct verb form",
        "Exercise 3: True/False - Identify correct usage",
        "Exercise 4: Sentence transformation",
      ],
    },
    homework: {
      title: "Home Task",
      content: [
        "Complete Workbook pages 23-25",
        "Write 10 sentences using Past Simple tense",
        "Watch the supplementary video and take notes",
        "Prepare 5 questions for next class discussion",
      ],
    },
  };

  return (
    <div className="lesson-environment flex w-screen h-screen m-0 p-0 bg-slate-100 overflow-hidden">
      {/* Left Panel - Materials */}
      <div className="lesson-materials-panel flex-1 flex flex-col bg-slate-200 border-r border-slate-300 overflow-hidden">
        <div className="materials-header p-5 bg-slate-200 border-b border-slate-300">
          <button
            className="back-btn mb-4 bg-transparent border-none text-[#006236] text-sm font-semibold p-0 flex items-center gap-1 hover:text-[#004d2a] transition-colors duration-200"
            onClick={handleLeaveLesson}
          >
            ← Back
          </button>
          <h1 className="lesson-topic text-3xl font-bold text-slate-800 m-0">
            {lessonTopic || "Past Simple"}
          </h1>
        </div>

        {/* Tabs */}
        <div className="materials-tabs flex px-6 bg-slate-200 border-b border-slate-300">
          <button
            className={`tab-btn px-6 py-4 bg-transparent border-none text-sm font-medium text-slate-600 cursor-pointer transition-all duration-200 relative hover:text-slate-800 ${
              activeTab === "rules" ? "text-[#006236] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("rules")}
          >
            Rules
            {activeTab === "rules" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006236] rounded-t"></span>
            )}
          </button>
          <button
            className={`tab-btn px-6 py-4 bg-transparent border-none text-sm font-medium text-slate-600 cursor-pointer transition-all duration-200 relative hover:text-slate-800 ${
              activeTab === "exercises" ? "text-[#006236] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("exercises")}
          >
            Exercises
            {activeTab === "exercises" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006236] rounded-t"></span>
            )}
          </button>
          <button
            className={`tab-btn px-6 py-4 bg-transparent border-none text-sm font-medium text-slate-600 cursor-pointer transition-all duration-200 relative hover:text-slate-800 ${
              activeTab === "homework" ? "text-[#006236] font-semibold" : ""
            }`}
            onClick={() => setActiveTab("homework")}
          >
            Home Task
            {activeTab === "homework" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006236] rounded-t"></span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="materials-content flex-1 p-6 overflow-y-auto">
          <h2 className="content-title text-2xl font-bold text-slate-800 mb-5">
            {lessonContent[activeTab].title}
          </h2>

          {lessonContent[activeTab].teacherOnly && (
            <div className="teacher-only-badge flex items-center gap-2 px-4 py-3 bg-[rgba(0,98,54,0.1)] border border-[#006236] rounded-lg mb-5 text-sm text-[#006236]">
              <span className="badge-icon text-base">🔒</span>
              <span>Only teachers can see exercise details</span>
            </div>
          )}

          <div className="content-list flex flex-col gap-4">
            {lessonContent[activeTab].content.map((item, index) => (
              <div
                key={index}
                className="content-item flex gap-3 p-4 bg-white rounded-lg shadow-sm"
              >
                <span className="item-bullet font-bold text-[#006236] min-w-6">
                  {index + 1}.
                </span>
                <span className="item-text text-sm text-slate-800 leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {activeTab === "exercises" && (
            <div className="exercise-note mt-6 p-4 bg-amber-50 border border-amber-400 rounded-lg">
              <p className="text-sm text-amber-900 m-0">
                <strong className="font-semibold">Note:</strong> Word like,
                multiple choice single/multiple, true false
              </p>
            </div>
          )}

          {activeTab === "homework" && (
            <div className="homework-visibility flex items-center gap-2 mt-6 px-4 py-3 bg-blue-50 border border-blue-400 rounded-lg text-sm text-blue-900">
              <span className="visibility-icon text-base">👁️</span>
              <span>Both teacher and student can see</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Video & Chat */}
      <div className="lesson-video-panel">
        {/* Timer */}
        <div className="lesson-timer">
          <span className="timer-label">Time Left:</span>
          <span className="timer-value">{formatTime(timeLeft)}</span>
        </div>

        {/* Video Section */}
        <div className="video-section">
          {/* Main Video (Tutor) */}
          <div className="main-video-container">
            <div className="video-placeholder tutor-video">
              <div className="placeholder-avatar">👨‍🏫</div>
              <span className="participant-name">Dr. Sarah Johnson</span>
            </div>
          </div>

          {/* Student Videos */}
          <div className="student-videos flex gap-2">
            {/* Current User Video */}
            <div
              className={`video-tile flex-1 aspect-[4/3] rounded-lg overflow-hidden relative bg-slate-700 ${
                isCameraOn ? "camera-on" : ""
              }`}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="user-video w-full h-full object-cover scale-x-[-1]"
                style={{ display: isCameraOn ? "block" : "none" }}
              />
              {!isCameraOn && (
                <div className="video-placeholder w-full h-full flex items-center justify-center">
                  <div className="placeholder-avatar small w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    👤
                  </div>
                </div>
              )}
              <span className="participant-name text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded absolute bottom-1 left-1">
                You
              </span>
            </div>

            {/* Other Students */}
            <div className="video-tile flex-1 aspect-[4/3] rounded-lg overflow-hidden relative bg-slate-700">
              <div className="video-placeholder w-full h-full flex items-center justify-center">
                <div className="placeholder-avatar small w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                  👤
                </div>
              </div>
              <span className="participant-name text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded absolute bottom-1 left-1">
                Alex M.
              </span>
            </div>

            <div className="video-tile flex-1 aspect-[4/3] rounded-lg overflow-hidden relative bg-slate-700">
              <div className="video-placeholder w-full h-full flex items-center justify-center">
                <div className="placeholder-avatar small w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                  👤
                </div>
              </div>
              <span className="participant-name text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded absolute bottom-1 left-1">
                Jordan K.
              </span>
            </div>
          </div>

          {/* Video Controls */}
          <div className="video-controls flex justify-center gap-3 py-3">
            <button
              className={`control-btn w-12 h-12 rounded-full border-none text-xl cursor-pointer transition-all duration-200 flex items-center justify-center hover:scale-110 ${
                isCameraOn
                  ? "bg-slate-600 text-white"
                  : "bg-slate-500 text-white"
              }`}
              onClick={toggleCamera}
              title={isCameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {isCameraOn ? "📹" : "📷"}
            </button>
            <button
              className={`control-btn w-12 h-12 rounded-full border-none text-xl cursor-pointer transition-all duration-200 flex items-center justify-center hover:scale-110 ${
                isMicOn ? "bg-slate-600 text-white" : "bg-slate-500 text-white"
              }`}
              onClick={() => setIsMicOn(!isMicOn)}
              title={isMicOn ? "Mute microphone" : "Unmute microphone"}
            >
              {isMicOn ? "🎤" : "🔇"}
            </button>
            <button
              className="control-btn leave-btn w-12 h-12 rounded-full border-none text-xl cursor-pointer transition-all duration-200 flex items-center justify-center hover:scale-110 bg-red-500 text-white hover:bg-red-600"
              onClick={handleLeaveLesson}
              title="Leave lesson"
            >
              📞
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="chat-section h-64 flex flex-col bg-white rounded-t-2xl mx-3 overflow-hidden shadow-lg">
          <div className="chat-messages flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message flex flex-col max-w-[85%] ${
                  msg.isOwn ? "self-end items-end" : "self-start items-start"
                }`}
              >
                {!msg.isOwn && (
                  <span className="message-sender text-xs font-semibold text-slate-600 mb-1 ml-2">
                    {msg.sender}
                  </span>
                )}
                <div
                  className={`message-bubble px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                    msg.isOwn
                      ? "bg-[#006236] text-white rounded-br-sm"
                      : "bg-slate-500 text-white rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            className="chat-input-form flex gap-2 p-3 border-t border-slate-200 bg-slate-50"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              className="chat-input flex-1 px-4 py-2.5 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#006236] focus:border-transparent transition-all"
              placeholder="Enter you text to chat..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="send-btn w-10 h-10 rounded-full border-none bg-[#006236] text-white text-base cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-[#004d2a] hover:scale-110"
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LessonEnvironment;
