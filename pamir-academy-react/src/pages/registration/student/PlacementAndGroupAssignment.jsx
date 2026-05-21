import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlacement } from "../../../utils/registrationApi";

const STEPS = ["Personal Info", "Subject", "Exam", "Placement"];
const ACTIVE_STEP = 3;

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function LevelRing({ percentage, size = 180 }) {
  const r = 45, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const filled = (percentage / 100) * circ;
  const empty = circ - filled;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#006236" strokeWidth="10" strokeDasharray={`${filled} ${empty}`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d9d9d9" strokeWidth="10" strokeDasharray={`${empty} ${filled}`} strokeDashoffset={`${-filled}`} transform="rotate(-90 50 50)" />
        <circle cx={cx} cy={cy} r={38} fill="#006236" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-white font-bold text-3xl leading-tight">{percentage}%</span>
        <span className="text-white/70 text-sm leading-tight">Average</span>
      </div>
    </div>
  );
}

const LEVEL_CONFIG = {
  Advanced: { color: "bg-brand", textColor: "text-white", description: "You demonstrated strong mastery across the board." },
  Intermediate: { color: "bg-brand/80", textColor: "text-white", description: "You have a solid foundation with room to grow." },
  Beginner: { color: "bg-[#7d807f]", textColor: "text-white", description: "You're just getting started — we'll build you up." },
};

export default function PlacementAndGroupAssignment() {
  const navigate = useNavigate();
  const [assignedLevel, setAssignedLevel] = useState(null);
  const [avgPercentage, setAvgPercentage] = useState(null);
  const [primarySubject, setPrimarySubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPlacement();
        setAssignedLevel(data.assigned_level || "Beginner");
        setAvgPercentage(data.average_percentage ?? 0);
        setPrimarySubject(data.primary_subject_name || null);
      } catch (err) {
        setError(err.message || "Failed to load placement results.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const levelInfo = LEVEL_CONFIG[assignedLevel] || LEVEL_CONFIG.Beginner;

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Loading placement results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen min-h-screen flex flex-col items-center justify-center gap-4 bg-surface">
        <p className="text-white text-lg">{error}</p>
        <button onClick={() => navigate("/register/student/exam-start")} className="bg-brand text-white px-6 py-2.5 rounded-full border-none cursor-pointer text-sm">
          Back to Exam
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen flex flex-col bg-surface overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" />
        </div>
      </header>

      {/* Steps */}
      <div className="px-[clamp(24px,5vw,80px)] py-8 pb-6">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-[clamp(12px,1.2vw,18px)] whitespace-nowrap ${i <= ACTIVE_STEP ? "text-brand font-semibold" : "text-gray-400"}`}>
                {step}
              </span>
              <div className={`h-2.5 w-full max-w-[200px] rounded-full ${i <= ACTIVE_STEP ? "bg-brand" : "bg-gray-200"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-[clamp(24px,5vw,80px)] pb-10">
        <div className="max-w-[900px] mx-auto">

          {/* Congratulations Banner */}
          <div className="bg-brand rounded-3xl px-[clamp(24px,4vw,60px)] py-10 mb-8 text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h1 className="text-white text-[clamp(22px,2.5vw,34px)] font-bold m-0 mb-2">
              Congratulations!
            </h1>
            <p className="text-white/70 text-[clamp(13px,1.1vw,16px)] m-0">
              You have completed all your exams. Here are your placement results.
            </p>
          </div>

          {/* Results Row */}
          <div className="flex flex-wrap gap-6 mb-8 justify-center">
            {/* Score Circle */}
            <div className="bg-[#d9d9d9] rounded-3xl p-8 flex flex-col items-center gap-4 min-w-[240px] flex-1 max-w-[340px]">
              <LevelRing percentage={Math.round(avgPercentage)} size={160} />
              <div className="text-center">
                <p className="text-brand font-bold text-lg m-0">Your Score</p>
                <p className="text-[#7d807f] text-sm m-0 mt-1">{Math.round(avgPercentage)}% average across all exams</p>
              </div>
            </div>

            {/* Level Card */}
            <div className="bg-[#d9d9d9] rounded-3xl p-8 flex flex-col items-center justify-center gap-5 min-w-[240px] flex-1 max-w-[340px]">
              <div className={`${levelInfo.color} ${levelInfo.textColor} text-[clamp(24px,2.5vw,36px)] font-bold px-10 py-5 rounded-2xl text-center`}>
                {assignedLevel}
              </div>
              <div className="text-center">
                <p className="text-brand font-bold text-lg m-0">Your Level</p>
                <p className="text-[#7d807f] text-sm m-0 mt-1">{levelInfo.description}</p>
              </div>
              {primarySubject && (
                <div className="bg-white/60 rounded-xl px-5 py-2.5 text-center">
                  <p className="text-[#7d807f] text-xs m-0">Primary Subject</p>
                  <p className="text-brand font-bold text-base m-0">{primarySubject}</p>
                </div>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-[#d9d9d9] rounded-3xl p-8 mb-8">
            <h2 className="text-brand text-xl font-bold m-0 mb-6">What Happens Next?</h2>
            <div className="flex flex-col gap-4">
              {[
                { num: "1", title: "Explore Your Dashboard", desc: "Access your personalized student dashboard with courses and schedules." },
                { num: "2", title: "Join Your Study Group", desc: "You'll be matched with classmates at your level for collaborative learning." },
                { num: "3", title: "Start Learning", desc: "Dive into courses tailored to your level and start making progress." },
              ].map((item) => (
                <div key={item.num} className="flex gap-4 items-start bg-white/50 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {item.num}
                  </div>
                  <div>
                    <p className="text-brand font-bold text-base m-0">{item.title}</p>
                    <p className="text-[#7d807f] text-sm m-0 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational */}
          <div className="bg-black/70 rounded-3xl px-[clamp(24px,4vw,60px)] py-8 mb-8 text-center">
            <p className="text-white leading-relaxed text-[clamp(13px,1.1vw,16px)] m-0">
              Your learning journey is unique, and we're here to support you every step of the way.
              Whether you're a beginner building foundations or an advanced learner pushing boundaries,
              Pamir Academy has the right path for you.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={() => navigate("/register/student/exam-result")}
              className="flex items-center gap-2 bg-[#7d807f] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider text-sm"
            >
              <ChevronLeft /> PREVIOUS
            </button>
            <button
              onClick={() => navigate("/student")}
              className="flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider text-sm font-semibold"
            >
              GO TO DASHBOARD <ChevronRight />
            </button>
          </div>

          <p className="text-center mt-8">
            <span className="text-[#7d807f]">If You Need Our Help? </span>
            <a href="#" className="text-brand no-underline">contact us</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/85 text-white px-[clamp(24px,5vw,80px)] py-12 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-white mb-4">About</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["Impact", "Internship", "About"].map((i) => (
                <li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["Help Center", "Share Your Story", "Email"].map((i) => (
                <li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <h3 className="text-white mb-4">Location</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["Khorog", "London", "Dushanbe"].map((i) => (
                <li key={i} className="text-white/75">{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10">
          <div className="h-[50px] bg-white/20 rounded-xl" />
        </div>
      </footer>
    </div>
  );
}
