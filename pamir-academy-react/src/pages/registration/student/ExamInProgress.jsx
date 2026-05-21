import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getExamQuestions, submitExam, getPlacement } from "../../../utils/registrationApi";

const STEPS = ["Personal Information", "Exam", "Payment"];
const ACTIVE_STEP = 1;
const LEVELS = ["beginner", "intermediate", "advanced"];
const QUESTIONS_PER_LEVEL = 5;
const EXAM_DURATION = 3600;

const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

export default function ExamInProgress() {
  const navigate = useNavigate();
  const subject = localStorage.getItem("currentExamSubject") || "English";

  const [questions, setQuestions] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [levelIdx, setLevelIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentLevel = LEVELS[levelIdx];

  const fetchQuestions = useCallback(async (level) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExamQuestions(subject, level, {
        limit: QUESTIONS_PER_LEVEL,
        random: true,
      });
      setQuestions(data);
      setQuestionIds(data.map((q) => q.id));
      setCurrentIdx(0);
    } catch (err) {
      setQuestions([]);
      setQuestionIds([]);
      if (err.status === 400 && err.data?.available !== undefined) {
        setError(
          `Not enough ${level} questions for ${subject}. ` +
          `Need ${err.data.required}, but only ${err.data.available} exist. ` +
          `An admin needs to add more questions.`
        );
      } else if (err.status === 404) {
        setError(`No ${level} questions available for ${subject}. An admin needs to add them.`);
      } else {
        setError("Failed to load questions. Please try again.");
      }
    }
    setLoading(false);
  }, [subject]);

  useEffect(() => {
    fetchQuestions(currentLevel);
  }, [currentLevel, fetchQuestions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}min ${(s % 60).toString().padStart(2, "0")}s`;

  const q = questions[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === questions.length - 1;

  const handleAnswer = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const handleCheckbox = (qId, option, checked) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      return { ...prev, [qId]: checked ? [...current, option] : current.filter(a => a !== option) };
    });
  };

  const handlePrevious = () => {
    if (!isFirst) setCurrentIdx(prev => prev - 1);
  };

  const handleNext = () => {
    if (!isLast) setCurrentIdx(prev => prev + 1);
  };

  const handleFinishLevel = async () => {
    setSubmitting(true);
    const timeSpent = EXAM_DURATION - timeLeft;
    try {
      await submitExam(subject, currentLevel, answers, timeSpent, questionIds);
    } catch { /* continue even if API fails */ }

    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(prev => prev + 1);
      setAnswers({});
      setTimeLeft(EXAM_DURATION);
    } else {
      try {
        await getPlacement();
      } catch { /* placement may already exist or fail gracefully */ }

      const examStatus = JSON.parse(localStorage.getItem("examStatus") || "{}");
      examStatus[subject] = true;
      localStorage.setItem("examStatus", JSON.stringify(examStatus));
      navigate("/register/student/placement-group");
    }
    setSubmitting(false);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" />
        </div>
      </header>

      <div className="px-[clamp(24px,5vw,80px)] py-8 pb-6">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-[clamp(12px,1.2vw,18px)] whitespace-nowrap ${i <= ACTIVE_STEP ? "text-brand font-semibold" : "text-gray-400"}`}>{step}</span>
              <div className={`h-2.5 w-full max-w-[200px] rounded-full ${i <= ACTIVE_STEP ? "bg-brand" : "bg-gray-200"}`} />
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 px-[clamp(24px,5vw,80px)] pb-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-[#d9d9d9] rounded-[10px] px-12 py-2.5 min-w-[180px] text-center">
              <span className="text-brand text-[clamp(18px,1.8vw,28px)] font-semibold">
                {subject}: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
              </span>
            </div>
          </div>

          {loading && <p className="text-center text-white text-lg py-20">Loading questions...</p>}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl p-6 text-center my-10">
              <p className="font-semibold text-lg">{error}</p>
              <button onClick={() => navigate("/register/student/exam-start")} className="mt-4 bg-brand text-white px-6 py-2 rounded-full border-none cursor-pointer">
                Back to Exam Start
              </button>
            </div>
          )}

          {!loading && !error && q && (
            <>
              <p className="text-center text-white/70 mb-6">Question {currentIdx + 1} of {questions.length}</p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                {q.question_text && (
                  <p className="text-[clamp(18px,1.6vw,26px)] text-black font-semibold mb-2">{q.question_text}</p>
                )}
                {q.instruction && (
                  <p className="text-brand font-medium mb-4 text-sm sm:text-base">{q.instruction}</p>
                )}

                {q.question_type === "radio" && (
                  <div className="flex flex-col gap-2.5">
                    {q.options.map((opt, idx) => {
                      const selected = answers[q.id] === opt;
                      return (
                        <button key={idx} onClick={() => handleAnswer(q.id, opt)}
                          className={`w-full max-w-[500px] px-6 py-3.5 rounded-full border-none cursor-pointer text-left transition-colors ${selected ? "bg-brand text-white" : "bg-[#d9d9d9] text-[#333]"}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "checkbox" && (
                  <div className="flex flex-col gap-2.5">
                    {q.options.map((opt, idx) => {
                      const checked = (answers[q.id] || []).includes(opt);
                      return (
                        <button key={idx} onClick={() => handleCheckbox(q.id, opt, !checked)}
                          className={`w-full max-w-[500px] px-6 py-3.5 rounded-full border-none cursor-pointer text-left transition-colors ${checked ? "bg-brand text-white" : "bg-[#d9d9d9] text-[#333]"}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "select" && (
                  <select value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value)}
                    className="w-full max-w-[500px] p-3.5 rounded-full border-2 border-brand text-base outline-none bg-white cursor-pointer">
                    <option value="">Select an answer...</option>
                    {q.options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                  </select>
                )}

                {q.question_type === "text" && (
                  <input type="text" value={answers[q.id] || ""} onChange={e => handleAnswer(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full max-w-[500px] p-3.5 rounded-full border-2 border-brand text-base outline-none" />
                )}
              </div>

              <div className="flex items-center justify-between mt-12 flex-wrap gap-4">
                <button onClick={handlePrevious} disabled={isFirst}
                  className={`flex items-center gap-2 text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider ${isFirst ? "bg-[#7d807f] cursor-default" : "bg-brand"}`}>
                  <ChevronLeft /> PREVIOUS
                </button>
                <div className="bg-[#d9d9d9] rounded-[10px] px-8 py-2.5 text-center">
                  <span className={`text-[clamp(16px,1.4vw,24px)] font-semibold whitespace-nowrap ${timeLeft < 300 ? "text-red-600" : "text-brand"}`}>
                    Time Left: {formatTime(timeLeft)}
                  </span>
                </div>
                {isLast ? (
                  <button onClick={handleFinishLevel} disabled={submitting}
                    className="flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider disabled:opacity-60">
                    {submitting ? "Submitting..." : levelIdx < LEVELS.length - 1 ? `NEXT LEVEL` : "FINISH"} <ChevronRight />
                  </button>
                ) : (
                  <button onClick={handleNext}
                    className="flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider">
                    NEXT <ChevronRight />
                  </button>
                )}
              </div>
            </>
          )}

          {!loading && !error && questions.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white text-lg">No questions found for this level.</p>
              <button onClick={() => navigate("/register/student/exam-start")} className="mt-4 bg-brand text-white px-6 py-2 rounded-full border-none cursor-pointer">
                Back to Exam Start
              </button>
            </div>
          )}

          <p className="text-center mt-8">
            <span className="text-[#7d807f]">If You Need Our Help? </span>
            <a href="#" className="text-brand no-underline">contact us</a>
          </p>
        </div>
      </main>

      <footer className="bg-black/85 text-white px-[clamp(24px,5vw,80px)] py-12 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8">
          <div><h3 className="text-white mb-4">About</h3><ul className="list-none p-0 m-0 flex flex-col gap-2.5">{["Impact","Internship","About"].map(i=><li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>)}</ul></div>
          <div className="text-center"><h3 className="text-white mb-4">Contact</h3><ul className="list-none p-0 m-0 flex flex-col gap-2.5">{["Help Center","Share Your Story","Email"].map(i=><li key={i}><a href="#" className="text-white/75 no-underline">{i}</a></li>)}</ul></div>
          <div className="text-right"><h3 className="text-white mb-4">Location</h3><ul className="list-none p-0 m-0 flex flex-col gap-2.5">{["Khorog","London","Dushanbe"].map(i=><li key={i} className="text-white/75">{i}</li>)}</ul></div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-10"><div className="h-[50px] bg-white/20 rounded-xl"/></div>
      </footer>
    </div>
  );
}
