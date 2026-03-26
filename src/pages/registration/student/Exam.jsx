import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ---- Sample questions data ---- */
const sampleQuestions = {
  English: {
    beginner: [
      { id: "e1", instruction: "What _ your name?", type: "radio", options: ["A. Is", "B. To", "C. A", "D. At"], correctAnswer: "A. Is" },
      { id: "e2", instruction: "She _ a student.", type: "radio", options: ["A. am", "B. is", "C. are", "D. be"], correctAnswer: "B. is" },
      { id: "e3", instruction: "Select the correct past tense of 'go'.", type: "select", options: ["goed", "went", "gone", "going"], correctAnswer: "went" },
      { id: "e4", instruction: "Type the plural of 'child'.", type: "text", correctAnswer: "children" },
      { id: "e5", question: "Read the sentence: 'The cat sat on the mat.' What did the cat do?", instruction: "Select all that apply:", type: "checkbox", options: ["Sat down", "Ran away", "Was on the mat", "Jumped"], correctAnswers: ["Sat down", "Was on the mat"] },
    ],
    intermediate: [
      { id: "ei1", instruction: "If I _ you, I would apologize.", type: "radio", options: ["A. am", "B. was", "C. were", "D. be"], correctAnswer: "C. were" },
      { id: "ei2", instruction: "She asked me where I _.", type: "radio", options: ["A. live", "B. lived", "C. living", "D. lives"], correctAnswer: "B. lived" },
    ],
  },
  Physics: {
    beginner: [
      { id: "p1", instruction: "What is the SI unit of force?", type: "radio", options: ["A. Joule", "B. Newton", "C. Watt", "D. Pascal"], correctAnswer: "B. Newton" },
      { id: "p2", instruction: "Speed is a _ quantity.", type: "select", options: ["scalar", "vector", "tensor", "complex"], correctAnswer: "scalar" },
      { id: "p3", instruction: "What is the acceleration due to gravity on Earth (m/s²)?", type: "text", correctAnswer: "9.8" },
    ],
  },
  Programming: {
    beginner: [
      { id: "pr1", instruction: "Which keyword is used to declare a variable in JavaScript?", type: "radio", options: ["A. var", "B. int", "C. dim", "D. declare"], correctAnswer: "A. var" },
      { id: "pr2", instruction: "What does HTML stand for?", type: "text", correctAnswer: "HyperText Markup Language" },
      { id: "pr3", instruction: "Select all programming languages:", type: "checkbox", options: ["Python", "HTML", "Java", "CSS"], correctAnswers: ["Python", "Java"] },
    ],
  },
};

const STEPS = ["Personal Info", "Subject", "Exam", "Payment"];
const ACTIVE_STEP = 2;

const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

export default function Exam() {
  const { subject = "English", level } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(level || "beginner");

  const questions = sampleQuestions[subject]?.[currentSection] || sampleQuestions[subject]?.beginner || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAnswerChange = (qid, answer) => setAnswers(prev => ({ ...prev, [qid]: answer }));

  const handleCheckboxChange = (qid, option, checked) => {
    setAnswers(prev => {
      const current = prev[qid] || [];
      return { ...prev, [qid]: checked ? [...current, option] : current.filter(a => a !== option) };
    });
  };

  const calculateScore = () => {
    let score = 0, total = 0;
    questions.forEach(q => {
      total++;
      const ua = answers[q.id];
      if (q.type === "radio" || q.type === "select" || q.type === "text") {
        if (ua && ua.toString().toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()) score++;
      } else if (q.type === "checkbox") {
        const uaArr = Array.isArray(ua) ? ua : [];
        const ca = q.correctAnswers || [];
        if (uaArr.length === ca.length && uaArr.every(a => ca.includes(a))) score++;
      }
    });
    return { score, total, percentage: total > 0 ? Math.round((score / total) * 100) : 0 };
  };

  const handleSubmit = () => {
    const { score, total, percentage } = calculateScore();
    const examData = { subject, level: currentSection, score, total, percentage, answers, timeSpent: 3600 - timeLeft };
    const existing = JSON.parse(localStorage.getItem("examResults") || "[]");
    existing.push(examData);
    localStorage.setItem("examResults", JSON.stringify(existing));
    const status = JSON.parse(localStorage.getItem("examStatus") || "{}");
    status[subject] = true;
    localStorage.setItem("examStatus", JSON.stringify(status));
    navigate("/register/student/exam-result");
  };

  return (
    <div className="font-['Nunito_Sans'] w-screen min-h-screen flex flex-col bg-[#a7a7a7] overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[60px] flex items-center">
          <img
            src="/logo/final_logo.svg"
            alt="Pamir Academy Logo"
            className="h-full w-auto object-contain"
          />
        </div>
        <button className="bg-[#006236] text-white px-8 py-2.5 rounded-full border-none cursor-pointer tracking-wider">LOGIN</button>
      </header>

      {/* Steps */}
      <div className="px-[clamp(24px,5vw,80px)] py-8 pb-6">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-sm sm:text-base whitespace-nowrap ${i === ACTIVE_STEP ? "text-[#006236] font-semibold" : i < ACTIVE_STEP ? "text-[#006236]/60" : "text-[#d9d9d9]"}`}>{step}</span>
              <div className={`h-2.5 w-full max-w-[200px] rounded-full ${i <= ACTIVE_STEP ? "bg-[#006236]" : "bg-[#d9d9d9]"}`}/>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 px-[clamp(24px,5vw,80px)] pb-10">
        <div className="max-w-[1000px] mx-auto bg-[#d9d9d9]/40 p-6 sm:p-8 md:p-10 rounded-[20px]">
          {/* Title + Timer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h2 className="text-[#006236] text-lg sm:text-xl md:text-2xl font-bold m-0">
              {subject}: {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 sm:px-5 py-2 sm:py-3 rounded-[10px]">
              <span className="text-[#006236] text-sm sm:text-base">Time Left:</span>
              <span className={`font-bold text-base sm:text-lg md:text-xl ${timeLeft < 300 ? "text-red-600" : "text-[#006236]"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {questions.map((q, index) => (
              <div key={q.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-[10px]">
                {q.question && (
                  <div className="mb-4 p-3 sm:p-4 bg-[#006236]/10 rounded-[5px] text-sm sm:text-base text-gray-800">
                    {q.question}
                  </div>
                )}
                <p className="text-[#006236] font-bold mb-4 text-sm sm:text-base">
                  <span>{index + 1}.</span> {q.instruction}
                </p>

                {/* Radio */}
                {q.type === "radio" && (
                  <div className="flex flex-col gap-2">
                    {q.options.map((option, oi) => (
                      <button key={oi} onClick={() => handleAnswerChange(q.id, option)}
                        className={`w-full p-3 text-left rounded-[5px] border-2 border-[#006236] cursor-pointer transition-colors text-sm sm:text-base ${
                          answers[q.id] === option ? "bg-[#006236]/20" : "bg-white hover:bg-[#006236]/5"
                        }`}>
                        <input type="radio" checked={answers[q.id] === option} onChange={() => {}} className="mr-2 accent-[#006236]"/>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Checkbox */}
                {q.type === "checkbox" && (
                  <div className="flex flex-col gap-2">
                    {q.options.map((option, oi) => (
                      <button key={oi} onClick={() => handleCheckboxChange(q.id, option, !(answers[q.id] || []).includes(option))}
                        className={`w-full p-3 text-left rounded-[5px] border-2 border-[#006236] cursor-pointer transition-colors text-sm sm:text-base ${
                          (answers[q.id] || []).includes(option) ? "bg-[#006236]/20" : "bg-white hover:bg-[#006236]/5"
                        }`}>
                        <input type="checkbox" checked={(answers[q.id] || []).includes(option)} onChange={() => {}} className="mr-2 accent-[#006236]"/>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Select */}
                {q.type === "select" && (
                  <select value={answers[q.id] || ""} onChange={e => handleAnswerChange(q.id, e.target.value)}
                    className="w-full p-3 rounded-[5px] border-2 border-[#006236] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#006236]/30 bg-white cursor-pointer">
                    <option value="">Select an answer...</option>
                    {q.options.map((option, oi) => <option key={oi} value={option}>{option}</option>)}
                  </select>
                )}

                {/* Text */}
                {q.type === "text" && (
                  <input type="text" value={answers[q.id] || ""} onChange={e => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full p-3 rounded-[5px] border-2 border-[#006236] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#006236]/30"/>
                )}
              </div>
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={() => navigate("/exam-start")}
              className="flex items-center gap-2 bg-[#006236] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-none cursor-pointer tracking-wider text-sm sm:text-base hover:bg-[#004d2a] transition-colors">
              <ChevronLeft/> PREVIOUS
            </button>
            <button onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#006236] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-none cursor-pointer tracking-wider text-sm sm:text-base hover:bg-[#004d2a] transition-colors">
              SUBMIT <ChevronRight/>
            </button>
          </div>
        </div>

        <p className="text-center mt-8">
          <span className="text-[#7d807f]">If You Need Our Help? </span>
          <a href="#" className="text-[#006236] no-underline">contact us</a>
        </p>
      </main>

      {/* Footer */}
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
