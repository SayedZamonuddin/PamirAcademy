import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';
import '../styles/general.css';
import '../styles/exercise.css';
import '../styles/main-page-responsive-css/responsive-general.css';
import '../styles/main-page-responsive-css/responsive-exercise.css';
import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const Exercise = () => {
  const { subject, videoTitle } = useParams();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [exerciseTitle, setExerciseTitle] = useState(videoTitle || subject || 'Exercise');

  // Sample exercise questions - in a real app, this would come from an API
  const exerciseQuestions = `1. What is letter "A"?
A. First letter
B. Second letter
C. Third letter

2. How many sounds does letter "A" have?
A. One
B. Two 
C. Three

3. 'A' which alphabits language? 
A. Arabic
B. Latin
C. Cerilic

4. Can letter 'A' be silent?
A. Yes 
B. No
C. Neither 

5. Can letters ABC be good to know?
A. Yes 
B. No
C. Neither`;

  useEffect(() => {
    if (videoTitle) {
      setExerciseTitle(videoTitle);
    } else if (subject) {
      setExerciseTitle(subject);
    }
  }, [videoTitle, subject]);

  return (
    <div>
      <Header 
        onLoginClick={() => setShowLoginModal(true)} 
        onApplyClick={() => setShowApplyModal(true)} 
      />
      
      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          {/* Exercise Title */}
          <div className="title-exercise-css">
            <div className="exercise-white-banner-css">
              <p className="exercise-title-text-css">{exerciseTitle}</p>
            </div>
          </div>

          {/* Exercise Text */}
          <div className="exercise-text-main-container-css">
            <div className="exercise-text-white-banner-css">
              <pre className="exercise-text-css">{exerciseQuestions}</pre>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showApplyModal && (
        <ApplyModal onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
};

export default Exercise;


