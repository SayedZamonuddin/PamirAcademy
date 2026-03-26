import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import ApplyModal from "../components/ApplyModal";
import { useState } from "react";
import "../styles/general.css";
import "../styles/footer/footer.css";
import "../styles/footer/footer-css/our-pillars.css";
import "../styles/main-page-responsive-css/responsive-general.css";
import "../styles/footer/footer-responsive-css/responsive-footer.css";
import "../styles/footer/footer-responsive-css/responsive-our-pillars.css";

const OurPillars = () => {
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
          {/* Pillars Title */}
          <div className="title-pillars-css">
            <div className="pillars-white-banner-css">
              <p className="pillars-text-css">Our Pillars</p>
            </div>
          </div>

          {/* Mission */}
          <div className="title-container-css">
            <p className="title-css">Mission</p>
          </div>
          <div className="text-container-css">
            <p className="text-css">
              Pamir Academy is dedicated to revolutionizing education in
              underrepresented communities by providing accessible, high-quality
              online learning. Our mission is to equip students with essential
              academic and practical skills, fostering a mindset of curiosity,
              adaptability, and self-improvement. We strive to go beyond
              traditional education by encouraging critical thinking,
              creativity, and problem-solving, enabling learners to thrive in an
              ever-evolving global landscape.
            </p>
          </div>

          {/* Vision */}
          <div className="title-container-css">
            <p className="title-css">Vision</p>
          </div>
          <div className="text-container-css">
            <p className="text-css">
              We envision a world where every individual, regardless of
              geographic or socioeconomic barriers, has the opportunity to
              learn, grow, and succeed. Pamir Academy aims to become a catalyst
              for educational transformation, inspiring a new generation of
              independent thinkers and skilled professionals. Through innovative
              teaching methods and a commitment to lifelong learning, we aspire
              to build a future where knowledge is accessible to all and
              education drives positive change in communities.
            </p>
          </div>

          {/* Values */}
          <div className="title-container-css">
            <p className="title-css">Values</p>
          </div>
          <div className="text-container-css">
            <p className="text-css">
              At Pamir Academy, we uphold the values of excellence, inclusivity,
              and continuous learning. We believe in providing high-quality
              education that meets the needs of our students and inspires them
              to grow. Inclusivity is at the heart of our mission, ensuring that
              learning opportunities are available to everyone, regardless of
              their circumstances. We also value lifelong learning, encouraging
              students to develop new skills, adapt to changing environments,
              and embrace education as a continuous journey toward personal and
              professional success.
            </p>
          </div>

          {/* Impact */}
          <div className="title-container-css">
            <p className="title-css">Impact</p>
          </div>
          <div className="text-container-css">
            <p className="text-css">
              Pamir Academy has made a significant impact by providing quality
              online education to students in Gorno-Badakhshan and beyond.
              Through its diverse courses in English, math, programming, and
              even music, the academy has empowered learners with essential
              skills for academic and professional success. By fostering a
              culture of continuous learning, it has helped students prepare for
              higher education, enhance their career prospects, and develop
              critical thinking abilities. The academy's accessible and flexible
              teaching methods have bridged educational gaps, making learning
              opportunities available to those with limited access to
              traditional institutions. Through its dedicated efforts, Pamir
              Academy is shaping a generation of skilled and confident
              individuals ready to contribute to their communities.
            </p>
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

export default OurPillars;
