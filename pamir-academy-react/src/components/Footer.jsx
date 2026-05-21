const Footer = () => {
  return (
    <footer className="bg-[#0a2e1a] mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 py-12 sm:py-16">
        {/* About */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold text-base mb-1">About</h3>
          <a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">About</a>
          <a href="/footer/our-pillars" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Impact</a>
          <a href="/footer/our-pillars" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Our Mission</a>
          <a href="/footer/our-pillars" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Our Vision</a>
          <a href="/footer/our-pillars" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Our Values</a>
        </div>
        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold text-base mb-1">Contact</h3>
          <a href="/footer/contact" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Contact</a>
          <a href="/footer/contact" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Help Center</a>
          <a href="/footer/contact" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Share Story</a>
          <a href="mailto:pamiracademy425@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Email</a>
        </div>
        {/* Location */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold text-base mb-1">Location</h3>
          <a href="/footer/locations" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Location</a>
          <a href="/footer/locations" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Khorog</a>
          <a href="/footer/locations" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Dubai</a>
          <a href="/footer/locations" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Moscow</a>
          <a href="/footer/locations" className="text-gray-400 hover:text-white transition-colors text-sm leading-relaxed no-underline">Shughnan</a>
        </div>
      </div>
      {/* Follow Us */}
      <div className="flex justify-center items-center gap-6 pb-6">
        <span className="text-white text-sm font-medium">Follow Us</span>
        <a href="https://www.instagram.com/pamiracademy/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
          <img className="w-7 h-7" src="/icons/follow-us/Instagram.png" alt="Instagram" />
        </a>
        <a href="https://www.linkedin.com/company/pamiracademy/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
          <img className="w-7 h-7" src="/icons/follow-us/LinkIn.png" alt="LinkedIn" />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
          <img className="w-7 h-7" src="/icons/follow-us/x.png" alt="X" />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
          <img className="w-8 h-8" src="/icons/follow-us/tiktok.png" alt="TikTok" />
        </a>
        <a href="https://www.youtube.com/@pamiracademy8545" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
          <img className="w-9 h-7" src="/icons/follow-us/youtube.png" alt="YouTube" />
        </a>
      </div>
      {/* Copyright bar */}
      <div className="border-t border-white/10 mt-2 pt-6 pb-6 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} Pamir Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
