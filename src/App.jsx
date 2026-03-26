import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/products" element={<Products />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/about" element={<About />} />

        {/* Admin panel routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/schedule" element={<AdminSchedule />} />
        <Route path="/statistics" element={<AdminStatistics />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/demo" element={<AdminTeacherDemo />} />
        <Route path="/course-builder" element={<CourseBuilder />} />
        <Route path="/test-builder" element={<TestBuilder />} />

        {/* Teacher panel routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/stats" element={<TeacherStats />} />
        <Route path="/teacher/live-session" element={<TeacherLiveSession />} />
        <Route path="/teacher/schedule" element={<TeacherSchedule />} />
        <Route path="/teacher/messages" element={<TeacherMessages />} />
        <Route path="/teacher/payments" element={<TeacherPayments />} />

        {/* Student panel routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/live-session" element={<StudentLiveSession />} />
        <Route path="/student/schedule" element={<StudentSchedule />} />
        <Route path="/student/groups" element={<StudentGroups />} />
        <Route path="/student/messages" element={<StudentMessages />} />

        {/* Registration Routes */}
        <Route path="/register" element={<RegisterAs />} />

        {/* Student Registration */}
        <Route
          path="/register/student/personal-info"
          element={<PersonalInfo />}
        />
        <Route
          path="/register/student/subjects"
          element={<SubjectSelection />}
        />
        <Route path="/register/student/exam-start" element={<ExamStart />} />
        <Route
          path="/register/student/exam-in-progress"
          element={<ExamInProgress />}
        />
        <Route
          path="/register/student/exam/:subject/:level"
          element={<Exam />}
        />
        <Route path="/register/student/exam-result" element={<ExamResult />} />
        <Route
          path="/register/student/placement-group"
          element={<PlacementAndGroupAssignment />}
        />

        {/* Teacher Registration */}
        <Route
          path="/register/teacher/subjects"
          element={<TeacherSubjects />}
        />
        <Route
          path="/register/teacher/exam/:subject"
          element={<TeacherExam />}
        />
        <Route
          path="/register/teacher/demo-session"
          element={<DemoSession />}
        />

        {/* Employee Registration */}
        <Route path="/register/employee" element={<Employee />} />

        {/* Lesson Environment */}
        <Route path="/lesson-environment" element={<LessonEnvironment />} />

        {/* Unit View */}
        <Route path="/unit-view" element={<UnitView />} />
      </Routes>
    </Router>
  );
}

export default App;
