import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';
import '../styles/general.css';
import '../styles/about.css';
import '../styles/main-page-responsive-css/responsive-general.css';
import '../styles/main-page-responsive-css/responsive-about.css';
import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const About = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <div>
      <Header 
        onLoginClick={() => setShowLoginModal(true)} 
        onApplyClick={() => setShowApplyModal(true)} 
      />
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSwitchToApply={() => { setShowLoginModal(false); setShowApplyModal(true); }}
        />
      )}
      
      {showApplyModal && (
        <ApplyModal 
          onClose={() => setShowApplyModal(false)} 
          onSwitchToLogin={() => { setShowApplyModal(false); setShowLoginModal(true); }}
        />
      )}

      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          {/* About */}
          <div className="title-about-css">
            <div className="about-white-banner-css">
              <p className="about-text-css">About</p>
            </div>
          </div>

          {/* About Video */}
          <div className="about-video-container-css">
            <iframe 
              className="about-video-css" 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/ySjP1Pkeb7k?si=UFHq8Aj-n3lOvfZM" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>

          {/* Other components */}
          <div className="components-main-container-css">
            <div className="news-school-container">
              <button className="new-css">News</button>
              <button className="school-css">School</button>
            </div>
            <div className="art-container-css">
              <button className="art-css">Art</button>
            </div>
            <div className="music-culture-container-css">
              <button className="music-css">Music</button>
              <button className="culture-css">Culture</button>
            </div>
            <div className="partners-container-css">
              <button className="partners-css">Partners</button>
            </div>
            <div className="values-mussion-container-css">
              <button className="values-css">Values</button>
              <button className="mission-css">Mission</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

