import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/general.css';
import '../../../styles/registration/reg-as.css';
import '../../../styles/registration/student-reg/personal-info.css';
import '../../../styles/registration/student-reg/subjects.css';

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

  const handleNext = () => {
    if (selectedSubjects.length > 0) {
      localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
      navigate('/register/student/exam-start');
    }
  };

  const handlePrevious = () => {
    navigate('/register/student/personal-info');
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
            <div className="main-container-steps flex flex-wrap justify-between gap-2 sm:gap-4 w-full">
              <div className="step-personal-info-container flex flex-col items-center">
                <p className="step-personal-info-text text-sm sm:text-base">Personal Info</p>
                <div className="step-color-personal-info"></div>
              </div>
              <div className="step-subject-container flex flex-col items-center">
                <p className="step-subject-text text-sm sm:text-base">Subject</p>
                <div className="step-color-personal-info"></div>
              </div>
              <div className="step-exam-container flex flex-col items-center">
                <p className="step-exam-text text-sm sm:text-base">Exam</p>
                <div className="step-color-exam"></div>
              </div>
              <div className="step-payment-container flex flex-col items-center">
                <p className="step-payment-text text-sm sm:text-base">Payment</p>
                <div className="step-color-payment"></div>
              </div>
            </div>

            <div className="subjects-container">
              <p className="subjects-question">Which subject(s) do you want to study?</p>
              <div className="subjects-grid">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    className={`subjects-css ${selectedSubjects.includes(subject) ? 'active' : ''}`}
                    onClick={() => toggleSubject(subject)}
                  >
                    <span>{subject}</span>
                    <input
                      className="checkbox-css"
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => {}}
                    />
                  </button>
                ))}
              </div>

              <div className="previous-next-container-css flex flex-row justify-between items-center gap-4 w-full mt-6">
                <button className="previous-btn-css" onClick={handlePrevious}>
                  <div className="previous-icon-container">
                    <img className="previous-icon" src="/registration-icons/prev-next/previous.png" alt="Previous" />
                  </div>
                  <p className="previous-text">PREVIOUS</p>
                </button>
                <button
                  className="next-btn-css next-btn-js"
                  onClick={handleNext}
                  disabled={selectedSubjects.length === 0}
                  style={{
                    backgroundColor: selectedSubjects.length > 0 ? 'rgb(0,98,54)' : 'gray',
                    cursor: selectedSubjects.length > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  <p className="next-text">NEXT</p>
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

export default SubjectSelection;

