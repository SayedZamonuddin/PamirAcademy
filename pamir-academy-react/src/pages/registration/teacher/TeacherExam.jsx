import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sampleQuestions } from '../../../data/sampleQuestions';
import { submitTeacherExam } from '../../../utils/registrationApi';
import '../../../styles/general.css';
import '../../../styles/registration/reg-as.css';
import '../../../styles/registration/student-reg/personal-info.css';

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
    <div className="min-h-screen">
      <div className="logo-login-container-css">
        <div className="logo-container-css">
          <a href="/">
            <img className="pamir-academy-logo" src="/logo/final_logo.svg" alt="Pamir Academy Logo" />
          </a>
        </div>
      </div>

      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          <div className="steps-form-container w-full max-w-[1000px] mx-auto px-4">
            <div className="w-full bg-[rgba(217,217,217,0.4)] p-6 sm:p-8 md:p-10 rounded-[20px] mt-[50px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-6 sm:mb-8">
              <h2 className="text-[#006236] text-lg sm:text-xl md:text-2xl font-bold m-0">
                Teacher Exam: {subject}
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 sm:px-5 py-2 sm:py-3 rounded-[10px]">
                <p className="m-0 text-[#006236] text-sm sm:text-base">Time Left:</p>
                <p className={`m-0 font-bold text-base sm:text-lg md:text-xl ${timeLeft < 300 ? 'text-red-600' : 'text-[#006236]'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              {questions.map((q, index) => (
                <div key={q.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-[10px]">
                  {q.question && (
                    <div className="mb-4 p-3 sm:p-4 bg-[rgba(0,98,54,0.1)] rounded-[5px] text-sm sm:text-base">
                      {q.question}
                    </div>
                  )}
                  <p className="text-[#006236] font-bold mb-4 text-sm sm:text-base">
                    <span>{index + 1}.</span> {q.instruction}
                  </p>

                  {q.type === 'radio' && q.options && (
                    <div className="flex flex-col gap-2">
                      {q.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswerChange(q.id, option)}
                          className={`w-full p-3 text-left rounded-[5px] border-2 border-[#006236] transition-colors ${
                            answers[q.id] === option
                              ? 'bg-[rgba(0,98,54,0.2)]'
                              : 'bg-white hover:bg-[rgba(0,98,54,0.05)]'
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
                      className="w-full p-3 rounded-[5px] border-2 border-[#006236] text-sm sm:text-base focus:outline-[#006236]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="previous-next-container-css flex flex-row justify-between items-center gap-4 w-full mt-8">
              <div style={{ width: '160px' }}></div>
              <button
                className="next-btn-css next-btn-js"
                onClick={handleSubmit}
              >
                <p className="next-text">SUBMIT</p>
                <div className="next-icon-container">
                  <img className="next-icon" src="/registration-icons/prev-next/next.png" alt="Next" />
                </div>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherExam;

