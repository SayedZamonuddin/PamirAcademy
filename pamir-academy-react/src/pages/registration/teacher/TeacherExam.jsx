import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sampleQuestions } from '../../../data/sampleQuestions';
import { submitTeacherExam } from '../../../utils/registrationApi';

const TeacherExam = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [answers, setAnswers] = useState({});
  const questions = sampleQuestions[subject]?.advanced || sampleQuestions[subject]?.intermediate || sampleQuestions[subject]?.beginner || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer && userAnswer.toString().toLowerCase().trim() === q.correctAnswer?.toString().toLowerCase().trim()) {
        score++;
      }
    });
    return { score, total: questions.length, percentage: Math.round((score / questions.length) * 100) };
  };

  const handleSubmit = async () => {
    const { score, total, percentage } = calculateScore();
    const timeSpent = 3600 - timeLeft;
    try { await submitTeacherExam(subject, answers, timeSpent); } catch { /* API may be offline */ }
    if (percentage >= 70) {
      localStorage.setItem('teacherExamPassed', 'true');
      navigate('/register/teacher/demo-session');
    } else {
      alert(`Your score is ${percentage}%. You need at least 70% to proceed. Please try again.`);
      navigate('/register/teacher/subjects');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <a href="/"><img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" /></a>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-6 sm:mb-8">
              <h2 className="text-brand text-lg sm:text-xl md:text-2xl font-bold m-0">
                Teacher Exam: {subject}
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 sm:px-5 py-2 sm:py-3 rounded-[10px]">
                <p className="m-0 text-brand text-sm sm:text-base">Time Left:</p>
                <p className={`m-0 font-bold text-base sm:text-lg md:text-xl ${timeLeft < 300 ? 'text-red-600' : 'text-brand'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              {questions.map((q, index) => (
                <div key={q.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-[10px]">
                  {q.question && (
                    <div className="mb-4 p-3 sm:p-4 bg-brand/10 rounded-[5px] text-sm sm:text-base">
                      {q.question}
                    </div>
                  )}
                  <p className="text-brand font-bold mb-4 text-sm sm:text-base">
                    <span>{index + 1}.</span> {q.instruction}
                  </p>

                  {q.type === 'radio' && q.options && (
                    <div className="flex flex-col gap-2">
                      {q.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswerChange(q.id, option)}
                          className={`w-full p-3 text-left rounded-[5px] border-2 border-brand transition-colors ${
                            answers[q.id] === option
                              ? 'bg-brand/20'
                              : 'bg-white hover:bg-brand/5'
                          }`}
                        >
                          <input
                            type="radio"
                            checked={answers[q.id] === option}
                            onChange={() => {}}
                            className="mr-2"
                          />
                          <span className="text-sm sm:text-base">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full p-3 rounded-[5px] border-2 border-brand text-sm sm:text-base focus:outline-brand"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end w-full mt-8">
              <button
                className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full border-none cursor-pointer font-medium text-sm hover:bg-brand-dark transition-colors"
                onClick={handleSubmit}
              >
                SUBMIT
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherExam;

