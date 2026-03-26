import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ApplyModal from "../../components/ApplyModal";
import "../../styles/general.css";
import "../../styles/registration/reg-as.css";

const RegisterAs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      // User is not authenticated, show ApplyModal
      setShowApplyModal(true);
    }
  }, [currentUser]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (!selectedRole) return;

    if (selectedRole === "student") {
      navigate("/register/student/personal-info");
    } else if (selectedRole === "teacher") {
      navigate("/register/teacher/subjects");
    } else if (selectedRole === "employee") {
      navigate("/register/employee");
    }
  };

  const handlePrevious = () => {
    navigate("/");
  };

  // ---------------------------
  // Reusable role button UI
  // ---------------------------
  const RoleButton = ({ role, label }) => (
    <div
      onClick={() => handleRoleSelect(role)}
      className={`
        w-full px-6 py-3 sm:py-4 rounded-[25px] 
        border-2 border-[#006236] cursor-pointer transition-all 

        ${
          selectedRole === role
            ? "bg-[#006236] text-white scale-105"
            : "bg-white text-[#006236] hover:bg-[#e8f5ee]"
        }
      `}
    >
      {label}
    </div>
  );

  // Don't render registration form if user is not authenticated
  if (!currentUser) {
    return (
      <>
        {showApplyModal && (
          <ApplyModal
            onClose={() => {
              setShowApplyModal(false);
              navigate("/");
            }}
            onSwitchToLogin={() => {
              setShowApplyModal(false);
              navigate("/");
            }}
          />
        )}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-xl font-bold text-[#006236] mb-4">
              Please create an account first
            </p>
            <p className="text-gray-600">
              You need to create an account before proceeding with registration.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Logo */}
      <div className="logo-login-container-css">
        <div className="logo-container-css">
          <a href="/">
            <img
              className="pamir-academy-logo"
              src="/logo/final_logo.svg"
              alt="Pamir Academy Logo"
            />
          </a>
        </div>
      </div>

      {/* Main Body */}
      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css w-full max-w-[1055px] px-4">
          <div className="steps-form-container" style={{ marginTop: "100px" }}>
            <div className="register-main-container-css w-full max-w-[800px] mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-[400px]">
              <p className="reg-q-css text-center mb-6 sm:mb-8 text-lg sm:text-xl">
                What do you want to register as?
              </p>

              <div className="main-container-choice-css flex flex-col gap-3 sm:gap-4 w-full max-w-[500px] mx-auto">
                <RoleButton role="student" label="Student" />
                <RoleButton role="teacher" label="Teacher" />
                <RoleButton role="employee" label="Employee" />
              </div>

              {/* Previous & Next */}
              <div className="previous-next-container-css flex flex-row justify-between items-center gap-4 w-full max-w-[500px] mx-auto mt-8">
                <button className="previous-btn-css" onClick={handlePrevious}>
                  <div className="previous-icon-container">
                    <img
                      className="previous-icon"
                      src="/registration-icons/prev-next/previous.png"
                      alt="Previous"
                    />
                  </div>
                  <p className="previous-text">PREVIOUS</p>
                </button>

                <button
                  className="next-btn-css next-btn-js"
                  onClick={handleNext}
                  disabled={!selectedRole}
                  style={{
                    backgroundColor: selectedRole ? "rgb(0,98,54)" : "gray",
                    cursor: selectedRole ? "pointer" : "not-allowed",
                  }}
                >
                  <p className="next-text">NEXT</p>
                  <div className="next-icon-container">
                    <img
                      className="next-icon"
                      src="/registration-icons/prev-next/next.png"
                      alt="Next"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAs;
