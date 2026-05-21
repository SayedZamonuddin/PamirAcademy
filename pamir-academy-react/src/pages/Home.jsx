import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';

const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

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
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const handleRightSlider = () => {
    if (currentImageIndex < imageFormatList.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  const CARDS_TO_SHOW = 3;

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

  // Reusable slider nav
  const SliderNav = ({ index, setIndex, total, cardsToShow }) => (
    <div className="flex items-center justify-center gap-6 mt-6">
      <button
        className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={() => setIndex(Math.max(0, index - 1))}
        disabled={index === 0}
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.max(0, total - cardsToShow + 1) }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i === index ? 'bg-brand w-6' : 'bg-gray-300 w-2'}`}
          />
        ))}
      </div>
      <button
        className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={() => setIndex(Math.min(total - cardsToShow, index + 1))}
        disabled={index >= total - cardsToShow}
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );

  // Reusable profile card
  const ProfileCard = ({ person }) => (
    <div className="w-full max-w-[300px] bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative pt-[70px] pb-6 px-4 flex flex-col items-center">
      <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 w-[120px] h-[120px]">
        <img
          className="w-full h-full border-brand border-[3px] rounded-full object-cover bg-white block"
          src={person.image}
          alt={person.name}
          onError={(e) => { e.target.src = '/profile-img/abc.png'; }}
        />
      </div>
      <div className="flex flex-col items-center w-full mt-2">
        <p className="text-brand font-semibold text-lg m-0 mb-2">{person.name}</p>
        <p className="text-gray-500 text-sm font-medium m-0 mb-4">{person.title}</p>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed text-center m-0 line-clamp-6">{person.description}</p>
    </div>
  );

  // Section title component
  const SectionTitle = ({ title }) => (
    <div className="mt-16 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-brand text-center">{title}</h2>
      <div className="w-16 h-1 bg-brand rounded-full mx-auto mt-3"></div>
    </div>
  );

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

      <div className="max-w-[1100px] mx-auto px-5">
        {/* Hero Section */}
        <div className="w-full aspect-[21/9] sm:aspect-[21/8] relative overflow-hidden rounded-2xl mt-8">
          <div
            className="w-full h-full bg-cover bg-center transition-opacity duration-700"
            style={{ backgroundImage: `url(/front-img/${imageFormatList[currentImageIndex]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Pamir Academy</h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mb-6">{inputShortText[currentImageIndex]}</p>
            <Link
              to="/learn-more"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg w-fit no-underline"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hero Slider Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={handleLeftSlider}
            disabled={currentImageIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            {imageFormatList.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-brand w-6' : 'bg-gray-300 w-2'}`}
              />
            ))}
          </div>
          <button
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={handleRightSlider}
            disabled={currentImageIndex === imageFormatList.length - 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Statistics Bar */}
        <div className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl mt-16 py-10 px-4 flex justify-evenly items-center">
          <div className="flex flex-col items-center">
            <p className="text-white text-4xl sm:text-5xl font-bold m-0">{counters.countries}+</p>
            <p className="text-white/70 text-sm font-medium tracking-wide uppercase mt-2 m-0">Countries</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-white text-4xl sm:text-5xl font-bold m-0">{counters.teachers}+</p>
            <p className="text-white/70 text-sm font-medium tracking-wide uppercase mt-2 m-0">Teachers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-white text-4xl sm:text-5xl font-bold m-0">{counters.students}+</p>
            <p className="text-white/70 text-sm font-medium tracking-wide uppercase mt-2 m-0">Students</p>
          </div>
        </div>

        {/* Our Students */}
        <SectionTitle title="Our Students" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pt-16">
          {visibleStudents.map((student) => (
            <ProfileCard key={`${student.name}-${student.title}`} person={student} />
          ))}
        </div>
        <SliderNav index={studentIndex} setIndex={setStudentIndex} total={students.length} cardsToShow={CARDS_TO_SHOW} />

        {/* Our Teachers */}
        <SectionTitle title="Our Teachers" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pt-16">
          {visibleTeachers.map((teacher) => (
            <ProfileCard key={`${teacher.name}-${teacher.title}`} person={teacher} />
          ))}
        </div>
        <SliderNav index={teacherIndex} setIndex={setTeacherIndex} total={teachers.length} cardsToShow={CARDS_TO_SHOW} />

        {/* Our Team */}
        <SectionTitle title="Our Team" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pt-16">
          {visibleTeam.map((member) => (
            <ProfileCard key={`${member.name}-${member.title}`} person={member} />
          ))}
        </div>
        <SliderNav index={teamIndex} setIndex={setTeamIndex} total={team.length} cardsToShow={CARDS_TO_SHOW} />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
