import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveStudentSubjects } from '../../../utils/registrationApi';

const SubjectSelection = () => {
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const subjects = ['English', 'Math', 'Physics', 'Chemistry', 'History', 'Biology'];

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNext = async () => {
    if (selectedSubjects.length > 0) {
      localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
      try { await saveStudentSubjects(selectedSubjects); } catch { /* API may be offline */ }
      navigate('/register/student/exam-start');
    }
  };

  const handlePrevious = () => {
    navigate('/register/student/personal-info');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <a href="/"><img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" /></a>
        </div>
      </header>

      {/* Steps */}
      <div className="px-[clamp(24px,5vw,80px)] py-8 bg-white">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
          {['Personal Info', 'Subject', 'Exam', 'Payment'].map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-2.5 w-full max-w-[200px] rounded-full ${i <= 1 ? 'bg-brand' : 'bg-gray-200'}`} />
              <span className={`text-[clamp(12px,1.2vw,18px)] whitespace-nowrap ${i <= 1 ? 'text-brand font-semibold' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-[800px] mx-auto px-4 mt-10">
        <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10">
          <p className="text-brand text-xl font-bold text-center mb-6">Which subject(s) do you want to study?</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-[600px] mx-auto">
            {subjects.map((subject) => (
              <button
                key={subject}
                className={`flex items-center justify-between px-5 py-3.5 rounded-full border-2 border-brand transition-all font-medium text-sm ${
                  selectedSubjects.includes(subject)
                    ? 'bg-brand text-white'
                    : 'bg-white text-brand hover:bg-brand-light'
                }`}
                onClick={() => toggleSubject(subject)}
              >
                <span>{subject}</span>
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => {}}
                  className="accent-white ml-2"
                />
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center w-full max-w-[600px] mx-auto mt-8">
            <button
              className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full border-none cursor-pointer font-medium text-sm hover:bg-brand-dark transition-colors"
              onClick={handlePrevious}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              PREVIOUS
            </button>
            <button
              className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full border-none cursor-pointer font-medium text-sm hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={selectedSubjects.length === 0}
            >
              NEXT
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectSelection;
