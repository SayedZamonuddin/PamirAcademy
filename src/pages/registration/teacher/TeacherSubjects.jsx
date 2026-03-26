import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/general.css';
import '../../../styles/registration/reg-as.css';
import '../../../styles/registration/student-reg/subjects.css';

const TeacherSubjects = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = ['English', 'Math', 'Physics', 'Chemistry', 'History', 'Biology'];

  const handleNext = () => {
    if (selectedSubject) {
      localStorage.setItem('teacherSubject', selectedSubject);
      navigate(`/register/teacher/exam/${selectedSubject}`);
    }
  };

  const handlePrevious = () => {
    navigate('/register');
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
            <div className="subjects-container">
              <p className="subjects-question">Which subject do you want to teach?</p>
              <div className="subjects-grid">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    className={`subjects-css ${selectedSubject === subject ? 'active' : ''}`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
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
                  disabled={!selectedSubject}
                  style={{
                    backgroundColor: selectedSubject ? 'rgb(0,98,54)' : 'gray',
                    cursor: selectedSubject ? 'pointer' : 'not-allowed'
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

export default TeacherSubjects;

