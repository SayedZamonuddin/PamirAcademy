import { useNavigate } from 'react-router-dom';

const Employee = () => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <a href="/"><img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" /></a>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-[800px] mx-auto px-4 mt-16">
        <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 md:p-14 flex flex-col items-center">
          <h1 className="text-brand text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
            Employee Recruitment
          </h1>
          <div className="bg-surface-panel p-6 sm:p-8 md:p-10 rounded-2xl text-center max-w-[700px] w-full">
            <p className="text-brand text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-5">
              We are currently recruiting employees through email.
            </p>
            <p className="text-brand text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
              If you are interested in joining our team, please send your resume and cover letter to:
            </p>
            <a
              href="mailto:pamiracademy425@gmail.com"
              className="text-brand text-lg sm:text-xl md:text-2xl font-bold underline hover:text-brand-dark transition-colors block mb-4 sm:mb-6"
            >
              pamiracademy425@gmail.com
            </a>
            <p className="text-brand text-xs sm:text-sm md:text-base mt-4 sm:mt-6 italic">
              We will review your application and get back to you soon.
            </p>
          </div>

          <div className="flex justify-center w-full mt-8">
            <button
              className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full border-none cursor-pointer font-medium text-sm hover:bg-brand-dark transition-colors"
              onClick={handlePrevious}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              PREVIOUS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
