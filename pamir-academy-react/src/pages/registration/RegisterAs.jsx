import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { apiPut } from "../../utils/api";
import ApplyModal from "../../components/ApplyModal";

const RegisterAs = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setShowApplyModal(true);
    }
  }, [currentUser]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleNext = async () => {
    if (!selectedRole) return;

    try { await apiPut("/auth/me/", { display_name: "", role: selectedRole }); } catch { /* API may be offline */ }

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

  const RoleButton = ({ role, label }) => (
    <div
      onClick={() => handleRoleSelect(role)}
      className={`w-full px-6 py-3 sm:py-4 rounded-full border-2 border-brand cursor-pointer transition-all text-center font-medium ${
        selectedRole === role
          ? "bg-brand text-white scale-[1.02]"
          : "bg-white text-brand hover:bg-brand-light"
      }`}
    >
      {label}
    </div>
  );

  if (!currentUser) {
    return (
      <>
        {showApplyModal && (
          <ApplyModal
            onClose={() => { setShowApplyModal(false); navigate("/"); }}
            onSwitchToLogin={() => { setShowApplyModal(false); navigate("/"); }}
          />
        )}
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center p-8">
            <p className="text-xl font-bold text-brand mb-4">Please create an account first</p>
            <p className="text-gray-600">You need to create an account before proceeding with registration.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-[clamp(24px,5vw,80px)] py-4">
        <div className="h-[50px] flex items-center">
          <a href="/"><img src="/logo/final_logo.svg" alt="Pamir Academy Logo" className="h-full w-auto object-contain" /></a>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-4 mt-16">
        <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 min-h-[400px] flex flex-col items-center">
          <p className="text-brand text-xl font-bold text-center mb-6 sm:mb-8">
            What do you want to register as?
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[500px] mx-auto">
            <RoleButton role="student" label="Student" />
            <RoleButton role="teacher" label="Teacher" />
            <RoleButton role="employee" label="Employee" />
          </div>

          {/* Previous & Next */}
          <div className="flex justify-between items-center w-full max-w-[500px] mx-auto mt-8">
            <button
              className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full border-none cursor-pointer font-medium text-sm hover:bg-brand-dark transition-colors"
              onClick={handlePrevious}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              PREVIOUS
            </button>

            <button
              className="flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-full border-none cursor-pointer font-medium text-sm hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={!selectedRole}
            >
              NEXT
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAs;
