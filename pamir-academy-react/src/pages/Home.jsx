import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';
import '../styles/general.css';
import '../styles/home.css';
import '../styles/main-page-responsive-css/responsive-general.css';
import '../styles/main-page-responsive-css/responsive-home.css';
import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [studentIndex, setStudentIndex] = useState(0);
  const [teacherIndex, setTeacherIndex] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);

  const imageFormatList = ['1.jpg', '2.jpg', '3.jpeg', '4.png'];
  const inputShortText = [
    "Pamir Academy is an online educational platform that is aimed to make learning easy and fun.",
    "We welcome any background.",
    "We believe in individual learning.",
    "Our hope is future generation with continues learning."
  ];

  // Counter animation
  const [counters, setCounters] = useState({ countries: 0, teachers: 0, students: 0 });
  const countersRef = useRef({ countries: 0, teachers: 0, students: 0 });

  useEffect(() => {
    const targets = { countries: 10, teachers: 10, students: 20 };
    const intervals = {};

    Object.keys(targets).forEach((key) => {
      intervals[key] = setInterval(() => {
        countersRef.current[key] += Math.ceil(targets[key] / 100);
        if (countersRef.current[key] >= targets[key]) {
          countersRef.current[key] = targets[key];
          clearInterval(intervals[key]);
        }
        setCounters({ ...countersRef.current });
      }, 50);
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, []);

  // Auto-slide front images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageFormatList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLeftSlider = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleRightSlider = () => {
    if (currentImageIndex < imageFormatList.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const CARDS_TO_SHOW = 3; // Always show 3 cards at a time for laptop screens

  const students = [
    { name: 'Akim Bek', title: 'English', image: '/profile-img/students/student1.avif', description: '"Pamir Academy is the best place to study English. I learned more in one year here than 10 years at school "' },
    { name: 'Alima Alinazarova', title: 'Physics', image: '/profile-img/students/student2.jpg', description: '"With Pamir Academy, I can now say physics is the best subject. Before, Pamir Academy I couldn\'t understand, but now I can solve any physics problem"' },
    { name: 'Damir Oshurbekov', title: 'Art', image: '/profile-img/students/student3.jpeg', description: '"Oh my God. After I now can play guitar very well. Why I didn\'t study here before. I couldn\'t learn over the past 5 years. But I can sing and play any song I like. Thank you Pamir Academy. "' },
    { name: 'Karima Aliyor', title: 'Math', image: '/profile-img/students/student4.jpeg', description: '"Uz tamard lom, murd az fokchiz ar Pamir Academy xaydow lapdi khushyat. Dazhi az Multik mu zulikindi. Yakbor paprobavat kinet."' },
  ];

  const teachers = [
    { name: 'Nafisa Lolova', title: 'Math and English', image: '/profile-img/teachers/teacher1.jpeg', description: '"Pamir Academy is not just place of teaching. It is place of growth and learning too."' },
    { name: 'Raul Akim', title: 'Programming', image: '/profile-img/teachers/teacher2.webp', description: '"Pamir Academy, is the place where you can try any course or subject. Just try, you will like it."' },
    { name: 'Rezabegim Alishova', title: 'English', image: '/profile-img/teachers/teacher3.jpeg', description: '"I can teach anything in this platform. Oh my God. This is my dream job."' },
    { name: 'Maria Yakob', title: 'Chemistry', image: '/profile-img/teachers/teacher4.jpg', description: '"This is the platform that encourages students and teachers to learn through practice. I don\'t know if such platform exists. But I now this is best for human learning and growth."' },
  ];

  const team = [
    { name: 'Ubaid Sayedi', title: 'CEO, Founder', image: '/profile-img/abc.png', description: '"Ubaid Sayedi is the founder and CEO of the Pamir Academy. He manages the whole operations including technical aspects and marketing. He also works on curriculum development, hiring, and more."' },
    { name: 'Davlat Davlatov', title: 'Manager, Co-founder', image: '/profile-img/man1.jpg', description: '"A Manager is a professional responsible for overseeing and coordinating the activities of a team, department, or organization to achieve specific goals. Managers play a key role in ensuring that resources, including personnel, time, and budgets, are utilized effectively."' },
    { name: 'Khushruz Saidibagimov', title: 'Marketing Manager', image: '/profile-img/man2.jpg', description: '"Marketing Manager is responsible for developing and executing strategies to promote a brand, product, or service effectively"' },
    { name: 'Taghoysho Meralishoev', title: 'Motivator', image: '/profile-img/images.jpeg', description: '"A Motivator is someone who inspires, encourages, and drives others to achieve their goals, overcome challenges, and perform at their best. Motivators can be leaders, managers, teachers, or even peers who positively influence the attitudes and behaviors of individuals or groups. Here are the key roles and responsibilities of a motivator"' },
  ];

  const visibleStudents = students.slice(studentIndex, studentIndex + CARDS_TO_SHOW);
  const visibleTeachers = teachers.slice(teacherIndex, teacherIndex + CARDS_TO_SHOW);
  const visibleTeam = team.slice(teamIndex, teamIndex + CARDS_TO_SHOW);

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

      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          {/* Front page learn more */}
          <div className="front-page-learn-more-container-css">
            <div className="front-page-image-container-css">
              <div 
                className="front-page-image-css front-page-image-js"
                style={{
                  backgroundImage: `url(/front-img/${imageFormatList[currentImageIndex]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%'
                }}
              ></div>
            </div>
            <div className="front-page-learn-more-black">
              <p className="pamir-academy-learn-more-css">Pamir Academy</p>
              <Link className="learn-more-button-css" to="/learn-more">Learn More</Link>
              <div className="learn-more-short-text-css">
                <p className="learn-more-short-text-js">{inputShortText[currentImageIndex]}</p>
              </div>
            </div>
          </div>

          {/* Moving front images */}
          <div className="moving-front-image-container moving-for-large-screen">
            <button className="moving-button-css left-button-slider-js" onClick={handleLeftSlider}>
              <img className="moving-icon" src="/front-img/moving-buttons/moving-left.png" alt="Previous" />
            </button>
            <div className="moving-point-container-css">
              {imageFormatList.map((_, index) => (
                <div 
                  key={index}
                  className={`moving-point-css moving-points-js ${index === currentImageIndex ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            <button className="moving-button-css right-button-slider-js" onClick={handleRightSlider}>
              <img className="moving-icon" src="/front-img/moving-buttons/moving-right.png" alt="Next" />
            </button>
          </div>

          {/* Students Teachers Statistics */}
          <div className="students-teachers-container-css">
            <div className="countries-container-css">
              <p className="countries-number-css counter-js">{counters.countries}+</p>
              <p className="countries-name-css">Countries</p>
            </div>
            <div className="teachers-container-css">
              <p className="teachers-number-css counter-js">{counters.teachers}+</p>
              <p className="teachers-name-css">Teachers</p>
            </div>
            <div className="students-container-css">
              <p className="students-number-css counter-js">{counters.students}+</p>
              <p className="students-name-css">Students</p>
            </div>
          </div>

          {/* Our Students */}
          <div className="title-our-team-css">
            <div className="our-team-white-banner-css">
              <p className="our-team-text-css">Our Students</p>
            </div>
          </div>

          {/* Our Students Profiles */}
          <div className="our-team-main-container-css">
            {visibleStudents.map((student) => (
              <div key={`${student.name}-${student.title}`} className="our-team-block-container-css student-profile-container-js">
                <div className="our-team-profile-img-container-css">
                  <img 
                    className="our-team-profile-img-css" 
                    src={student.image} 
                    alt={student.name}
                    onError={(e) => {
                      e.target.src = '/profile-img/abc.png'; // Fallback image
                    }}
                  />
                </div>
                <div className="our-team-name-title-container-css mt-4">
                  <p className="our-team-name-css mb-2">{student.name}</p>
                  <p className="our-team-title-css mb-4">{student.title}</p>
                </div>
                <p className="our-team-profile-discription-css mt-2">{student.description}</p>
              </div>
            ))}
          </div>

          {/* Moving profile blocks - Students */}
          <div className="moving-front-image-container">
            <button 
              className="moving-button-css student-moving-left-button-js"
              onClick={() => setStudentIndex(Math.max(0, studentIndex - 1))}
              disabled={studentIndex === 0}
            >
              <img className="moving-icon" src="/front-img/moving-buttons/moving-left.png" alt="Previous" />
            </button>
            <div className="moving-point-container-css">
              {Array.from({ length: Math.max(0, students.length - CARDS_TO_SHOW + 1) }).map((_, index) => (
                <div 
                  key={index}
                  className={`moving-point-css student-moving-profile-point-js ${index === studentIndex ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            <button 
              className="moving-button-css student-moving-right-button-js"
              onClick={() => setStudentIndex(Math.min(students.length - CARDS_TO_SHOW, studentIndex + 1))}
              disabled={studentIndex >= students.length - CARDS_TO_SHOW}
            >
              <img className="moving-icon" src="/front-img/moving-buttons/moving-right.png" alt="Next" />
            </button>
          </div>

          {/* Our Teachers */}
          <div className="title-our-team-css">
            <div className="our-team-white-banner-css">
              <p className="our-team-text-css">Our Teachers</p>
            </div>
          </div>

          {/* Our Teachers Profiles */}
          <div className="our-team-main-container-css">
            {visibleTeachers.map((teacher) => (
              <div key={`${teacher.name}-${teacher.title}`} className="our-team-block-container-css teacher-profile-container-js">
                <div className="our-team-profile-img-container-css">
                  <img className="our-team-profile-img-css" src={teacher.image} alt={teacher.name} />
                </div>
                <div className="our-team-name-title-container-css mt-4">
                  <p className="our-team-name-css mb-2">{teacher.name}</p>
                  <p className="our-team-title-css mb-4">{teacher.title}</p>
                </div>
                <p className="our-team-profile-discription-css mt-2">{teacher.description}</p>
              </div>
            ))}
          </div>

          {/* Moving profile blocks - Teachers */}
          <div className="moving-front-image-container">
            <button 
              className="moving-button-css teacher-moving-left-button-js"
              onClick={() => setTeacherIndex(Math.max(0, teacherIndex - 1))}
              disabled={teacherIndex === 0}
            >
              <img className="moving-icon" src="/front-img/moving-buttons/moving-left.png" alt="Previous" />
            </button>
            <div className="moving-point-container-css">
              {Array.from({ length: Math.max(0, teachers.length - CARDS_TO_SHOW + 1) }).map((_, index) => (
                <div 
                  key={index}
                  className={`moving-point-css teacher-moving-profile-point-js ${index === teacherIndex ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            <button 
              className="moving-button-css teacher-moving-right-button-js"
              onClick={() => setTeacherIndex(Math.min(teachers.length - CARDS_TO_SHOW, teacherIndex + 1))}
              disabled={teacherIndex >= teachers.length - CARDS_TO_SHOW}
            >
              <img className="moving-icon" src="/front-img/moving-buttons/moving-right.png" alt="Next" />
            </button>
          </div>

          {/* Our Team */}
          <div className="title-our-team-css">
            <div className="our-team-white-banner-css">
              <p className="our-team-text-css">Our Team</p>
            </div>
          </div>

          {/* Our Team Profiles */}
          <div className="our-team-main-container-css">
            {visibleTeam.map((member) => (
              <div key={`${member.name}-${member.title}`} className="our-team-block-container-css our-team-profile-container-js">
                <div className="our-team-profile-img-container-css">
                  <img className="our-team-profile-img-css" src={member.image} alt={member.name} />
                </div>
                <div className="our-team-name-title-container-css mt-4">
                  <p className="our-team-name-css mb-2">{member.name}</p>
                  <p className="our-team-title-css mb-4">{member.title}</p>
                </div>
                <p className="our-team-profile-discription-css mt-2">{member.description}</p>
              </div>
            ))}
          </div>

          {/* Moving profile blocks - Team */}
          <div className="moving-front-image-container">
            <button 
              className="moving-button-css our-team-moving-left-button-js"
              onClick={() => setTeamIndex(Math.max(0, teamIndex - 1))}
              disabled={teamIndex === 0}
            >
              <img className="moving-icon" src="/front-img/moving-buttons/moving-left.png" alt="Previous" />
            </button>
            <div className="moving-point-container-css">
              {Array.from({ length: Math.max(0, team.length - CARDS_TO_SHOW + 1) }).map((_, index) => (
                <div 
                  key={index}
                  className={`moving-point-css our-team-moving-profile-point-js ${index === teamIndex ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            <button 
              className="moving-button-css our-team-moving-right-button-js"
              onClick={() => setTeamIndex(Math.min(team.length - CARDS_TO_SHOW, teamIndex + 1))}
              disabled={teamIndex >= team.length - CARDS_TO_SHOW}
            >
              <img className="moving-icon" src="/front-img/moving-buttons/moving-right.png" alt="Next" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;

