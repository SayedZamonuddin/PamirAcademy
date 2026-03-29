import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/general.css';
import '../../../styles/registration/reg-as.css';
import '../../../styles/registration/student-reg/personal-info.css';
import '../../../styles/registration/student-reg/placement-group.css';

const PlacementAndGroupAssignment = () => {
  const navigate = useNavigate();
  const [assignedLevel, setAssignedLevel] = useState('Intermediate I');
  const [groupAssignment, setGroupAssignment] = useState(null);

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    const savedSubjects = JSON.parse(localStorage.getItem('selectedSubjects') || '[]');
    
    // Calculate overall level based on exam results
    if (savedResults.length > 0) {
      const avgPercentage = savedResults.reduce((sum, r) => sum + r.percentage, 0) / savedResults.length;
      if (avgPercentage >= 80) {
        setAssignedLevel('Advanced');
      } else if (avgPercentage >= 65) {
        setAssignedLevel('Intermediate II');
      } else if (avgPercentage >= 50) {
        setAssignedLevel('Intermediate I');
      } else {
        setAssignedLevel('Beginner');
      }
    }

    // Set group assignment (sample data)
    const primarySubject = savedSubjects[0] || 'Math';
    setGroupAssignment({
      groupName: `Study Group ${primarySubject} - Section A`,
      groupId: `SG-${primarySubject}-2026-A`,
      focus: `${primarySubject} Fundamentals & Problem Solving`,
      schedule: {
        days: ['Tuesday', 'Thursday'],
        time: '4:00 PM - 5:30 PM',
        timezone: 'UTC+05:00'
      },
      tutor: {
        name: 'Dr. Sarah Johnson',
        title: 'Senior Mathematics Instructor',
        experience: '8 years of teaching experience',
        specialization: 'Algebra, Calculus, and Statistics'
      },
      groupSize: 12,
      membersPreview: ['You', 'Alex M.', 'Jordan K.', 'Sam T.', '+8 more']
    });
  }, []);

  const handlePrevious = () => {
    navigate('/register/student/exam-result');
  };

  const handleRequestReview = () => {
    alert('Your level review request has been submitted. Our academic team will review your case within 2-3 business days.');
  };

  const handleFinish = () => {
    navigate("/");
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
            {/* Steps */}
            <div className="main-container-steps flex flex-wrap justify-between gap-2 sm:gap-4 w-full">
              <div className="step-personal-info-container flex flex-col items-center">
                <p className="step-personal-info-text text-sm sm:text-base">Personal Info</p>
                <div className="step-color-personal-info"></div>
              </div>
              <div className="step-subject-container flex flex-col items-center">
                <p className="step-subject-text text-sm sm:text-base">Subject</p>
                <div className="step-color-personal-info"></div>
              </div>
              <div className="step-exam-container flex flex-col items-center">
                <p className="step-exam-text text-sm sm:text-base">Exam</p>
                <div className="step-color-personal-info"></div>
              </div>
              <div className="step-payment-container flex flex-col items-center">
                <p className="step-payment-text text-sm sm:text-base">Placement</p>
                <div className="step-color-personal-info"></div>
              </div>
            </div>

            {/* Main Content Container */}
            <div className="placement-main-container">
              {/* Header Section */}
              <div className="placement-header-section">
                <div className="placement-header-icon">🎯</div>
                <h2 className="placement-header-title">Your Academic Placement</h2>
                <p className="placement-header-subtitle">Welcome to your personalized learning journey</p>
              </div>

              {/* Student Level Confirmation Section */}
              <div className="placement-section">
                <h3 className="placement-section-title">Your Assigned Level</h3>
                <div className="level-display-card">
                  <div className="level-badge">{assignedLevel}</div>
                  <p className="level-criteria">
                    Based on your pre-assessment scores and academic performance across all subjects
                  </p>
                  <button className="review-button" onClick={handleRequestReview}>
                    Request Level Review
                  </button>
                </div>
              </div>

              {/* Study Group Assignment Section */}
              {groupAssignment && (
                <div className="placement-section">
                  <h3 className="placement-section-title">Your Study Group</h3>
                  <div className="group-assignment-card">
                    <div className="group-header">
                      <div>
                        <h4 className="group-name">{groupAssignment.groupName}</h4>
                        <p className="group-id">ID: {groupAssignment.groupId}</p>
                      </div>
                      <div className="group-badge">Active</div>
                    </div>
                    
                    <div className="group-details">
                      <div className="group-detail-item">
                        <span className="detail-icon">📚</span>
                        <div>
                          <p className="detail-label">Focus Area</p>
                          <p className="detail-value">{groupAssignment.focus}</p>
                        </div>
                      </div>
                      
                      <div className="group-detail-item">
                        <span className="detail-icon">📅</span>
                        <div>
                          <p className="detail-label">Meeting Schedule</p>
                          <p className="detail-value">
                            {groupAssignment.schedule.days.join(' & ')}<br />
                            {groupAssignment.schedule.time} ({groupAssignment.schedule.timezone})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tutor Information Section */}
              {groupAssignment && (
                <div className="placement-section">
                  <h3 className="placement-section-title">Meet Your Tutor</h3>
                  <div className="tutor-card">
                    <div className="tutor-avatar">👨‍🏫</div>
                    <div className="tutor-info">
                      <h4 className="tutor-name">{groupAssignment.tutor.name}</h4>
                      <p className="tutor-title">{groupAssignment.tutor.title}</p>
                      <p className="tutor-experience">{groupAssignment.tutor.experience}</p>
                      <p className="tutor-specialization">
                        <strong>Specialization:</strong> {groupAssignment.tutor.specialization}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Group Roster Preview */}
              {groupAssignment && (
                <div className="placement-section">
                  <h3 className="placement-section-title">Your Study Group</h3>
                  <div className="roster-card">
                    <p className="roster-size">
                      <strong>{groupAssignment.groupSize} members</strong> in your group
                    </p>
                    <div className="roster-preview">
                      {groupAssignment.membersPreview.map((member, index) => (
                        <span key={index} className="roster-member">{member}</span>
                      ))}
                    </div>
                    <button className="view-full-roster-button">
                      View Full Group Roster
                    </button>
                  </div>
                </div>
              )}

              {/* Next Steps Section */}
              <div className="placement-section">
                <h3 className="placement-section-title">Next Steps</h3>
                <div className="checklist-card">
                  <div className="checklist-item">
                    <span className="checklist-number">1</span>
                    <div className="checklist-content">
                      <p className="checklist-title">Join the Group Chat</p>
                      <p className="checklist-description">Connect with your group members and tutor</p>
                    </div>
                  </div>
                  <div className="checklist-item">
                    <span className="checklist-number">2</span>
                    <div className="checklist-content">
                      <p className="checklist-title">Review the Syllabus</p>
                      <p className="checklist-description">Familiarize yourself with course materials and expectations</p>
                    </div>
                  </div>
                  <div className="checklist-item">
                    <span className="checklist-number">3</span>
                    <div className="checklist-content">
                      <p className="checklist-title">Access Group Calendar</p>
                      <p className="checklist-description">View schedules, assignments, and important dates</p>
                    </div>
                  </div>
                  <div className="checklist-item">
                    <span className="checklist-number">4</span>
                    <div className="checklist-content">
                      <p className="checklist-title">Attend Orientation</p>
                      <p className="checklist-description">Join the orientation session to get started</p>
                    </div>
                  </div>
                </div>
                <div className="action-buttons-row">
                  <button className="calendar-button">
                    📅 View Group Calendar
                  </button>
                  <button className="chat-button">
                    💬 Join Group Chat
                  </button>
                </div>
              </div>

              {/* Motivational Section */}
              <div className="placement-section placement-section-motivational">
                <div className="motivational-content">
                  <h3 className="motivational-title">🌟 Welcome to Collaborative Learning!</h3>
                  <p className="motivational-text">
                    You're now part of a dynamic learning community where students support each other, 
                    share knowledge, and grow together. Collaborative learning has been proven to enhance 
                    understanding, improve retention, and make learning more engaging and enjoyable.
                  </p>
                  <p className="motivational-text">
                    Your study group is carefully curated to ensure optimal learning outcomes. 
                    Together, you'll tackle challenges, celebrate achievements, and build lasting connections 
                    that extend beyond the classroom.
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="previous-next-container-css flex flex-row justify-between items-center gap-4 w-full mt-8">
                <button className="previous-btn-css" onClick={handlePrevious}>
                  <div className="previous-icon-container">
                    <img className="previous-icon" src="/registration-icons/prev-next/previous.png" alt="Previous" />
                  </div>
                  <p className="previous-text">PREVIOUS</p>
                </button>
                <button
                  className="next-btn-css next-btn-js"
                  onClick={handleFinish}
                  style={{ width: 'auto', minWidth: '200px', padding: '10px 24px' }}
                >
                  <p className="next-text">GO TO HOME</p>
                  <div className="next-icon-container">
                    <img className="next-icon" src="/registration-icons/prev-next/next.png" alt="Next" />
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

export default PlacementAndGroupAssignment;
