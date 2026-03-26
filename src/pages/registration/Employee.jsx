import { useNavigate } from 'react-router-dom';
import '../../styles/general.css';
import '../../styles/registration/reg-as.css';

const Employee = () => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen">
      <div className="logo-login-container-css">
        <div className="logo-container-css">
          <a href="/">
            <img className="pamir-academy-logo" src="/logo/final_logo.svg" alt="Pamir Academy Logo" />
          </a>
        </div>
      </div>

      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          <div className="steps-form-container w-full max-w-[1000px] mx-auto px-4">
            <div className="w-full bg-[rgba(217,217,217,0.4)] p-6 sm:p-10 md:p-14 rounded-[20px] min-h-[400px] flex flex-col items-center justify-center mt-[50px]">
            <h1 className="text-[#006236] text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
              Employee Recruitment
            </h1>
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[15px] text-center max-w-[700px] w-full">
              <p className="text-[#006236] text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-5">
                We are currently recruiting employees through email.
              </p>
              <p className="text-[#006236] text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                If you are interested in joining our team, please send your resume and cover letter to:
              </p>
              <a
                href="mailto:pamiracademy425@gmail.com"
                className="text-[#006236] text-lg sm:text-xl md:text-2xl font-bold underline hover:text-[#004d2a] transition-colors block mb-4 sm:mb-6"
              >
                pamiracademy425@gmail.com
              </a>
              <p className="text-[#006236] text-xs sm:text-sm md:text-base mt-4 sm:mt-6 italic">
                We will review your application and get back to you soon.
              </p>
            </div>

            <div className="previous-next-container-css flex justify-center w-full mt-8">
              <button className="previous-btn-css" onClick={handlePrevious}>
                <div className="previous-icon-container">
                  <img className="previous-icon" src="/registration-icons/prev-next/previous.png" alt="Previous" />
                </div>
                <p className="previous-text">PREVIOUS</p>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;

