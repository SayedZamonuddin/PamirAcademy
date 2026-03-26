const STEPS = ["Personal Information", "Exam", "Payment"];
const ACTIVE_STEP = 1;

const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

function ScoreCircle({ score, total, percentage, size }) {
  const r = 45, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const greenLen = (percentage / 100) * circ;
  const redLen = circ - greenLen;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#006236" strokeWidth="10" strokeDasharray={`${greenLen} ${redLen}`} strokeDashoffset="0" transform="rotate(-90 50 50)"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FB001D" strokeWidth="10" strokeDasharray={`${redLen} ${greenLen}`} strokeDashoffset={`${-greenLen}`} transform="rotate(-90 50 50)"/>
        <circle cx={cx} cy={cy} r={40} fill="#006236"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-white font-bold leading-tight" style={{ fontSize: `calc(${size} * 0.16)` }}>{score}/{total}</span>
        <span className="text-white font-semibold leading-tight" style={{ fontSize: `calc(${size} * 0.15)` }}>{percentage}%</span>
      </div>
    </div>
  );
}

const SUBJECTS = [
  { name: "English", completed: true, score: 22.5, total: 30, percentage: 75, level: "Intermediate" },
  { name: "Physics", completed: false },
  { name: "Programming", completed: false },
];

export default function ExamResult() {
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
          {/* Note */}
          <div className="bg-black/70 rounded-3xl px-[clamp(24px,4vw,60px)] py-8 mb-10">
            <p className="text-white text-center leading-relaxed text-[clamp(13px,1.1vw,16px)] m-0">
              <strong>Note:</strong> Now you will have an exam on each subject you chose. On each subject you will have Beginner, Intermediate, and Advance sections over 60 minutes and each section has 10 questions. After finishing each subject you can logout and come anytime to finish the other subjects. Don't worry — the exam is just to find out your level, which makes it easy for us to teach you the best.
            </p>
          </div>

          {/* Subjects */}
          <div className="flex flex-col items-center">
            {SUBJECTS.map((subject, idx) => (
              <div key={subject.name} className="w-full">
                <div className="flex justify-center mb-5">
                  <div className="bg-[#d9d9d9] rounded-[10px] px-12 py-3 min-w-[200px] text-center">
                    <span className="text-[#006236] text-[clamp(20px,2vw,32px)] font-semibold">{subject.name}</span>
                  </div>
                </div>

                {subject.completed ? (
                  <div className="flex items-center justify-center gap-[clamp(24px,4vw,60px)] mb-6 flex-wrap">
                    <div className="flex flex-col items-center gap-3">
                      <ScoreCircle score={subject.score} total={subject.total} percentage={subject.percentage} size="clamp(130px, 14vw, 200px)"/>
                      <div className="bg-[#d9d9d9] rounded-[10px] px-5 py-1">
                        <span className="text-[#006236] text-[clamp(12px,1.1vw,18px)] font-semibold">{subject.level}</span>
                      </div>
                    </div>
                    <button className="bg-[#006236] text-white px-7 py-2.5 rounded-full border-none cursor-pointer text-[clamp(14px,1.2vw,20px)] tracking-wide whitespace-nowrap">Re-Take</button>
                  </div>
                ) : (
                  <div className="flex justify-center mb-6">
                    <button className="w-[clamp(130px,12vw,180px)] h-[clamp(130px,12vw,180px)] rounded-full bg-[#006236] border-none cursor-pointer flex flex-col items-center justify-center gap-0.5 shadow-lg">
                      <span className="text-white text-[clamp(28px,3.5vw,52px)] font-bold leading-none tracking-wider">START</span>
                      <span className="text-white text-[clamp(12px,1.2vw,22px)] leading-none">60 Min</span>
                    </button>
                  </div>
                )}

                {idx < SUBJECTS.length - 1 && <div className="w-full h-1 bg-[#006236] rounded-sm my-4 mb-8"/>}
              </div>
            ))}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between mt-12">
            <button className="flex items-center gap-2 bg-[#006236] text-white px-8 py-3.5 rounded-full border-none cursor-pointer tracking-wider"><ChevronLeft/> PREVIOUS</button>
            <button className="flex items-center gap-2 bg-[#7d807f] text-white px-8 py-3.5 rounded-full border-none cursor-default tracking-wider">NEXT <ChevronRight/></button>
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
