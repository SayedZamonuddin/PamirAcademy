import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';
import '../styles/general.css';
import '../styles/subjects.css';
import '../styles/main-page-responsive-css/responsive-general.css';
import '../styles/main-page-responsive-css/responsive-subjects.css';
import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const Subjects = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [videoIndexes, setVideoIndexes] = useState({});

  const subjectData = {
    'English': [
      { videoLink: 'https://www.youtube.com/embed/kPhHUfsxjOM?si=xwnKe0Q_8H2XQ7sT', videoTitle: 'ABC', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/ofV5xruTYpQ?si=KoS1nv_LIVkzTmgC', videoTitle: 'English Alphabet Pronunciation', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/W5uxBmclru0?si=vIsQV2Z3I-sR4tR7', videoTitle: 'Pronunciation of letter A', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/VaGbjZ9EvEc?si=lVMsvVW9dxW-LtME', videoTitle: 'Pronunciation of letter C', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/PG3E5azsb1Q?si=1WfHF63Wu-QeCnJA', videoTitle: 'Pronunciation of letter E', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/Evu2QpkYeoI?si=OmYzAh099BYDc4qh', videoTitle: 'Pronunciation of letter G', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/x4WVAr17CaQ?si=mRN20Wqrbb_7eeO9', videoTitle: 'Pronunciation of letter H', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/QOHa-Slp4cg?si=IQCBB2aYOpSnoyxZ', videoTitle: 'Pronunciation of letter i', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/vT-L1y2y12Y?si=-48eTmeaHALeNRKJ', videoTitle: 'Pronunciation of letter J & K', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/-Hc4hKXaY8M?si=XBInZMztRKgcKHG_', videoTitle: 'Pronunciation of letter L & M', videoExercise: 'Exercise' }
    ],
    'Basic Math (SAT)': [
      { videoLink: 'https://www.youtube.com/embed/XWymxTLPAUc?si=UjI_7mjpuW57YFP8', videoTitle: 'Our Math Course Introduction', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/3yBd3mUw-_g?si=UYjV3SRCqaYT2D2n', videoTitle: 'Real Numbers', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/S0UhUk82AiU?si=JzrTqUdGiXsLFkpD', videoTitle: 'Addition, Subtraction, Multiplication, Division', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/Dpto_jLWlxU?si=RUvAWUJ9iJ7_uLqV', videoTitle: 'Decimal: Addition, Subtraction, Multiplication, Division', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/GS_lFe37PhE?si=OaRavmpX1D-oHWU7', videoTitle: 'Fraction: Addition,Subtraction, Multiplication, Division', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/zrqCLQbVg0c?si=2Ddqr6bF51pGRppk', videoTitle: 'Numbers Conversion fraction, decimal, mixed', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/pqSZGhY3Ztk?si=QdFGV8rAU4xIIIRz', videoTitle: 'mixed fraction and LCM', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/pqSZGhY3Ztk?si=hxFbKmojyfz8aqoB', videoTitle: 'Complex Fractions', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/gQwlneMms-A?si=dMtRZqAI567InClc', videoTitle: 'Numbers Properties', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/LmS6_i2dUwM?si=HKljqd-wm_3iuaCU', videoTitle: 'multiple, factor/divisor, greatest common factor (GCF),power rising', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/kFwMZ0YM034?si=tsPDyTnwJ96lQgXN', videoTitle: 'Consecutive Integers', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/dcGrP9D_M8w?si=3HFwm1WcKOD41eNt', videoTitle: 'Order of operations', videoExercise: 'Exercise' }
    ],
    'Science': [
      { videoLink: 'https://www.youtube.com/embed/C9XPn9yDcG0?si=nu7Ns3lzFYqfU_La', videoTitle: 'What is Science?', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/JWcNgryCTp8?si=Rul6aZbFL650i0Bn', videoTitle: 'Types of Science', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/sqk2RjWI2Kw?si=pdHTZ9mZc5Qv-tls', videoTitle: 'Big Bang', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/z5RdIzdDaxA?si=RY8CUbY1hwkQaI1W', videoTitle: 'Solar System', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/h33YDVC7uFM?si=lL6IU2zESSNpOHVg', videoTitle: 'Introduction to Our Planets', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/e3ZS_VUjpCI?si=bTnDYO8W83dU6JOH', videoTitle: 'Mercury', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/yU1WyZYjpx4?si=wsliW2t9p0RHgo9i', videoTitle: 'Venus', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/VYvjBZoKyTY?si=XRUyHWoPh0jA2NoF', videoTitle: 'Our Earth', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/QK1ME70exes?si=flKgL3cqiWI9q3-9', videoTitle: 'Mars planet', videoExercise: 'Exercise' }
    ],
    'Bamaza Matematica': [
      { videoLink: 'https://www.youtube.com/embed/wUcZUN3BJ9E?si=MR359BlEzlnzphZm', videoTitle: 'How to take square root of any number?', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/MwPNcZCLhlw?si=ONSdcDQb7RY_utkH', videoTitle: 'Easy and Fast addition', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/HYLXt_kYFy8?si=CzCAse83T7JFFcn7', videoTitle: 'Osenath Tar', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/47AJkesrRFA?si=oUeAH2nDwAsm4Gdk', videoTitle: 'Osenath Zarb', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/t0u5HTZJ4qM?si=G5j_PtiBa0XN4-Fn', videoTitle: 'Resha Famtow', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/Nctw754t0y0?si=_KxWmgxK5jOnZ362', videoTitle: 'Unit conversion', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/TmcnPqJtcWs?si=vTb4RHF8aUbauCFv', videoTitle: 'Math11', videoExercise: 'Exercise' }
    ],
    'Khimya Darsen': [
      { videoLink: 'https://www.youtube.com/embed/iNdbJlAUqmU?si=eypTqnVprAj0n5jW', videoTitle: 'Introduction of chemistry course', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/EXJ8hxm5GP0?si=mSk-6UfpAPNYJyJN', videoTitle: 'Matter', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/SlhPg3gv-uY?si=GEn58cYzR3VZlETk', videoTitle: 'States of Matter and Structure of Atom', videoExercise: 'Exercise' },
      { videoLink: 'https://www.youtube.com/embed/alHF1COGsmg?si=6gLZ_TuggFFx0d3k', videoTitle: 'Atomic Number and Atomic Mass', videoExercise: 'Exercise' }
    ],
    'Shorts': [
      { videoLink: 'https://www.youtube.com/embed/kcTePGuU49U?si=2tnQoYwyiLLCB8NB', videoTitle: 'Easy way of multiplication', videoExercise: 'Exercise' }
    ]
  };

  const subjects = Object.keys(subjectData);

  const toggleSubject = (subjectName) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }));
    if (!expandedSubjects[subjectName]) {
      setVideoIndexes(prev => ({
        ...prev,
        [subjectName]: prev[subjectName] || 0
      }));
    }
  };

  const handleVideoNavigation = (subjectName, direction) => {
    const videos = subjectData[subjectName];
    const currentIndex = videoIndexes[subjectName] || 0;
    if (direction === 'left' && currentIndex > 0) {
      setVideoIndexes(prev => ({ ...prev, [subjectName]: currentIndex - 1 }));
    } else if (direction === 'right' && currentIndex < videos.length - 1) {
      setVideoIndexes(prev => ({ ...prev, [subjectName]: currentIndex + 1 }));
    }
  };

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
          {/* Subjects */}
          <div className="title-subjects-css">
            <div className="subjects-white-banner-css">
              <p className="subjects-text-css">Subjects</p>
            </div>
          </div>

          {subjects.map((subjectName) => {
            const videos = subjectData[subjectName];
            const isExpanded = expandedSubjects[subjectName];
            const currentVideoIndex = videoIndexes[subjectName] || 0;
            const currentVideo = videos[currentVideoIndex];

            return (
              <div 
                key={subjectName} 
                className="subject-container-css"
                style={{ height: isExpanded ? '500px' : '60px' }}
              >
                <div className="subject-title-container-css">
                  <div 
                    className="left-arrow-container-css left-arrow-container-js"
                    style={{ display: isExpanded && currentVideoIndex > 0 ? 'inline-block' : 'none' }}
                    onClick={() => handleVideoNavigation(subjectName, 'left')}
                  >
                    {isExpanded && currentVideoIndex > 0 && (
                      <img className="left-arrow-css left-arrow-js" src="/icons/subjects-icons/moving-buttons/moving-left.png" alt="Previous" />
                    )}
                  </div>
                  <div className="subjects-title-css">{subjectName}</div>
                  <div 
                    className="right-arrow-container-css right-arrow-container-js"
                    style={{ display: isExpanded && currentVideoIndex < videos.length - 1 ? 'inline-block' : 'none' }}
                    onClick={() => handleVideoNavigation(subjectName, 'right')}
                  >
                    {isExpanded && currentVideoIndex < videos.length - 1 && (
                      <img className="right-arrow-css right-arrow-js" src="/icons/subjects-icons/moving-buttons/moving-right.png" alt="Next" />
                    )}
                  </div>
                  <img 
                    className="down-icon-css down-icon-js" 
                    src={isExpanded ? '/icons/subjects-icons/up.png' : '/icons/subjects-icons/down.png'} 
                    alt="Toggle Container"
                    onClick={() => toggleSubject(subjectName)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                {isExpanded && (
                  <>
                    <div className="video-container-css video-container-js">
                      <iframe 
                        className="video-css" 
                        src={currentVideo.videoLink} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="video-title-exercise-css video-title-exercise-js">
                      <button className="video-title-css">{currentVideo.videoTitle}</button>
                      <button className="exercise-css">{currentVideo.videoExercise}</button>
                    </div>
                    <div className="points-vidoes-container-css points-vidoes-container-js">
                      {videos.map((_, index) => (
                        <div 
                          key={index}
                          className={`points-vidoes-css points-vidoes-js ${index === currentVideoIndex ? 'active' : ''}`}
                          onClick={() => setVideoIndexes(prev => ({ ...prev, [subjectName]: index }))}
                          style={{ cursor: 'pointer' }}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Subjects;

