import { useState, useEffect } from "react";
import DashboardLayout from "../DashboardLayout";
import ContentBlockEditor, { BLOCK_TYPES } from "./ContentBlockEditor";
import { getCourseBuilderCourses, publishCourse } from "../../../../utils/registrationApi";

/* ---- Constants ---- */
const LEVELS = ["beginner", "intermediate", "advanced"];
const DEFAULT_SUBJECTS = ["English", "Physics", "Math", "Programming", "Chemistry", "Biology"];
const DRAFT_KEY = "adminCourses";

/* ---- Helpers ---- */
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const createUnit = (name) => ({ id: uid(), name, expanded: true, lessons: [] });
const createLesson = (name) => ({ id: uid(), name, blocks: [] });

const emptyCourse = () => ({ title: "", description: "", units: [] });

const fingerprint = (course) =>
  JSON.stringify({
    title: course?.title || "",
    description: course?.description || "",
    units: (course?.units || []).map((u) => ({
      name: u.name || "",
      lessons: (u.lessons || []).map((l) => ({
        name: l.name || "",
        blocks: (l.blocks || []).map((b) => {
          const { id, ...rest } = b;
          return rest;
        }),
      })),
    })),
  });

/* ---- SVG Icons ---- */
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

/* ---- Toast ---- */
function Toast({ message, type, onClose }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[560px] w-[90vw] animate-[slideUp_0.25s_ease-out]">
      <div className={`rounded-xl shadow-2xl px-5 py-4 flex items-start gap-3 ${isError ? "bg-white border-2 border-red-200" : "bg-white border-2 border-[#006236]/30"}`}>
        <span className={`text-lg shrink-0 mt-0.5 ${isError ? "text-red-500" : "text-[#006236]"}`}>
          {isError ? "⚠" : "✓"}
        </span>
        <p className={`text-sm flex-1 m-0 ${isError ? "text-gray-700" : "text-[#006236]"}`}>{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-lg leading-none shrink-0">
          ×
        </button>
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform: translate(-50%,20px); } to { opacity:1; transform: translate(-50%,0); } }`}</style>
    </div>
  );
}

const inputField = "w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 bg-white text-gray-800 text-sm outline-none focus:border-[#006236]/50 transition-colors";

export default function CourseBuilder() {
  /* ---- State ---- */
  const [allCourses, setAllCourses] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [backendFps, setBackendFps] = useState({});
  const [draftFps, setDraftFps] = useState({});

  const [selectedSubject, setSelectedSubject] = useState("");
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [showLevels, setShowLevels] = useState(false);
  const [mode, setMode] = useState("edit");
  const [selId, setSelId] = useState(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [addingSubject, setAddingSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState("");

  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("error");
  const showToast = (msg, type = "error") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), type === "error" ? 8000 : 3000);
  };

  /* ---- Load from backend + merge localStorage ---- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCourseBuilderCourses();
        if (cancelled) return;

        const converted = {};
        const bfps = {};
        for (const [key, val] of Object.entries(data)) {
          const course = {
            title: val.title || "",
            description: val.description || "",
            units: (val.structure || []).map((u) => ({
              ...u,
              id: u.id || uid(),
              lessons: (u.lessons || []).map((l) => ({
                ...l,
                id: l.id || uid(),
                blocks: (l.blocks || []).map((b) => ({ ...b, id: b.id || uid() })),
              })),
            })),
          };
          converted[key] = course;
          bfps[key] = fingerprint(course);
        }

        const draft = (() => {
          try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch { return {}; }
        })();

        const merged = { ...converted };
        for (const [k, v] of Object.entries(draft)) {
          if (!merged[k] || (merged[k].units || []).length === 0) merged[k] = v;
        }

        if (!cancelled) {
          const mfps = {};
          for (const [k, v] of Object.entries(merged)) mfps[k] = fingerprint(v);
          setAllCourses(merged);
          setBackendFps(bfps);
          setDraftFps(mfps);
          setLoaded(true);
        }
      } catch {
        const draft = (() => {
          try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch { return {}; }
        })();
        if (!cancelled) {
          const dfps = {};
          for (const [k, v] of Object.entries(draft)) dfps[k] = fingerprint(v);
          setAllCourses(draft);
          setBackendFps({});
          setDraftFps(dfps);
          setLoaded(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (mode === "preview") setShowLevels(true);
    else setShowLevels(false);
  }, [mode]);

  /* ---- Derived state ---- */
  const cKey = `${selectedSubject}__${activeLevel}`;
  const course = allCourses[cKey] || emptyCourse();
  const units = course.units || [];

  const setCourse = (c) => {
    setAllCourses((prev) => ({ ...prev, [cKey]: typeof c === "function" ? c(prev[cKey] || emptyCourse()) : c }));
  };
  const setUnits = (u) => setCourse({ ...course, units: typeof u === "function" ? u(units) : u });

  const hasContent = Object.values(allCourses).some((c) => (c?.units || []).length > 0);

  const canSave = loaded && hasContent && Object.keys(allCourses).some((key) => {
    const c = allCourses[key];
    if (!c || (c.units || []).length === 0) return false;
    return draftFps[key] !== fingerprint(c);
  });

  const canPublish = loaded && hasContent && Object.keys(allCourses).some((key) => {
    const c = allCourses[key];
    if (!c || (c.units || []).length === 0) return false;
    return backendFps[key] !== fingerprint(c);
  });

  /* ---- Get selected lesson ---- */
  const getSel = () => {
    for (const u of units) {
      const l = u.lessons.find((l) => l.id === selId);
      if (l) return { lesson: l, unitId: u.id };
    }
    return { lesson: null, unitId: null };
  };
  const { lesson: sel, unitId: selUnitId } = getSel();

  const getBlockSummary = (l) => {
    if (!l.blocks.length) return "Empty";
    const c = {};
    l.blocks.forEach((b) => { c[b.type] = (c[b.type] || 0) + 1; });
    return Object.entries(c).map(([t, n]) => `${n} ${BLOCK_TYPES[t]?.label || t}`).join(", ");
  };

  /* ---- Updaters ---- */
  const updateLesson = (uid2, lid, fn) =>
    setUnits(units.map((u) => u.id === uid2 ? { ...u, lessons: u.lessons.map((l) => l.id === lid ? fn(l) : l) } : u));

  const addBlock = (type) => {
    if (!sel) return;
    updateLesson(selUnitId, selId, (l) => ({
      ...l,
      blocks: [...l.blocks, { id: uid(), type, title: "", content: "", expression: "", url: "", description: "", label: "", questions: [], problems: [], instructions: "", timeLimit: "", passPercentage: "" }],
    }));
    setShowAddBlock(false);
  };

  const updateBlock = (bid, updated) =>
    updateLesson(selUnitId, selId, (l) => ({ ...l, blocks: l.blocks.map((b) => b.id === bid ? updated : b) }));

  const removeBlock = (bid) =>
    updateLesson(selUnitId, selId, (l) => ({ ...l, blocks: l.blocks.filter((b) => b.id !== bid) }));

  const moveBlock = (bid, dir) =>
    updateLesson(selUnitId, selId, (l) => {
      const i = l.blocks.findIndex((b) => b.id === bid);
      if ((dir === -1 && i === 0) || (dir === 1 && i === l.blocks.length - 1)) return l;
      const nb = [...l.blocks];
      [nb[i], nb[i + dir]] = [nb[i + dir], nb[i]];
      return { ...l, blocks: nb };
    });

  const addUnit = () => setUnits([...units, createUnit(`Unit ${units.length + 1}: New Unit`)]);

  const addLesson = (uid2) =>
    setUnits(units.map((u) => u.id === uid2 ? { ...u, lessons: [...u.lessons, createLesson("New Lesson")], expanded: true } : u));

  const removeUnit = (uid2) => setUnits(units.filter((u) => u.id !== uid2));

  const removeLesson = (uid2, lid) => {
    setUnits(units.map((u) => u.id === uid2 ? { ...u, lessons: u.lessons.filter((l) => l.id !== lid) } : u));
    if (selId === lid) setSelId(null);
  };

  /* ---- Build subject list ---- */
  const subjectList = [
    ...DEFAULT_SUBJECTS,
    ...Object.keys(allCourses).map((k) => k.split("__")[0]).filter((s) => !DEFAULT_SUBJECTS.includes(s)),
  ].filter((v, i, a) => a.indexOf(v) === i);

  /* ---- Save Draft ---- */
  const handleSave = () => {
    if (!canSave) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(allCourses));
    const nextFps = {};
    for (const [k, v] of Object.entries(allCourses)) nextFps[k] = fingerprint(v);
    setDraftFps(nextFps);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ---- Publish ---- */
  const handlePublish = async () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(allCourses));

    const keysToPublish = Object.entries(allCourses).filter(([key, c]) => {
      if (!c || (c.units || []).length === 0) return false;
      return backendFps[key] !== fingerprint(c);
    });

    if (keysToPublish.length === 0) {
      showToast("No changes to publish.", "success");
      return;
    }

    setPublishing(true);
    try {
      for (const [key, c] of keysToPublish) {
        const [subj, lvl] = key.split("__");

        const cleanStructure = (c.units || []).map((u) => ({
          id: u.id,
          name: u.name,
          expanded: !!u.expanded,
          lessons: (u.lessons || []).map((l) => ({
            id: l.id,
            name: l.name,
            blocks: (l.blocks || []).map((b) => ({ ...b })),
          })),
        }));

        await publishCourse({
          subject: subj,
          level: lvl,
          title: c.title || "",
          description: c.description || "",
          structure: cleanStructure,
        });
      }

      showToast("Course published successfully!", "success");

      const publishedFps = {};
      for (const [k, c] of keysToPublish) publishedFps[k] = fingerprint(c);
      setBackendFps((prev) => ({ ...prev, ...publishedFps }));
      setDraftFps((prev) => ({ ...prev, ...publishedFps }));
      setMode("preview");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const detail = err?.data?.error || err?.data?.detail || err?.message || "Failed to publish. Please try again.";
      showToast(detail === "Request failed" ? "Something went wrong on the server. Please try again." : detail);
    } finally {
      setPublishing(false);
    }
  };

  /* ============================================================
     PREVIEW MODE (read-only view of a course for a subject/level)
     ============================================================ */
  if (mode === "preview" && sel) {
    return (
      <DashboardLayout activePage="courses">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 bg-[#006236]">
            <span className="text-white font-semibold">Preview: {sel.name}</span>
            <button onClick={() => setMode("edit")} className="bg-white text-[#006236] border-none px-5 py-2 rounded-full cursor-pointer text-sm font-semibold">
              ← Back to Editor
            </button>
          </div>
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <h1 className="text-gray-800 text-2xl mb-2">{sel.name}</h1>
            <p className="text-gray-500 text-sm mb-8">{selectedSubject} · {activeLevel}</p>
            {sel.blocks.map((block) => (
              <div key={block.id} className="mb-8">
                {block.type === "video" && (
                  <div>
                    {block.title && <h2 className="text-gray-800 text-xl mb-3">{block.title}</h2>}
                    {block.url && (() => {
                      const m = block.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                      return m ? (
                        <div className="rounded-2xl overflow-hidden relative pb-[56.25%] bg-black">
                          <iframe src={`https://www.youtube.com/embed/${m[1]}`} title={block.title} allowFullScreen className="absolute inset-0 w-full h-full border-none" />
                        </div>
                      ) : null;
                    })()}
                    {block.description && <p className="text-gray-500 text-sm mt-3 leading-relaxed">{block.description}</p>}
                  </div>
                )}
                {block.type === "article" && (
                  <div className="bg-white rounded-2xl p-6 border border-[#006236]/10">
                    {block.title && <h2 className="text-[#006236] text-lg mb-3">{block.title}</h2>}
                    <p className="text-gray-700 text-sm leading-7 whitespace-pre-wrap">{block.content}</p>
                  </div>
                )}
                {block.type === "math" && (
                  <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-200">
                    {block.label && <div className="text-[#006236] text-sm font-semibold mb-2">{block.label}</div>}
                    <div className="font-serif text-3xl text-gray-900">{block.expression}</div>
                  </div>
                )}
                {block.type === "quiz" && (
                  <div className="bg-white rounded-2xl p-6 border border-amber-200">
                    <h2 className="text-amber-700 text-lg mb-4">{block.title || "Quiz"}</h2>
                    {(block.questions || []).map((q, qi) => (
                      <div key={q.id} className="mb-5 pb-4 border-b border-gray-200 last:border-none">
                        <p className="text-gray-800 text-sm mb-3">{qi + 1}. {q.text}</p>
                        <div className="flex flex-col gap-2 pl-5">
                          {q.options.map((o, oi) => (
                            <div key={o.id} className="flex items-center gap-3 text-gray-600 text-sm">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                              <span>{String.fromCharCode(65 + oi)}) {o.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {block.type === "exercise" && (
                  <div className="bg-violet-50 rounded-2xl p-6 border border-violet-200">
                    <h2 className="text-violet-700 text-lg mb-2">{block.title || "Exercise"}</h2>
                    {block.instructions && <p className="text-gray-500 text-sm mb-4">{block.instructions}</p>}
                    {(block.problems || []).map((p, pi) => (
                      <div key={p.id} className="mb-4">
                        <p className="text-gray-800 text-sm mb-2">{pi + 1}. {p.prompt}</p>
                        <input readOnly placeholder="Type your answer..." className="w-full px-3 py-2.5 rounded-lg border-2 border-violet-200 bg-white text-gray-700 text-sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!sel.blocks.length && <p className="text-gray-400 text-center text-lg py-16">This lesson has no content yet.</p>}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ============================================================
     EDITOR MODE
     ============================================================ */
  return (
    <DashboardLayout activePage="courses">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ---- Top bar ---- */}
        <div className="px-4 sm:px-6 py-4 bg-[#006236]/5 border-b border-[#006236]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[#006236] text-xl sm:text-2xl font-bold m-0 flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Course Builder
            </h1>
            {showLevels && (
              <button
                onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm cursor-pointer border-none transition-colors ${
                  mode === "preview" ? "bg-amber-500 text-white" : "bg-white text-[#006236] border border-[#006236]/20"
                }`}
              >
                {mode === "preview" ? <><EditIcon /> Edit</> : <><EyeIcon /> Preview</>}
              </button>
            )}
          </div>

          {/* Subject selection or level tabs */}
          {mode === "edit" && !showLevels ? (
            <div className="flex flex-col gap-2">
              <div className="text-[#006236] text-sm font-semibold">Subjects</div>
              <div className="flex flex-wrap gap-2">
                {subjectList.map((s) => {
                  const bCount = (allCourses[`${s}__beginner`]?.units || []).length;
                  const iCount = (allCourses[`${s}__intermediate`]?.units || []).length;
                  const aCount = (allCourses[`${s}__advanced`]?.units || []).length;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSubject(s);
                        setActiveLevel("beginner");
                        setShowLevels(true);
                        setSelId(null);
                      }}
                      className="px-4 py-2 rounded-2xl border-2 text-sm cursor-pointer transition-colors bg-white/60 border-[#006236]/20 hover:bg-white hover:border-[#006236]/30 text-[#006236]"
                      title={`Beginner: ${bCount} units · Intermediate: ${iCount} units · Advanced: ${aCount} units`}
                    >
                      <div className="font-semibold">{s}</div>
                      <div className="text-xs opacity-80 mt-0.5">
                        {bCount}/{iCount}/{aCount} units
                      </div>
                    </button>
                  );
                })}

                {addingSubject ? (
                  <div className="flex items-center gap-1">
                    <input
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      autoFocus
                      className="px-2.5 py-1 rounded-full border border-[#006236]/30 text-sm outline-none w-28 bg-white"
                      placeholder="Subject name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customSubject.trim()) {
                          setSelectedSubject(customSubject.trim());
                          setCustomSubject("");
                          setAddingSubject(false);
                          setActiveLevel("beginner");
                          setShowLevels(true);
                          setSelId(null);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (customSubject.trim()) {
                          setSelectedSubject(customSubject.trim());
                          setCustomSubject("");
                          setAddingSubject(false);
                          setActiveLevel("beginner");
                          setShowLevels(true);
                          setSelId(null);
                        }
                      }}
                      className="px-2 py-1 rounded-full bg-[#006236] text-white text-xs cursor-pointer border-none"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setCustomSubject(""); setAddingSubject(false); }}
                      className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs cursor-pointer border-none"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingSubject(true)}
                    className="px-3 py-1.5 rounded-2xl text-sm cursor-pointer border-2 border-dashed border-[#006236]/30 text-[#006236] bg-transparent hover:bg-[#006236]/5 flex items-center gap-1"
                  >
                    <PlusIcon /> Add
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {mode === "edit" && (
                <div className="flex items-center gap-2">
                  <span className="text-[#006236] text-sm font-semibold">Subject:</span>
                  <span className="px-4 py-1.5 rounded-full bg-white/60 border border-[#006236]/20 text-[#006236] text-sm font-semibold">
                    {selectedSubject}
                  </span>
                  <button
                    onClick={() => { setShowLevels(false); setSelId(null); }}
                    className="ml-2 px-3 py-1.5 rounded-full bg-white/60 border border-[#006236]/20 text-[#006236] text-sm cursor-pointer hover:bg-white"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Level tabs */}
              <div className="flex items-center gap-1">
                {LEVELS.map((lvl) => {
                  const unitCount = (allCourses[`${selectedSubject}__${lvl}`]?.units || []).length;
                  return (
                    <button
                      key={lvl}
                      onClick={() => { setActiveLevel(lvl); setSelId(null); }}
                      className={`px-5 py-2 rounded-t-xl text-sm cursor-pointer border-none font-semibold capitalize transition-colors ${
                        activeLevel === lvl
                          ? "bg-white text-[#006236] shadow-sm"
                          : "bg-[#006236]/10 text-[#006236]/60 hover:bg-[#006236]/15"
                      }`}
                    >
                      {lvl} ({unitCount})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ---- Main body ---- */}
        {!showLevels ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-[#006236] text-xl font-bold mb-2">Select a subject</h3>
              <p className="text-gray-400 text-sm">Click a subject card above to view and edit Beginner/Intermediate/Advanced courses.</p>
            </div>
          </div>
        ) : mode === "preview" ? (
          /* ---- Preview list ---- */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-[900px] mx-auto flex flex-col gap-4">
              <div className="bg-[#006236] text-white rounded-2xl px-6 py-4 text-center">
                <h2 className="text-xl sm:text-2xl font-bold m-0">{selectedSubject}</h2>
                <p className="text-white/70 text-sm mt-1 capitalize">{activeLevel} Level · {units.length} Unit{units.length !== 1 ? "s" : ""}</p>
                {course.title && <p className="text-white/80 text-sm mt-1">{course.title}</p>}
              </div>
              {units.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg">No content yet</p>
                  <p className="text-sm">Switch to Edit mode to add units and lessons.</p>
                </div>
              ) : (
                units.map((unit, ui) => (
                  <div key={unit.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-[#006236]/5 border-b border-gray-100">
                      <h3 className="text-[#006236] font-bold text-sm m-0">{unit.name}</h3>
                    </div>
                    {unit.lessons.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-4">No lessons</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {unit.lessons.map((lesson, li) => (
                          <div key={lesson.id} className="px-4 py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-gray-800 text-sm font-medium m-0">{lesson.name}</p>
                              <p className="text-xs text-gray-400 m-0 mt-0.5">{getBlockSummary(lesson)}</p>
                            </div>
                            <button
                              onClick={() => { setSelId(lesson.id); }}
                              className="px-3 py-1.5 rounded-lg bg-[#006236] text-white text-xs cursor-pointer border-none hover:bg-[#004d2a] shrink-0"
                            >
                              Preview
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* ---- Editor ---- */
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-[clamp(220px,22vw,320px)] shrink-0 border-r-2 border-[#006236]/15 overflow-y-auto py-4 bg-[#f0f3f1]">
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-gray-500 text-[11px] font-bold tracking-widest uppercase">Course Structure</span>
                <button onClick={addUnit} title="Add Unit" className="w-7 h-7 rounded-md border border-[#006236]/30 bg-white text-[#006236] cursor-pointer flex items-center justify-center text-lg">+</button>
              </div>

              {units.map((unit) => (
                <div key={unit.id} className="mb-1">
                  <div className="flex items-center gap-1.5 px-4 py-2 hover:bg-[#006236]/5 transition-colors group">
                    <button
                      onClick={() => setUnits(units.map((u) => u.id === unit.id ? { ...u, expanded: !u.expanded } : u))}
                      className="text-gray-400 bg-transparent border-none cursor-pointer text-xs p-0"
                    >
                      {unit.expanded ? "▼" : "▶"}
                    </button>
                    <span className="text-[#006236]">📁</span>
                    <input
                      value={unit.name}
                      onChange={(e) => setUnits(units.map((u) => u.id === unit.id ? { ...u, name: e.target.value } : u))}
                      className="flex-1 bg-transparent border-none outline-none text-gray-800 text-xs font-semibold min-w-0"
                    />
                    <button onClick={() => addLesson(unit.id)} title="Add lesson" className="text-[#006236]/40 bg-transparent border-none cursor-pointer text-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                    <button onClick={() => removeUnit(unit.id)} title="Delete unit" className="text-red-400 bg-transparent border-none cursor-pointer text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>

                  {unit.expanded && unit.lessons.map((lesson) => {
                    const active = selId === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setSelId(lesson.id)}
                        className={`flex items-center gap-2 py-1.5 pl-10 pr-4 cursor-pointer transition-all group/l ${
                          active ? "bg-[#006236]/10 border-l-[3px] border-[#006236]" : "border-l-[3px] border-transparent hover:bg-[#006236]/5"
                        }`}
                      >
                        <span className={active ? "text-[#006236]" : "text-gray-400"}>📄</span>
                        <input
                          value={lesson.name}
                          onChange={(e) => {
                            e.stopPropagation();
                            setUnits(units.map((u) =>
                              u.id === unit.id
                                ? { ...u, lessons: u.lessons.map((l) => l.id === lesson.id ? { ...l, name: e.target.value } : l) }
                                : u
                            ));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`flex-1 bg-transparent border-none outline-none text-xs min-w-0 ${active ? "text-[#006236] font-semibold" : "text-gray-600"}`}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeLesson(unit.id, lesson.id); }}
                          className="text-red-400 bg-transparent border-none cursor-pointer text-xs p-0.5 shrink-0 opacity-0 group-hover/l:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}

              {units.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-400 text-sm mb-3">No units yet</p>
                  <button
                    onClick={addUnit}
                    className="px-4 py-2 rounded-lg bg-[#006236] text-white text-sm cursor-pointer border-none hover:bg-[#004d2a]"
                  >
                    + Add First Unit
                  </button>
                </div>
              )}
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-y-auto p-4 xl:p-6">
              {sel ? (
                <>
                  {/* Lesson header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs">
                      <span>{units.find((u) => u.id === selUnitId)?.name}</span>
                      <span>›</span>
                      <span className="text-gray-600">{sel.name}</span>
                    </div>
                    <h2 className="text-gray-800 text-xl m-0 xl:text-2xl">{sel.name}</h2>
                    <p className="text-gray-400 text-xs mt-1">{getBlockSummary(sel)}</p>
                  </div>

                  {/* Course meta toggle */}
                  <button
                    onClick={() => setShowMeta(!showMeta)}
                    className={`mb-4 px-4 py-2 rounded-full border border-[#006236]/30 text-[#006236] text-xs cursor-pointer ${showMeta ? "bg-[#006236]/10" : "bg-white"}`}
                  >
                    ⚙ Course Settings
                  </button>

                  {showMeta && (
                    <div className="mb-6 p-4 bg-white rounded-xl border-2 border-[#006236]/15 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                      <div>
                        <label className="text-[#006236] text-xs font-semibold mb-1.5 block">Course Title</label>
                        <input className={inputField} value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} placeholder="e.g. Calculus I" />
                      </div>
                      <div className="col-span-full">
                        <label className="text-[#006236] text-xs font-semibold mb-1.5 block">Description</label>
                        <textarea className={inputField + " resize-y"} rows={2} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} placeholder="Course description..." />
                      </div>
                    </div>
                  )}

                  {/* Content blocks */}
                  <div className="flex flex-col gap-4">
                    {sel.blocks.map((block, idx) => (
                      <ContentBlockEditor
                        key={block.id}
                        block={block}
                        index={idx}
                        total={sel.blocks.length}
                        onChange={(u) => updateBlock(block.id, u)}
                        onRemove={() => removeBlock(block.id)}
                        onMoveUp={() => moveBlock(block.id, -1)}
                        onMoveDown={() => moveBlock(block.id, 1)}
                      />
                    ))}
                  </div>

                  {/* Add block */}
                  {showAddBlock ? (
                    <div className="mt-4 p-5 bg-white rounded-2xl border-2 border-[#006236]/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-800 text-sm font-semibold">Add Content Block</span>
                        <button onClick={() => setShowAddBlock(false)} className="bg-transparent border-none text-gray-400 text-lg cursor-pointer hover:text-gray-600">✕</button>
                      </div>
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                        {Object.entries(BLOCK_TYPES).map(([type, m]) => (
                          <button
                            key={type}
                            onClick={() => addBlock(type)}
                            className="p-4 rounded-xl border-2 border-[#006236]/15 bg-[#006236]/5 cursor-pointer flex flex-col items-center gap-2 hover:bg-[#006236]/10 hover:border-[#006236]/30 transition-all"
                          >
                            <div className="text-2xl">{m.icon}</div>
                            <span className="text-gray-700 text-xs font-semibold">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddBlock(true)}
                      className="mt-4 w-full p-4 rounded-xl border-2 border-dashed border-[#006236]/30 bg-transparent text-[#006236] cursor-pointer text-sm font-semibold hover:bg-[#006236]/[0.06] transition-colors flex items-center justify-center gap-2"
                    >
                      + Add Content Block
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center gap-4">
                  <div className="text-5xl">📄</div>
                  <p className="text-lg text-gray-500">Select a lesson to edit</p>
                  <p className="text-sm text-gray-400">Choose from the sidebar, or create a new unit to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---- Bottom action bar ---- */}
        {mode === "edit" && showLevels && (
          <div className="sticky bottom-0 bg-white border-t-2 border-[#006236]/10 px-4 sm:px-6 py-3 flex items-center justify-end gap-3 z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            {saved && <span className="text-[#006236] text-sm font-semibold animate-pulse mr-auto">✓ Saved!</span>}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm cursor-pointer bg-white text-[#006236] border border-[#006236]/30 hover:bg-[#006236]/5 transition-colors disabled:opacity-60"
              disabled={!canSave}
            >
              <SaveIcon /> Save Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={!canPublish || publishing}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm cursor-pointer bg-[#006236] text-white border-none hover:bg-[#004d2a] transition-colors font-semibold disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish Course"}
            </button>
          </div>
        )}

        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
      </div>
    </DashboardLayout>
  );
}
