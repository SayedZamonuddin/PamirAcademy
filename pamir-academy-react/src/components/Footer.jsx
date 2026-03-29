import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const Footer = () => {
  return (
    <footer className="footer-main-container-css">
      <div className="about-contact-location-container-css">
        {/* About */}
        <div className="about-container-css">
          <a href="/about" className="about-css">About</a>
          <a href="/footer/our-pillars" className="about-css">Impact</a>
          <a href="/footer/our-pillars" className="about-css">Our Mission</a>
          <a href="/footer/our-pillars" className="about-css">Our Vision</a>
          <a href="/footer/our-pillars" className="about-css">Our Values</a>
        </div>
        {/* Contact */}
        <div className="contact-container-css">
          <a href="/footer/contact" className="contact-css">Contact</a>
          <a href="/footer/contact" className="contact-css">Help Center</a>
          <a href="/footer/contact" className="contact-css">Share Story</a>
          <a href="mailto:pamiracademy425@gmail.com" className="contact-css">Email</a>
        </div>
        {/* Location */}
        <div className="location-container-css">
          <a href="/footer/locations" className="location-css">Location</a>
          <a href="/footer/locations" className="location-css">Khorog</a>
          <a href="/footer/locations" className="location-css">Dubai</a>
          <a href="/footer/locations" className="location-css">Moscow</a>
          <a href="/footer/locations" className="location-css">Shughnan</a>
        </div>
      </div>
      {/* Follow Us */}
      <div className="follow-us-container-main-css">
        <div className="follow-us-container-css">
          <a className="follow-us-css">Follow Us</a>
          <a href="https://www.instagram.com/pamiracademy/" target="_blank" rel="noopener noreferrer" className="follow-us-css">
            <img className="follow-us-img-css" src="/icons/follow-us/Instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.linkedin.com/company/pamiracademy/" target="_blank" rel="noopener noreferrer" className="follow-us-css">
            <img className="follow-us-img-css" src="/icons/follow-us/LinkIn.png" alt="LinkedIn" />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer" className="follow-us-css">
            <img className="follow-us-img-css" src="/icons/follow-us/x.png" alt="X" />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer" className="follow-us-css">
            <img className="follow-us-img-tiktok-css" src="/icons/follow-us/tiktok.png" alt="TikTok" />
          </a>
          <a href="https://www.youtube.com/@pamiracademy8545" target="_blank" rel="noopener noreferrer" className="follow-us-css">
            <img className="follow-us-img-youtube-css" src="/icons/follow-us/youtube.png" alt="YouTube" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

