import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import ApplyModal from "../components/ApplyModal";
import { useState } from "react";
import "../styles/general.css";
import "../styles/footer/footer.css";
import "../styles/footer/footer-css/contact.css";
import "../styles/main-page-responsive-css/responsive-general.css";
import "../styles/footer/footer-responsive-css/responsive-footer.css";
import "../styles/footer/footer-responsive-css/responsive-contact.css";

const Contact = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <div>
      <Header
        onLoginClick={() => setShowLoginModal(true)}
        onApplyClick={() => setShowApplyModal(true)}
      />

      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          {/* Contact Title */}
          <div className="title-contact-css">
            <div className="contact-white-banner-css">
              <p className="contact-text-css">Contact</p>
            </div>
          </div>

          {/* Contact Icons */}
          <div className="contact-main-container-css">
            {/* Telegram */}
            <a
              href="https://t.me/ubaidsayedi"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-container-css"
            >
              <img
                className="telegram-css"
                src="/icons/contact/telegram.png"
                alt="Telegram"
              />
            </a>
            {/* WhatsApp */}
            <a
              href="https://wa.me/992501301978"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-container-css"
            >
              <img
                className="whatsapp-css"
                src="/icons/contact/whatsapp.png"
                alt="WhatsApp"
              />
            </a>
            {/* Gmail */}
            <a
              href="mailto:pamiracademy425@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="gmail-container-css"
            >
              <img
                className="gmail-css"
                src="/icons/contact/gmail.png"
                alt="Gmail"
              />
            </a>
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

export default Contact;
