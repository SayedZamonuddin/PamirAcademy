import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';
import '../styles/general.css';
import '../styles/learn-more.css';
import '../styles/main-page-responsive-css/responsive-general.css';
import '../styles/main-page-responsive-css/responsive-learn-more.css';
import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const LearnMore = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const faqs = [
    {
      question: 'What is Pamir Academy?',
      answer: 'Pamir Academy is a platform provides high quality online teaching.'
    },
    {
      question: 'What kind of teaching does Pamir Academy provides?',
      answer: 'Pamir Academy provide two types of teaching. First, you can learn through watching videos. Second you can have one on one sessions with our professional teachers.'
    },
    {
      question: 'Why should you choose Pamir Academy?',
      answer: 'You can have high quality sessions, and you will have low cost with flexible schedule classes.'
    },
    {
      question: 'Who can study with us?',
      answer: 'Anyone having interest in learning and developing their skills. There is no restrictions on nationality, gender, race, age, or any other parameters.'
    },
    {
      question: 'Where should I get more information?',
      answer: 'Please, go down click on the contact and you can email us or send a message via WhatsApp & Telegram.'
    }
  ];

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
          {/* Learn more */}
          <div className="title-learn-more-css">
            <div className="learn-more-white-banner-css">
              <p className="learn-more-text-css">Learn More</p>
            </div>
          </div>

          {/* FAQ Items */}
          {faqs.map((faq, index) => (
            <details key={index} className="detail-q-css">
              <summary>{faq.question}</summary>
              <p className="q-answer-css">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LearnMore;

