import { useState } from "react";
import DashboardLayout from "../DashboardLayout";
import ContentBlockEditor, { BLOCK_TYPES } from "./ContentBlockEditor";

/* ---- Helpers ---- */
const createUnit = (name) => ({ id: Date.now()+Math.random(), name, expanded: true, lessons: [] });
const createLesson = (name) => ({ id: Date.now()+Math.random(), name, blocks: [] });

const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","English","Computer Science","Economics","History"];
const LEVELS = ["Beginner","Elementary","Intermediate","Upper-Intermediate","Advanced"];

/* ---- Sample data ---- */
const SAMPLE_UNITS = [
  { id:1, name:"Unit 1: Foundations of Calculus", expanded:true, lessons:[
    { id:11, name:"What is Calculus?", blocks:[
      { id:111, type:"video", title:"Introduction to Calculus", url:"https://www.youtube.com/watch?v=WUvTyaaNkzM", description:"A visual introduction to calculus." },
      { id:112, type:"article", title:"The History of Calculus", content:"Calculus was developed independently by Isaac Newton and Gottfried Wilhelm Leibniz in the late 17th century..." },
    ]},
    { id:12, name:"Limits & Continuity", blocks:[
      { id:121, type:"math", label:"Limit Definition", expression:"lim (x→a) ƒ(x) = L" },
      { id:122, type:"exercise", title:"Practice: Evaluating Limits", instructions:"Evaluate the following limits.", problems:[
        { id:1221, prompt:"Find lim (x→3) of (x² - 9)/(x - 3)", answer:"6", hint:"Factor the numerator", type:"numeric" },
      ]},
    ]},
  ]},
  { id:2, name:"Unit 2: Derivatives", expanded:false, lessons:[
    { id:21, name:"Power Rule", blocks:[] },
    { id:22, name:"Chain Rule", blocks:[] },
  ]},
];

const inputDark = "w-full px-3 py-2.5 rounded-lg border border-white/20 bg-white/10 text-white text-sm outline-none focus:border-white/40 transition-colors";

export default function CourseBuilder() {
  const [meta, setMeta] = useState({ title:"Calculus I: Limits, Derivatives & Integrals", subject:"Mathematics", level:"Intermediate", description:"A comprehensive introduction to single-variable calculus." });
  const [units, setUnits] = useState(SAMPLE_UNITS);
  const [selId, setSelId] = useState(11);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState(false);

  /* ---- Getters ---- */
  const getSel = () => { for (const u of units) { const l = u.lessons.find(l=>l.id===selId); if(l) return {lesson:l,unitId:u.id}; } return {lesson:null,unitId:null}; };
  const {lesson:sel, unitId:selUnitId} = getSel();
  const getBlockSummary = (l) => { if(!l.blocks.length) return "Empty"; const c={}; l.blocks.forEach(b=>{c[b.type]=(c[b.type]||0)+1}); return Object.entries(c).map(([t,n])=>`${n} ${BLOCK_TYPES[t]?.label||t}`).join(", "); };

  /* ---- Updaters ---- */
  const updateLesson = (uid,lid,fn) => setUnits(units.map(u=>u.id===uid?{...u,lessons:u.lessons.map(l=>l.id===lid?fn(l):l)}:u));
  const addBlock = (type) => { if(!sel) return; updateLesson(selUnitId,selId,l=>({...l,blocks:[...l.blocks,{id:Date.now(),type,title:"",content:"",expression:"",url:"",questions:[],problems:[]}]})); setShowAddBlock(false); };
  const updateBlock = (bid,updated) => updateLesson(selUnitId,selId,l=>({...l,blocks:l.blocks.map(b=>b.id===bid?updated:b)}));
  const removeBlock = (bid) => updateLesson(selUnitId,selId,l=>({...l,blocks:l.blocks.filter(b=>b.id!==bid)}));
  const moveBlock = (bid,dir) => updateLesson(selUnitId,selId,l=>{const i=l.blocks.findIndex(b=>b.id===bid);if((dir===-1&&i===0)||(dir===1&&i===l.blocks.length-1))return l;const nb=[...l.blocks];[nb[i],nb[i+dir]]=[nb[i+dir],nb[i]];return{...l,blocks:nb};});
  const addUnit = () => setUnits([...units,createUnit(`Unit ${units.length+1}: New Unit`)]);
  const addLesson = (uid) => setUnits(units.map(u=>u.id===uid?{...u,lessons:[...u.lessons,createLesson("New Lesson")],expanded:true}:u));
  const removeUnit = (uid) => setUnits(units.filter(u=>u.id!==uid));
  const removeLesson = (uid,lid) => { setUnits(units.map(u=>u.id===uid?{...u,lessons:u.lessons.filter(l=>l.id!==lid)}:u)); if(selId===lid) setSelId(null); };
  const handleSave = () => { setToast(true); setTimeout(()=>setToast(false),2500); };

  /* ====== PREVIEW MODE ====== */
  if (preview && sel) {
    return (
      <DashboardLayout activePage="courses">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 bg-[#006236]">
            <span className="text-white font-semibold">Preview: {sel.name}</span>
            <button onClick={()=>setPreview(false)} className="bg-white text-[#006236] border-none px-5 py-2 rounded-full cursor-pointer text-sm font-semibold">← Back to Editor</button>
          </div>
          <div className="max-w-[800px] mx-auto px-6 py-8">
            <h1 className="text-white text-2xl mb-2">{sel.name}</h1>
            <p className="text-white/50 text-sm mb-8">{meta.subject} · {meta.level}</p>
            {sel.blocks.map(block=>(
              <div key={block.id} className="mb-8">
                {block.type==="video" && (
                  <div>
                    {block.title && <h2 className="text-white text-xl mb-3">{block.title}</h2>}
                    {block.url && (()=>{const m=block.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/); return m?<div className="rounded-2xl overflow-hidden relative pb-[56.25%] bg-black"><iframe src={`https://www.youtube.com/embed/${m[1]}`} title={block.title} allowFullScreen className="absolute inset-0 w-full h-full border-none"/></div>:null;})()}
                    {block.description && <p className="text-white/60 text-sm mt-3 leading-relaxed">{block.description}</p>}
                  </div>
                )}
                {block.type==="article" && (
                  <div className="bg-white/10 rounded-2xl p-6">
                    {block.title && <h2 className="text-white text-lg mb-3">{block.title}</h2>}
                    <p className="text-white/80 text-sm leading-7 whitespace-pre-wrap">{block.content}</p>
                  </div>
                )}
                {block.type==="math" && (
                  <div className="bg-white/95 rounded-2xl p-6 text-center">
                    {block.label && <div className="text-[#006236] text-sm font-semibold mb-2">{block.label}</div>}
                    <div className="font-serif text-3xl text-gray-900">{block.expression}</div>
                  </div>
                )}
                {block.type==="quiz" && (
                  <div className="bg-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-white text-lg m-0">{block.title||"Quiz"}</h2>
                      <div className="flex gap-3 text-white/50 text-xs">
                        {block.timeLimit && <span>⏱ {block.timeLimit} min</span>}
                        {block.passPercentage && <span>Pass: {block.passPercentage}%</span>}
                      </div>
                    </div>
                    {(block.questions||[]).map((q,qi)=>(
                      <div key={q.id} className="mb-5 pb-4 border-b border-white/10 last:border-none">
                        <p className="text-white text-sm mb-3">{qi+1}. {q.text}</p>
                        <div className="flex flex-col gap-2 pl-5">
                          {q.options.map((o,oi)=>(
                            <div key={o.id} className="flex items-center gap-3 text-white/70 text-sm">
                              <div className="w-5 h-5 rounded-full border-2 border-white/30 shrink-0"/>
                              <span>{String.fromCharCode(65+oi)}) {o.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {block.type==="exercise" && (
                  <div className="bg-white/10 rounded-2xl p-6">
                    <h2 className="text-white text-lg mb-2">{block.title||"Exercise"}</h2>
                    {block.instructions && <p className="text-white/50 text-sm mb-4">{block.instructions}</p>}
                    {(block.problems||[]).map((p,pi)=>(
                      <div key={p.id} className="mb-4">
                        <p className="text-white text-sm mb-2">{pi+1}. {p.prompt}</p>
                        <input readOnly placeholder="Type your answer..." className="w-full px-3 py-2.5 rounded-lg border-2 border-white/20 bg-white/5 text-white text-sm"/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!sel.blocks.length && <p className="text-white/30 text-center text-lg py-16">This lesson has no content yet.</p>}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ====== EDITOR MODE ====== */
  return (
    <DashboardLayout activePage="courses">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#006236]/15 bg-black/10 flex-wrap gap-2.5 xl:px-6">
          <h1 className="text-white text-lg m-0 xl:text-2xl">Course Builder</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>setShowMeta(!showMeta)} className={`px-4 py-2 rounded-full border border-white/30 text-white text-xs cursor-pointer ${showMeta?'bg-white/15':'bg-transparent'}`}>⚙ Settings</button>
            {sel && <button onClick={()=>setPreview(true)} className="px-4 py-2 rounded-full border border-white/30 bg-transparent text-white text-xs cursor-pointer">👁 Preview</button>}
            <button onClick={handleSave} className="px-4 py-2 rounded-full border-none bg-white/15 text-white text-xs cursor-pointer">💾 Save Draft</button>
            <button className="px-5 py-2 rounded-full border-none bg-[#006236] text-white text-xs font-semibold cursor-pointer">☁ Publish</button>
          </div>
        </div>

        {/* Course settings */}
        {showMeta && (
          <div className="px-4 py-5 bg-black/15 border-b border-[#006236]/15 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 xl:px-6">
            <div>
              <label className="text-white/70 text-xs font-semibold mb-1.5 block">Course Title</label>
              <input className={inputDark} value={meta.title} onChange={e=>setMeta({...meta,title:e.target.value})} />
            </div>
            <div>
              <label className="text-white/70 text-xs font-semibold mb-1.5 block">Subject</label>
              <select className={inputDark+" cursor-pointer"} value={meta.subject} onChange={e=>setMeta({...meta,subject:e.target.value})}>
                {SUBJECTS.map(s=><option key={s} value={s} className="text-black">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-xs font-semibold mb-1.5 block">Level</label>
              <select className={inputDark+" cursor-pointer"} value={meta.level} onChange={e=>setMeta({...meta,level:e.target.value})}>
                {LEVELS.map(l=><option key={l} value={l} className="text-black">{l}</option>)}
              </select>
            </div>
            <div className="col-span-full">
              <label className="text-white/70 text-xs font-semibold mb-1.5 block">Description</label>
              <textarea className={inputDark+" resize-y"} rows={2} value={meta.description} onChange={e=>setMeta({...meta,description:e.target.value})} />
            </div>
          </div>
        )}

        {/* Main body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-[clamp(220px,22vw,320px)] shrink-0 border-r border-[#006236]/15 overflow-y-auto py-4 bg-black/10">
            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-white/50 text-[11px] font-bold tracking-widest uppercase">Course Structure</span>
              <button onClick={addUnit} title="Add Unit" className="w-7 h-7 rounded-md border border-white/20 bg-transparent text-white cursor-pointer flex items-center justify-center text-lg">+</button>
            </div>

            {units.map(unit=>(
              <div key={unit.id} className="mb-1">
                {/* Unit row */}
                <div className="flex items-center gap-1.5 px-4 py-2 hover:bg-white/5 transition-colors group">
                  <button onClick={()=>setUnits(units.map(u=>u.id===unit.id?{...u,expanded:!u.expanded}:u))} className="text-white/40 bg-transparent border-none cursor-pointer text-xs p-0">{unit.expanded?"▼":"▶"}</button>
                  <span className="text-[#006236]">📁</span>
                  <input value={unit.name} onChange={e=>setUnits(units.map(u=>u.id===unit.id?{...u,name:e.target.value}:u))}
                    className="flex-1 bg-transparent border-none outline-none text-white text-xs font-semibold min-w-0" />
                  <button onClick={()=>addLesson(unit.id)} title="Add lesson" className="text-white/30 bg-transparent border-none cursor-pointer text-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">+</button>
                  <button onClick={()=>removeUnit(unit.id)} title="Delete unit" className="text-white/20 bg-transparent border-none cursor-pointer text-xs p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>

                {/* Lessons */}
                {unit.expanded && unit.lessons.map(lesson=>{
                  const active = selId===lesson.id;
                  return (
                    <div key={lesson.id} onClick={()=>setSelId(lesson.id)}
                      className={`flex items-center gap-2 py-1.5 pl-10 pr-4 cursor-pointer transition-all group/l ${active?'bg-[#006236]/20 border-l-[3px] border-[#006236]':'border-l-[3px] border-transparent hover:bg-white/[0.03]'}`}>
                      <span className={active?"text-[#006236]":"text-white/30"}>📄</span>
                      <input value={lesson.name} onChange={e=>{e.stopPropagation();setUnits(units.map(u=>u.id===unit.id?{...u,lessons:u.lessons.map(l=>l.id===lesson.id?{...l,name:e.target.value}:l)}:u));}}
                        onClick={e=>e.stopPropagation()}
                        className={`flex-1 bg-transparent border-none outline-none text-xs min-w-0 ${active?'text-white':'text-white/60'}`} />
                      <button onClick={e=>{e.stopPropagation();removeLesson(unit.id,lesson.id);}}
                        className="text-white/20 bg-transparent border-none cursor-pointer text-xs p-0.5 shrink-0 opacity-0 group-hover/l:opacity-100 transition-opacity">✕</button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-y-auto p-4 xl:p-6">
            {sel ? (
              <>
                {/* Lesson header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1 text-white/40 text-xs">
                    <span>{units.find(u=>u.id===selUnitId)?.name}</span>
                    <span>›</span>
                    <span className="text-white/60">{sel.name}</span>
                  </div>
                  <h2 className="text-white text-xl m-0 xl:text-2xl">{sel.name}</h2>
                  <p className="text-white/35 text-xs mt-1">{getBlockSummary(sel)}</p>
                </div>

                {/* Content blocks */}
                <div className="flex flex-col gap-4">
                  {sel.blocks.map((block,idx)=>(
                    <ContentBlockEditor key={block.id} block={block} index={idx} total={sel.blocks.length}
                      onChange={u=>updateBlock(block.id,u)} onRemove={()=>removeBlock(block.id)}
                      onMoveUp={()=>moveBlock(block.id,-1)} onMoveDown={()=>moveBlock(block.id,1)} />
                  ))}
                </div>

                {/* Add block */}
                {showAddBlock ? (
                  <div className="mt-4 p-5 bg-white/[0.06] rounded-2xl border-2 border-[#006236]/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white text-sm font-semibold">Add Content Block</span>
                      <button onClick={()=>setShowAddBlock(false)} className="bg-transparent border-none text-white/50 text-lg cursor-pointer">✕</button>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                      {Object.entries(BLOCK_TYPES).map(([type,m])=>(
                        <button key={type} onClick={()=>addBlock(type)}
                          className="p-4 rounded-xl border-2 border-white/10 bg-white/5 cursor-pointer flex flex-col items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all">
                          <div className="text-2xl">{m.icon}</div>
                          <span className="text-white text-xs font-semibold">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>setShowAddBlock(true)}
                    className="mt-4 w-full p-4 rounded-xl border-2 border-dashed border-[#006236]/30 bg-transparent text-[#006236] cursor-pointer text-sm font-semibold hover:bg-[#006236]/[0.06] transition-colors flex items-center justify-center gap-2">
                    + Add Content Block
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/25 text-center gap-4">
                <div className="text-5xl">📄</div>
                <p className="text-lg">Select a lesson to edit</p>
                <p className="text-sm opacity-70">Choose from the sidebar, or create a new unit to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-8 right-8 bg-[#006236] text-white px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg z-50 animate-[fadeIn_0.2s_ease]">
            ✓ Course saved as draft
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
