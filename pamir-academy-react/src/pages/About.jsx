import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';

const About = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const categoryButtons = [
    { label: 'News', variant: 'light' },
    { label: 'School', variant: 'light' },
    { label: 'Art', variant: 'dark' },
    { label: 'Music', variant: 'light' },
    { label: 'Culture', variant: 'light' },
    { label: 'Partners', variant: 'outline' },
    { label: 'Values', variant: 'light' },
    { label: 'Mission', variant: 'light' },
  ];

  const getButtonClasses = (variant) => {
    switch (variant) {
      case 'dark':
        return 'bg-brand text-white hover:bg-brand-dark';
      case 'outline':
        return 'bg-transparent text-brand border-2 border-brand hover:bg-brand hover:text-white';
      default:
        return 'bg-gray-100 text-brand hover:bg-gray-200';
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

      <div className="max-w-[1100px] mx-auto px-5">
        {/* Page Title */}
        <div className="mt-16 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center bg-brand rounded-xl py-4">About</h1>
        </div>

        {/* About Video */}
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-card">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/ySjP1Pkeb7k?si=UFHq8Aj-n3lOvfZM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 mb-8">
          {categoryButtons.map((btn) => (
            <button
              key={btn.label}
              className={`px-6 py-2.5 rounded-full text-base font-medium cursor-pointer transition-all ${getButtonClasses(btn.variant)}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
