import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LearnMore from "./pages/LearnMore";
import Products from "./pages/Products";
import Subjects from "./pages/Subjects";
import About from "./pages/About";
import RegisterAs from "./pages/registration/RegisterAs";
import PersonalInfo from "./pages/registration/student/PersonalInfo";
import SubjectSelection from "./pages/registration/student/SubjectSelection";
import ExamStart from "./pages/registration/student/ExamStart";
import ExamInProgress from "./pages/registration/student/ExamInProgress";
import Exam from "./pages/registration/student/Exam";
import ExamResult from "./pages/registration/student/ExamResult";
import PlacementAndGroupAssignment from "./pages/registration/student/PlacementAndGroupAssignment";
import TeacherSubjects from "./pages/registration/teacher/TeacherSubjects";
import TeacherExam from "./pages/registration/teacher/TeacherExam";
import DemoSession from "./pages/registration/teacher/DemoSession";
import Employee from "./pages/registration/Employee";
import VerifyEmail from "./pages/registration/VerifyEmail";
import LessonEnvironment from "./pages/lesson/LessonEnvironment";
import UnitView from "./pages/course/UnitView";
import AdminDashboard from "./pages/panel/admin/Dashboard";
import AdminMessages from "./pages/panel/admin/Messages";
import AdminSchedule from "./pages/panel/admin/Schedule";
import AdminStatistics from "./pages/panel/admin/Statistics";
import AdminTeacherDemo from "./pages/panel/admin/Meeting";
import CourseBuilder from "./pages/panel/admin/course-builder/CourseBuilder";
import TestBuilder from "./pages/panel/admin/TestBuilder";
import TeacherLiveSession from "./pages/panel/teacher/TeacherLiveSession";
import TeacherMessages from "./pages/panel/teacher/TeacherMessages";
import TeacherPayments from "./pages/panel/teacher/TeacherPayments";
import TeacherSchedule from "./pages/panel/teacher/TeacherSchedule";
import TeacherStats from "./pages/panel/teacher/TeacherStats";
import TeacherDashboard from "./pages/panel/teacher/TeacherDashboard";
import StudentDashboard from "./pages/panel/student/StudentDashboard";
import StudentLiveSession from "./pages/panel/student/StudentLiveSession";
import StudentMessages from "./pages/panel/student/StudentMessages";
import StudentSchedule from "./pages/panel/student/StudentSchedule";
import StudentGroups from "./pages/panel/student/StudentGroups";
import StudentCourses from "./pages/panel/student/StudentCourses";
import "./App.css";

function Admin({ children }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}

function Teacher({ children }) {
  return <ProtectedRoute allowedRoles={["teacher"]}>{children}</ProtectedRoute>;
}

function Student({ children }) {
  return <ProtectedRoute allowedRoles={["student"]}>{children}</ProtectedRoute>;
}

function LoggedIn({ children }) {
  return <ProtectedRoute allowedRoles={["admin", "student", "teacher"]}>{children}</ProtectedRoute>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ---- Public routes ---- */}
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/products" element={<Products />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/about" element={<About />} />

        {/* ---- Registration (public — email-verified users) ---- */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/register" element={<RegisterAs />} />
        <Route path="/register/student/personal-info" element={<PersonalInfo />} />
        <Route path="/register/student/subjects" element={<SubjectSelection />} />
        <Route path="/register/student/exam-start" element={<ExamStart />} />
        <Route path="/register/student/exam-in-progress" element={<ExamInProgress />} />
        <Route path="/register/student/exam/:subject/:level" element={<Exam />} />
        <Route path="/register/student/exam-result" element={<ExamResult />} />
        <Route path="/register/student/placement-group" element={<PlacementAndGroupAssignment />} />
        <Route path="/register/teacher/subjects" element={<TeacherSubjects />} />
        <Route path="/register/teacher/exam/:subject" element={<TeacherExam />} />
        <Route path="/register/teacher/demo-session" element={<DemoSession />} />
        <Route path="/register/employee" element={<Employee />} />

        {/* ---- Admin panel (admin only) ---- */}
        <Route path="/admin" element={<Admin><AdminDashboard /></Admin>} />
        <Route path="/admin-dashboard" element={<Admin><AdminDashboard /></Admin>} />
        <Route path="/dashboard" element={<Admin><AdminDashboard /></Admin>} />
        <Route path="/schedule" element={<Admin><AdminSchedule /></Admin>} />
        <Route path="/statistics" element={<Admin><AdminStatistics /></Admin>} />
        <Route path="/messages" element={<Admin><AdminMessages /></Admin>} />
        <Route path="/demo" element={<Admin><AdminTeacherDemo /></Admin>} />
        <Route path="/demo/:teacherId" element={<Admin><AdminTeacherDemo /></Admin>} />
        <Route path="/course-builder" element={<Admin><CourseBuilder /></Admin>} />
        <Route path="/test-builder" element={<Admin><TestBuilder /></Admin>} />

        {/* ---- Teacher panel (teacher only) ---- */}
        <Route path="/teacher" element={<Teacher><TeacherDashboard /></Teacher>} />
        <Route path="/teacher/stats" element={<Teacher><TeacherStats /></Teacher>} />
        <Route path="/teacher/live-session" element={<Teacher><TeacherLiveSession /></Teacher>} />
        <Route path="/teacher/schedule" element={<Teacher><TeacherSchedule /></Teacher>} />
        <Route path="/teacher/messages" element={<Teacher><TeacherMessages /></Teacher>} />
        <Route path="/teacher/payments" element={<Teacher><TeacherPayments /></Teacher>} />

        {/* ---- Student panel (student only) ---- */}
        <Route path="/student" element={<Student><StudentDashboard /></Student>} />
        <Route path="/student/courses" element={<Student><StudentCourses /></Student>} />
        <Route path="/student/live-session" element={<Student><StudentLiveSession /></Student>} />
        <Route path="/student/schedule" element={<Student><StudentSchedule /></Student>} />
        <Route path="/student/groups" element={<Student><StudentGroups /></Student>} />
        <Route path="/student/messages" element={<Student><StudentMessages /></Student>} />

        {/* ---- Authenticated routes (any logged-in user) ---- */}
        <Route path="/lesson-environment" element={<LoggedIn><LessonEnvironment /></LoggedIn>} />
        <Route path="/unit-view" element={<LoggedIn><UnitView /></LoggedIn>} />
      </Routes>
    </Router>
  );
}

export default App;
