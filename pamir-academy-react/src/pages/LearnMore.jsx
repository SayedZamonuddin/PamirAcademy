import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';

const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const LearnMore = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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

      <div className="max-w-[1100px] mx-auto px-5">
        {/* Page Title */}
        <div className="mt-16 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center bg-brand rounded-xl py-4">Learn More</h1>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="text-brand font-medium text-base pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5">
                  <div className="bg-brand text-white rounded-xl p-4 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LearnMore;
