import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTeacherSubject } from '../../../utils/registrationApi';

const TeacherSubjects = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = ['English', 'Math', 'Physics', 'Chemistry', 'History', 'Biology'];

  const handleNext = async () => {
    if (selectedSubject) {
      localStorage.setItem('teacherSubject', selectedSubject);
      try { await saveTeacherSubject(selectedSubject); } catch { /* API may be offline */ }
      navigate(`/register/teacher/exam/${selectedSubject}`);
    }
  };

  const handlePrevious = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <a href="/"><img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" /></a>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[800px] mx-auto px-4 mt-16">
        <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10">
          <p className="text-brand text-xl font-bold text-center mb-6">Which subject do you want to teach?</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-[600px] mx-auto">
            {subjects.map((subject) => (
              <button
                key={subject}
                className={`px-5 py-3.5 rounded-full border-2 border-brand transition-all font-medium text-sm text-center ${
                  selectedSubject === subject
                    ? 'bg-brand text-white'
                    : 'bg-white text-brand hover:bg-brand-light'
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
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
              disabled={!selectedSubject}
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

export default TeacherSubjects;
