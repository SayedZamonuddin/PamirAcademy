import { useState, useEffect } from "react";

const STEPS = ["Personal Information", "Exam", "Payment"];
const ACTIVE_STEP = 1;
const QUESTIONS = [
  { id: 1, question: "What _ You Name?", options: ["A. Is","B. To","C. A","D. At"] },
  { id: 2, question: "What _ You Name?", options: ["A. Is","B. To","C. A","D. At"] },
  { id: 3, question: "What _ You Name?", options: ["A. Is","B. To","C. A","D. At"] },
];

const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

export default function ExamInProgress() {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  useEffect(() => { const t = setInterval(() => setTimeLeft(p => p > 0 ? p-1 : 0), 1000); return () => clearInterval(t); }, []);
  const formatTime = (s) => `${Math.floor(s/60)}min ${(s%60).toString().padStart(2,"0")}s`;

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
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-[clamp(12px,1.2vw,18px)] whitespace-nowrap ${i===ACTIVE_STEP?"text-[#006236] font-semibold":"text-[#d9d9d9]"}`}>{step}</span>
              <div className={`h-2.5 w-full max-w-[200px] rounded-full ${i===ACTIVE_STEP?"bg-[#006236]":"bg-[#d9d9d9]"}`}/>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 px-[clamp(24px,5vw,80px)] pb-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Level */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#d9d9d9] rounded-[10px] px-12 py-2.5 min-w-[180px] text-center">
              <span className="text-[#006236] text-[clamp(18px,1.8vw,28px)] font-semibold">Beginner</span>
            </div>
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-10">
            {QUESTIONS.map(q => (
              <div key={q.id}>
                <p className="text-[clamp(18px,1.6vw,26px)] text-black font-semibold mb-4">{q.question}</p>
                <div className="flex flex-col gap-2.5">
                  {q.options.map((opt, idx) => {
                    const selected = answers[q.id] === idx;
                    return (
                      <button key={idx} onClick={() => setAnswers({...answers, [q.id]: idx})}
                        className={`w-full max-w-[500px] px-6 py-3.5 rounded-full border-none cursor-pointer text-left transition-colors ${selected ? "bg-[#006236] text-white" : "bg-[#d9d9d9] text-[#a7a7a7]"}`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Nav + Timer */}
          <div className="flex items-center justify-between mt-12 flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider"><ChevronLeft/> PREVIOUS</button>
            <div className="bg-[#d9d9d9] rounded-[10px] px-8 py-2.5 text-center">
              <span className="text-[#006236] text-[clamp(16px,1.4vw,24px)] font-semibold whitespace-nowrap">Time Left: {formatTime(timeLeft)}</span>
            </div>
            <button className="flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider">NEXT <ChevronRight/></button>
          </div>

          <p className="text-center mt-8">
            <span className="text-[#7d807f]">If You Need Our Help? </span>
            <a href="#" className="text-[#006236] no-underline">contact us</a>
          </p>
        </div>
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
