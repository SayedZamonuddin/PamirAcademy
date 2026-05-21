import { useState, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import { getStudentCourses, getStudentCourseDetail } from "../../../utils/panelApi";

const LEVEL_COLORS = {
  beginner:     { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  intermediate: { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-300" },
  advanced:     { bg: "bg-rose-100",     text: "text-rose-700",    border: "border-rose-300" },
};

const BLOCK_META = {
  video:    { icon: "▶",  label: "Video",    accent: "text-red-500" },
  article:  { icon: "📄", label: "Article",  accent: "text-green-600" },
  math:     { icon: "ƒx", label: "Math",     accent: "text-blue-500" },
  quiz:     { icon: "?",  label: "Quiz",     accent: "text-amber-500" },
  exercise: { icon: "✎",  label: "Exercise", accent: "text-violet-500" },
};

/* ---- SVG Icons ---- */
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const UnitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const LessonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-[#006236]/20 border-t-[#006236] rounded-full animate-spin" />
    </div>
  );
}

/* ---- Video embed helper ---- */
function getYouTubeEmbed(url) {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

/* ---- Content Block Renderer ---- */
function BlockViewer({ block }) {
  const meta = BLOCK_META[block.type] || { icon: "•", label: block.type, accent: "text-gray-500" };
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [exerciseChecks, setExerciseChecks] = useState({});

  const normalize = (v) => String(v || "").trim().toLowerCase().replace(/\s+/g, " ");
  const evaluateAnswer = (problem, studentAnswer) => {
    const rawExpected = String(problem?.answer || "").trim();
    if (!rawExpected) return { checked: false, correct: false, message: "No answer key set by admin yet." };

    const actual = String(studentAnswer || "").trim();
    if (!actual) return { checked: false, correct: false, message: "Please enter an answer first." };

    const candidates = rawExpected.split("|").map((x) => x.trim()).filter(Boolean);
    const isNumeric = problem?.type === "numeric";

    const match = candidates.some((candidate) => {
      if (isNumeric) {
        const cNum = Number(candidate);
        const aNum = Number(actual);
        if (!Number.isNaN(cNum) && !Number.isNaN(aNum)) {
          return Math.abs(cNum - aNum) < 1e-9;
        }
      }
      return normalize(candidate) === normalize(actual);
    });

    return {
      checked: true,
      correct: match,
      message: match ? "Correct answer." : "Not quite. Try again.",
    };
  };

  if (block.type === "video") {
    const embed = getYouTubeEmbed(block.url);
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {embed ? (
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe src={embed} title={block.title || "Video"} allowFullScreen
              className="absolute inset-0 w-full h-full border-none" />
          </div>
        ) : (
          <div className="bg-gray-100 p-6 text-center text-gray-400 text-sm">No video URL provided</div>
        )}
        {block.title && <div className="px-4 py-3 font-semibold text-sm text-gray-700">{block.title}</div>}
        {block.notes && <div className="px-4 pb-3 text-xs text-gray-500">{block.notes}</div>}
      </div>
    );
  }

  if (block.type === "article") {
    const articleText = block.content || block.body || "";
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {block.title && <h4 className="text-[#006236] font-bold text-sm m-0 mb-2">{block.title}</h4>}
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {articleText || "No article content provided."}
        </div>
      </div>
    );
  }

  if (block.type === "math") {
    return (
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
        {block.title && <h4 className="text-blue-700 font-bold text-sm m-0 mb-2">{block.title}</h4>}
        <div className="font-mono text-blue-900 text-base bg-white rounded-lg px-4 py-3 border border-blue-100">{block.expression}</div>
        {block.explanation && <p className="text-blue-700 text-xs mt-2 m-0">{block.explanation}</p>}
      </div>
    );
  }

  if (block.type === "quiz") {
    return (
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
        <h4 className="text-amber-700 font-bold text-sm m-0 mb-3">Quiz: {block.question}</h4>
        <div className="flex flex-col gap-2">
          {(block.options || []).map((opt, i) => (
            <div key={i} className="bg-white rounded-lg px-4 py-2.5 text-sm text-gray-700 border border-amber-100">
              <span className="font-semibold text-amber-600 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "exercise") {
    const problems = Array.isArray(block.problems) ? block.problems : [];
    return (
      <div className="bg-violet-50 rounded-xl border border-violet-200 p-5">
        <h4 className="text-violet-700 font-bold text-sm m-0 mb-2">{block.title || "Exercise"}</h4>

        {block.instructions && (
          <p className="text-gray-700 text-sm m-0 mb-3 whitespace-pre-wrap">{block.instructions}</p>
        )}

        {problems.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {problems.map((p, i) => (
              <div key={p.id || i} className="bg-white rounded-lg border border-violet-100 px-4 py-3">
                <p className="text-gray-800 text-sm font-medium m-0">
                  {i + 1}. {p.prompt || "Untitled problem"}
                </p>
                {p.hint && <p className="text-violet-500 text-xs mt-1.5 mb-0 italic">Hint: {p.hint}</p>}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={exerciseAnswers[i] || ""}
                    onChange={(e) => {
                      setExerciseAnswers((prev) => ({ ...prev, [i]: e.target.value }));
                      setExerciseChecks((prev) => ({ ...prev, [i]: null }));
                    }}
                    placeholder="Type your answer..."
                    className="flex-1 px-3 py-2 rounded-lg border border-violet-200 text-sm outline-none focus:border-violet-400"
                  />
                  <button
                    onClick={() =>
                      setExerciseChecks((prev) => ({
                        ...prev,
                        [i]: evaluateAnswer(p, exerciseAnswers[i]),
                      }))
                    }
                    className="px-3 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold border-none cursor-pointer hover:bg-violet-700 transition-colors"
                  >
                    Check
                  </button>
                </div>
                {exerciseChecks[i] && (
                  <p
                    className={`mt-2 mb-0 text-xs font-medium ${
                      exerciseChecks[i].checked
                        ? exerciseChecks[i].correct
                          ? "text-emerald-600"
                          : "text-rose-600"
                        : "text-amber-600"
                    }`}
                  >
                    {exerciseChecks[i].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            {block.prompt && <p className="text-gray-700 text-sm m-0 whitespace-pre-wrap">{block.prompt}</p>}
            {block.hint && <p className="text-violet-500 text-xs mt-2 m-0 italic">Hint: {block.hint}</p>}
            {!block.prompt && !block.hint && (
              <p className="text-gray-500 text-sm m-0">No exercise content provided.</p>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm text-gray-500">
      <span className={meta.accent}>{meta.icon}</span> {meta.label} block
    </div>
  );
}

/* ==================== Course Detail View ==================== */
function CourseDetail({ course, onBack }) {
  const [expandedUnits, setExpandedUnits] = useState(() =>
    new Set((course.structure || []).map((_, i) => i))
  );
  const [expandedLessons, setExpandedLessons] = useState(new Set());

  const toggleUnit = (i) => setExpandedUnits(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const toggleLesson = (key) => setExpandedLessons(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  const units = course.structure || [];
  const lc = LEVEL_COLORS[course.level] || LEVEL_COLORS.beginner;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shrink-0">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-[#006236] bg-transparent border-none cursor-pointer text-sm font-semibold hover:underline">
          <BackIcon /> All Courses
        </button>
        <span className="text-gray-300">|</span>
        <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${lc.bg} ${lc.text}`}>{course.level}</span>
        <span className="text-gray-500 text-sm">{course.subject}</span>
      </div>

      {/* Course header */}
      <div className="px-6 pt-5 pb-4 bg-gradient-to-b from-[#006236]/5 to-transparent">
        <h1 className="text-xl font-bold text-gray-800 m-0">{course.title || `${course.subject} — ${course.level}`}</h1>
        {course.description && <p className="text-gray-500 text-sm mt-1.5 m-0 max-w-[640px]">{course.description}</p>}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><UnitIcon /> {units.length} unit{units.length !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1">
            <LessonIcon /> {units.reduce((s, u) => s + (u.lessons?.length || 0), 0)} lessons
          </span>
        </div>
      </div>

      {/* Unit list */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {units.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-sm">This course has no content yet.</div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {units.map((unit, ui) => {
              const uExpanded = expandedUnits.has(ui);
              return (
                <div key={ui} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <button onClick={() => toggleUnit(ui)}
                    className="w-full flex items-center gap-3 px-5 py-4 bg-transparent border-none cursor-pointer text-left hover:bg-gray-50 transition-colors">
                    <span className={`transition-transform ${uExpanded ? "rotate-0" : "-rotate-90"}`}><ChevronDown /></span>
                    <span className="w-7 h-7 rounded-lg bg-[#006236]/10 text-[#006236] flex items-center justify-center text-xs font-bold shrink-0">{ui + 1}</span>
                    <span className="font-semibold text-gray-800 text-sm">{unit.name || `Unit ${ui + 1}`}</span>
                    <span className="ml-auto text-xs text-gray-400">{unit.lessons?.length || 0} lessons</span>
                  </button>
                  {uExpanded && (
                    <div className="border-t border-gray-100 px-5 pb-4">
                      {(unit.lessons || []).length === 0 ? (
                        <p className="text-gray-400 text-xs py-3 m-0">No lessons in this unit.</p>
                      ) : (
                        <div className="flex flex-col gap-2 mt-3">
                          {(unit.lessons || []).map((lesson, li) => {
                            const lKey = `${ui}-${li}`;
                            const lExpanded = expandedLessons.has(lKey);
                            return (
                              <div key={li} className="rounded-lg border border-gray-100 overflow-hidden">
                                <button onClick={() => toggleLesson(lKey)}
                                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border-none cursor-pointer text-left hover:bg-gray-100 transition-colors">
                                  <span className={`transition-transform text-gray-400 ${lExpanded ? "rotate-0" : "-rotate-90"}`}><ChevronDown /></span>
                                  <span className="text-[#006236]"><LessonIcon /></span>
                                  <span className="text-gray-700 text-sm font-medium">{lesson.name || `Lesson ${li + 1}`}</span>
                                  <span className="ml-auto flex items-center gap-1.5">
                                    {(lesson.blocks || []).map((b, bi) => {
                                      const m = BLOCK_META[b.type];
                                      return m ? <span key={bi} className={`text-xs ${m.accent}`} title={m.label}>{m.icon}</span> : null;
                                    })}
                                  </span>
                                </button>
                                {lExpanded && (
                                  <div className="p-4 flex flex-col gap-3 bg-gray-50/50">
                                    {(lesson.blocks || []).length === 0 ? (
                                      <p className="text-gray-400 text-xs m-0">No content blocks.</p>
                                    ) : (
                                      lesson.blocks.map((block, bi) => <BlockViewer key={bi} block={block} />)
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== Course List (Catalog) ==================== */
export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const [activeCourse, setActiveCourse] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getStudentCourses();
        if (!cancelled) setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Courses fetch error:", err);
        if (!cancelled) {
          setError(err?.message || "Could not load courses. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const openCourse = async (id) => {
    setLoadingDetail(true);
    try {
      const detail = await getStudentCourseDetail(id);
      setActiveCourse(detail);
    } catch {
      setError("Could not load course details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  if (activeCourse && !loadingDetail) {
    return (
      <StudentLayout activePage="s-courses">
        <CourseDetail course={activeCourse} onBack={() => setActiveCourse(null)} />
      </StudentLayout>
    );
  }

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchText = !q || c.subject.toLowerCase().includes(q) || (c.title || "").toLowerCase().includes(q);
    const matchLevel = levelFilter === "all" || c.level === levelFilter;
    return matchText && matchLevel;
  });

  const grouped = {};
  filtered.forEach(c => {
    if (!grouped[c.subject]) grouped[c.subject] = [];
    grouped[c.subject].push(c);
  });

  return (
    <StudentLayout activePage="s-courses">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-5 bg-[#006236]/5 border-b border-[#006236]/15 shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-[#006236] m-0">Courses</h1>
              <p className="text-gray-500 text-sm m-0 mt-0.5">Browse and study at your own pace</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-white rounded-full px-3.5 py-2 border border-[#006236]/20">
                <span className="text-[#006236]/50"><SearchIcon /></span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="border-none outline-none bg-transparent text-sm text-gray-700 w-[160px]" />
              </div>
              {/* Level filter */}
              <div className="flex gap-1 bg-[#006236]/5 rounded-full p-1 border border-[#006236]/10">
                {["all", "beginner", "intermediate", "advanced"].map(lv => (
                  <button key={lv} onClick={() => setLevelFilter(lv)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer transition-colors ${
                      levelFilter === lv
                        ? "bg-[#006236] text-white shadow-sm"
                        : "bg-transparent text-gray-500 hover:text-gray-700"
                    }`}>
                    {lv === "all" ? "All" : lv.charAt(0).toUpperCase() + lv.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading || loadingDetail ? <Spinner /> : error ? (
            <div className="text-center py-12 text-red-600 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-[#006236]/20 mb-4 flex justify-center"><BookIcon /></div>
              <h3 className="text-gray-700 font-semibold text-base m-0 mb-1">
                {courses.length === 0 ? "No courses published yet" : "No courses match your search"}
              </h3>
              <p className="text-gray-500 text-sm m-0">
                {courses.length === 0
                  ? "Your admin team hasn't published any courses yet. Check back soon!"
                  : "Try adjusting your search or level filter."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(grouped).map(([subject, subjectCourses]) => (
                <div key={subject}>
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookIcon /> {subject}
                  </h2>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                    {subjectCourses.map(c => {
                      const lc = LEVEL_COLORS[c.level] || LEVEL_COLORS.beginner;
                      return (
                        <button key={c.id} onClick={() => openCourse(c.id)}
                          className="bg-white rounded-2xl border border-[#006236]/15 p-5 text-left cursor-pointer hover:shadow-lg hover:border-[#006236]/40 transition-all group">
                          <div className="flex items-start justify-between mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${lc.bg} ${lc.text}`}>
                              {c.level}
                            </span>
                            <span className="text-gray-300 group-hover:text-[#006236] transition-colors">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </span>
                          </div>
                          <h3 className="text-gray-800 font-bold text-base m-0 mb-1 group-hover:text-[#006236] transition-colors">
                            {c.title || `${c.subject} — ${c.level}`}
                          </h3>
                          {c.description && (
                            <p className="text-gray-400 text-xs m-0 mb-3 line-clamp-2">{c.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
                            <span>{c.unit_count} unit{c.unit_count !== 1 ? "s" : ""}</span>
                            <span>{c.lesson_count} lesson{c.lesson_count !== 1 ? "s" : ""}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
