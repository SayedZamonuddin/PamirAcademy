import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/course/unit-view.css";

const UnitView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { course, unit } = location.state || {};
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [showExercise, setShowExercise] = useState(null);
  const [showQuiz, setShowQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (!course || !unit) {
      navigate("/");
      return;
    }

    // Load lesson progress
    const savedProgress = JSON.parse(
      localStorage.getItem("lessonProgress") || "{}"
    );
    setLessonProgress(savedProgress);

    // Set first lesson as default
    if (unit.lessons && unit.lessons.length > 0) {
      setSelectedLesson(unit.lessons[0]);
    }
  }, [course, unit, navigate]);

  const markLessonComplete = (lessonId) => {
    const lessonKey = `${course.id}-${unit.id}-${lessonId}`;
    const newProgress = {
      ...lessonProgress,
      [lessonKey]: {
        completed: true,
        completedAt: new Date().toISOString(),
      },
    };
    setLessonProgress(newProgress);
    localStorage.setItem("lessonProgress", JSON.stringify(newProgress));
  };

  const getLessonStatus = (lessonId) => {
    const lessonKey = `${course.id}-${unit.id}-${lessonId}`;
    return lessonProgress[lessonKey]?.completed || false;
  };

  const handleExercise = (exercise) => {
    setShowExercise(exercise);
  };

  const handleQuiz = (quiz) => {
    setShowQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    let score = 0;
    if (showQuiz && showQuiz.content) {
      showQuiz.content.forEach((q, index) => {
        if (quizAnswers[index] === q.correct) {
          score++;
        }
      });
    }
    const percentage = showQuiz
      ? Math.round((score / showQuiz.content.length) * 100)
      : 0;
    alert(
      `Quiz Submitted!\n\nScore: ${score}/${
        showQuiz?.content.length || 0
      }\nPercentage: ${percentage}%`
    );
  };

  const closeExercise = () => {
    setShowExercise(null);
  };

  const closeQuiz = () => {
    setShowQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleUnitTest = (unitTest) => {
    if (
      window.confirm(
        `Start "${unitTest.title}"?\nQuestions: ${unitTest.questions}\nDuration: ${unitTest.duration}`
      )
    ) {
      alert(`Unit Test "${unitTest.title}" started!`);
    }
  };

  if (!course || !unit) {
    return null;
  }

  return (
    <div className="unit-view-container flex w-screen h-screen m-0 p-0 bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="unit-sidebar w-80 min-w-80 h-screen bg-white border-r border-slate-200 flex flex-col overflow-y-auto shadow-lg">
        <div className="sidebar-header p-6 border-b border-slate-200 bg-gradient-to-br from-[#006236] to-[#004d2a] text-white">
          <button
            className="back-to-courses-btn w-full mb-4 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-xs font-semibold hover:bg-white/30 transition-all duration-200"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
          <h2 className="sidebar-course-title text-base font-semibold mb-2 text-white/90">
            {course.title}
          </h2>
          <h3 className="sidebar-unit-title text-xl font-bold text-white">
            {unit.title}
          </h3>
        </div>

        <nav className="unit-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">Lessons</h4>
            <ul className="nav-lessons">
              {unit.lessons.map((lesson) => {
                const isCompleted = getLessonStatus(lesson.id);
                const isActive = selectedLesson?.id === lesson.id;
                return (
                  <li key={lesson.id} className="nav-lesson-item">
                    <button
                      className={`nav-lesson-link ${isActive ? "active" : ""} ${
                        isCompleted ? "completed" : ""
                      }`}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <span className="lesson-number">
                        {unit.lessons.indexOf(lesson) + 1}
                      </span>
                      <span className="lesson-name">{lesson.title}</span>
                      {isCompleted && <span className="check-icon">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {unit.unitTest && (
            <div className="nav-section">
              <h4 className="nav-section-title">Unit Test</h4>
              <button
                className="nav-unit-test-btn"
                onClick={() => handleUnitTest(unit.unitTest)}
              >
                <span className="test-icon">📊</span>
                <span>{unit.unitTest.title}</span>
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="unit-content flex-1 overflow-y-auto p-10 bg-slate-50">
        {selectedLesson ? (
          <div className="lesson-view max-w-4xl mx-auto">
            <div className="lesson-header flex justify-between items-center mb-8 pb-6 border-b-2 border-slate-200">
              <h1 className="lesson-title text-3xl font-bold text-slate-800">
                {selectedLesson.title}
              </h1>
              <span
                className={`status-badge text-xs font-semibold px-4 py-2 rounded-xl uppercase tracking-wide ${
                  getLessonStatus(selectedLesson.id)
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {getLessonStatus(selectedLesson.id)
                  ? "Complete"
                  : "Not Started"}
              </span>
            </div>

            <div className="lesson-body flex flex-col gap-8">
              {/* Lesson Material */}
              <section className="lesson-section bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
                <h2 className="section-title text-xl font-bold text-[#006236] mb-5">
                  📄 Lesson Material
                </h2>
                <button
                  className="material-btn w-full flex items-center gap-3 px-6 py-4 bg-[rgba(0,98,54,0.1)] border-2 border-[#006236] rounded-xl text-[#006236] text-base font-semibold hover:bg-[#006236] hover:text-white transition-all duration-200"
                  onClick={() => alert(`Opening: ${selectedLesson.material}`)}
                >
                  <span className="btn-icon text-xl">📄</span>
                  <span>View Lesson Material</span>
                </button>
              </section>

              {/* YouTube Video */}
              {selectedLesson.video && (
                <section className="lesson-section bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
                  <h2 className="section-title text-xl font-bold text-[#006236] mb-5">
                    ▶️ Video Lesson
                  </h2>
                  <div className="video-container mt-4">
                    <a
                      href={selectedLesson.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link block no-underline text-inherit"
                    >
                      <div className="video-thumbnail w-full aspect-video bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center relative overflow-hidden mb-3 group hover:scale-[1.02] transition-transform duration-200">
                        <span className="play-icon text-6xl text-white opacity-90">
                          ▶
                        </span>
                      </div>
                      <p className="video-description text-sm text-slate-600 text-center m-0">
                        Click to watch the lesson video on YouTube
                      </p>
                    </a>
                  </div>
                </section>
              )}

              {/* Exercises */}
              {selectedLesson.exercises &&
                selectedLesson.exercises.length > 0 && (
                  <section className="lesson-section bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
                    <h2 className="section-title text-xl font-bold text-[#006236] mb-5">
                      ✏️ Practice Exercises
                    </h2>
                    <div className="exercises-list flex flex-col gap-3 mt-4">
                      {selectedLesson.exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          className="exercise-card flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 hover:border-[#006236] hover:translate-x-1 transition-all duration-200 text-left w-full group"
                          onClick={() => handleExercise(exercise)}
                        >
                          <span className="exercise-icon text-2xl flex-shrink-0">
                            ✏️
                          </span>
                          <div className="exercise-info flex-1">
                            <h3 className="exercise-title text-base font-semibold text-slate-800 mb-1">
                              {exercise.title}
                            </h3>
                            <p className="exercise-type text-sm text-slate-600 m-0">
                              {exercise.description ||
                                (exercise.type === "practice"
                                  ? "Practice Exercise"
                                  : exercise.type)}
                            </p>
                          </div>
                          <span className="exercise-arrow text-xl text-slate-600 flex-shrink-0 group-hover:text-[#006236] group-hover:translate-x-1 transition-all duration-200">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

              {/* Lesson Quiz */}
              {selectedLesson.quiz && (
                <section className="lesson-section bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
                  <h2 className="section-title text-xl font-bold text-[#006236] mb-5">
                    📝 Lesson Quiz
                  </h2>
                  <div className="quiz-card flex justify-between items-center gap-6 mt-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl">
                    <div className="quiz-info flex-1">
                      <h3 className="quiz-title text-lg font-bold text-slate-800 mb-2">
                        {selectedLesson.quiz.title}
                      </h3>
                      <div className="quiz-details flex gap-4 mb-2">
                        <span className="quiz-detail text-xs text-slate-600 bg-amber-100 px-2.5 py-1 rounded-lg font-medium">
                          {selectedLesson.quiz.questions} Questions
                        </span>
                        <span className="quiz-detail text-xs text-slate-600 bg-amber-100 px-2.5 py-1 rounded-lg font-medium">
                          {selectedLesson.quiz.duration}
                        </span>
                      </div>
                      <p className="quiz-description text-sm text-slate-600 m-0">
                        Test your understanding of this lesson with a quick
                        quiz.
                      </p>
                    </div>
                    <button
                      className="quiz-start-btn px-7 py-3.5 bg-amber-500 text-white rounded-xl text-base font-bold hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-200 shadow-md whitespace-nowrap"
                      onClick={() => handleQuiz(selectedLesson.quiz)}
                    >
                      Start Quiz
                    </button>
                  </div>
                </section>
              )}

              {/* Mark Complete */}
              {!getLessonStatus(selectedLesson.id) && (
                <div className="lesson-actions mt-8 pt-8 border-t-2 border-slate-200">
                  <button
                    className="mark-complete-btn px-7 py-3.5 bg-[#006236] text-white rounded-xl text-base font-bold hover:bg-[#004d2a] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                    onClick={() => markLessonComplete(selectedLesson.id)}
                  >
                    ✓ Mark Lesson as Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-lesson-selected text-center py-32 px-5">
            <div className="empty-icon text-8xl mb-6 opacity-50">📚</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Select a lesson to begin
            </h2>
            <p className="text-base text-slate-600 m-0">
              Choose a lesson from the sidebar to view its content.
            </p>
          </div>
        )}
      </main>

      {/* Exercise Modal */}
      {showExercise && (
        <div
          className="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5 overflow-y-auto"
          onClick={closeExercise}
        >
          <div
            className="modal-content bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-[#006236] to-[#004d2a] text-white rounded-t-2xl">
              <h2 className="modal-title text-2xl font-bold text-white m-0">
                {showExercise.title}
              </h2>
              <button
                className="modal-close w-10 h-10 bg-white/20 border-none text-white text-3xl rounded-full cursor-pointer flex items-center justify-center hover:bg-white/30 transition-all duration-200 leading-none p-0"
                onClick={closeExercise}
              >
                ×
              </button>
            </div>
            <div className="modal-body p-8">
              {showExercise.description && (
                <p className="exercise-description text-base text-slate-600 mb-6 leading-relaxed">
                  {showExercise.description}
                </p>
              )}
              {showExercise.content && (
                <div className="exercise-content">
                  <h3 className="text-lg font-bold text-[#006236] mb-3 mt-6 first:mt-0">
                    Instructions:
                  </h3>
                  <pre className="instructions-text bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap break-words overflow-x-auto mb-5 font-mono">
                    {showExercise.content.instructions}
                  </pre>
                  {showExercise.content.example && (
                    <>
                      <h3 className="text-lg font-bold text-[#006236] mb-3 mt-6">
                        Example:
                      </h3>
                      <pre className="code-example bg-slate-900 text-slate-100 border border-slate-700 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap break-words overflow-x-auto mb-5 font-mono">
                        {showExercise.content.example}
                      </pre>
                    </>
                  )}
                </div>
              )}
              <div className="modal-actions flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  className="btn-primary px-6 py-3 bg-[#006236] text-white rounded-lg text-base font-semibold hover:bg-[#004d2a] hover:-translate-y-0.5 transition-all duration-200"
                  onClick={closeExercise}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div
          className="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5 overflow-y-auto"
          onClick={closeQuiz}
        >
          <div
            className="modal-content quiz-modal bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-[#006236] to-[#004d2a] text-white rounded-t-2xl">
              <h2 className="modal-title text-2xl font-bold text-white m-0">
                {showQuiz.title}
              </h2>
              <button
                className="modal-close w-10 h-10 bg-white/20 border-none text-white text-3xl rounded-full cursor-pointer flex items-center justify-center hover:bg-white/30 transition-all duration-200 leading-none p-0"
                onClick={closeQuiz}
              >
                ×
              </button>
            </div>
            <div className="modal-body p-8">
              {showQuiz.content && showQuiz.content.length > 0 ? (
                <div className="quiz-questions flex flex-col gap-6">
                  {showQuiz.content.map((question, qIndex) => {
                    const isCorrect = quizAnswers[qIndex] === question.correct;
                    const showResult = quizSubmitted;

                    return (
                      <div
                        key={qIndex}
                        className="question-card p-6 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <h3 className="question-text text-lg font-semibold text-slate-800 mb-4 m-0">
                          {qIndex + 1}. {question.question}
                        </h3>
                        <div className="question-options flex flex-col gap-2.5">
                          {question.options.map((option, oIndex) => {
                            const isSelected = quizAnswers[qIndex] === oIndex;
                            const isCorrectAnswer = oIndex === question.correct;
                            let optionClass =
                              "option-btn flex items-center gap-3 p-3.5 bg-white border-2 border-slate-200 rounded-lg cursor-pointer transition-all duration-200 text-left w-full text-base";

                            if (showResult) {
                              if (isCorrectAnswer) {
                                optionClass +=
                                  " border-green-500 bg-green-50 text-green-700";
                              } else if (isSelected && !isCorrectAnswer) {
                                optionClass +=
                                  " border-red-500 bg-red-50 text-red-700";
                              }
                            } else if (isSelected) {
                              optionClass +=
                                " border-[#006236] bg-[rgba(0,98,54,0.1)] text-[#006236] font-semibold";
                            } else {
                              optionClass +=
                                " hover:border-[#006236] hover:bg-slate-50";
                            }

                            return (
                              <button
                                key={oIndex}
                                className={optionClass}
                                onClick={() => handleQuizAnswer(qIndex, oIndex)}
                                disabled={quizSubmitted}
                              >
                                <span
                                  className={`option-letter w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                    showResult && isCorrectAnswer
                                      ? "bg-green-500 text-white"
                                      : showResult &&
                                        isSelected &&
                                        !isCorrectAnswer
                                      ? "bg-red-500 text-white"
                                      : isSelected
                                      ? "bg-[#006236] text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                <span className="option-text flex-1">
                                  {option}
                                </span>
                                {showResult && isCorrectAnswer && (
                                  <span className="check-mark text-xl font-bold text-green-600 flex-shrink-0">
                                    ✓
                                  </span>
                                )}
                                {showResult &&
                                  isSelected &&
                                  !isCorrectAnswer && (
                                    <span className="cross-mark text-xl font-bold text-red-600 flex-shrink-0">
                                      ✗
                                    </span>
                                  )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-600">Quiz questions loading...</p>
              )}
              <div className="modal-actions flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                {!quizSubmitted ? (
                  <button
                    className="btn-primary px-6 py-3 bg-[#006236] text-white rounded-lg text-base font-semibold hover:bg-[#004d2a] hover:-translate-y-0.5 transition-all duration-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    onClick={submitQuiz}
                    disabled={
                      Object.keys(quizAnswers).length !==
                      (showQuiz?.content?.length || 0)
                    }
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    className="btn-primary px-6 py-3 bg-[#006236] text-white rounded-lg text-base font-semibold hover:bg-[#004d2a] hover:-translate-y-0.5 transition-all duration-200"
                    onClick={closeQuiz}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UnitView;
