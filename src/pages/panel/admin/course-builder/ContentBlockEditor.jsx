import { useState } from "react";

/* ---- Math Symbol Palette ---- */
const MATH_SYMBOLS = [
  "∑","∫","√","∞","π","θ","Δ","α","β","≤","≥","≠","±","÷","×","²","³","ⁿ","∂","∈","∉","⊂","∪","∩","ƒ","→","⇒","∀","∃","lim ",
];

/* ---- Block type metadata ---- */
const BLOCK_TYPES = {
  video:    { label: "Video Lesson",    color: "red",    icon: "▶" },
  article:  { label: "Article",         color: "green",  icon: "📄" },
  math:     { label: "Math Expression", color: "blue",   icon: "ƒx" },
  quiz:     { label: "Quiz",            color: "amber",  icon: "?" },
  exercise: { label: "Exercise",        color: "violet", icon: "✎" },
};

const colorMap = {
  red:    { bg: "bg-red-500",    bgLight: "bg-red-50",    border: "border-red-200",    text: "text-red-600" },
  green:  { bg: "bg-green-700",  bgLight: "bg-green-50",  border: "border-green-200",  text: "text-green-700" },
  blue:   { bg: "bg-blue-500",   bgLight: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-600" },
  amber:  { bg: "bg-amber-500",  bgLight: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-600" },
  violet: { bg: "bg-violet-500", bgLight: "bg-violet-50", border: "border-violet-200", text: "text-violet-600" },
};

const inputCls = "w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 transition-colors";

/* ====== VIDEO ====== */
function VideoBlock({ block, onChange }) {
  const getEmbed = (url) => {
    const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };
  const embed = getEmbed(block.url);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">YouTube URL</label>
        <input className={inputCls} value={block.url||""} onChange={e=>onChange({...block,url:e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
      </div>
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Video Title</label>
        <input className={inputCls} value={block.title||""} onChange={e=>onChange({...block,title:e.target.value})} placeholder="e.g. Introduction to Integration" />
      </div>
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Description (optional)</label>
        <textarea className={inputCls+" resize-y"} rows={2} value={block.description||""} onChange={e=>onChange({...block,description:e.target.value})} placeholder="Brief description..." />
      </div>
      {embed ? (
        <div className="rounded-xl overflow-hidden relative pb-[56.25%] bg-black">
          <iframe src={embed} title={block.title||"Video"} allowFullScreen className="absolute inset-0 w-full h-full border-none" />
        </div>
      ) : block.url ? (
        <div className="rounded-xl p-5 bg-red-50 border border-red-200 text-red-600 text-sm text-center">Invalid YouTube URL</div>
      ) : (
        <div className="rounded-xl p-10 bg-[#006236]/5 border-2 border-dashed border-[#006236]/20 text-center text-[#006236]">
          <div className="text-4xl mb-2">▶</div>
          <p className="text-sm opacity-70">Paste a YouTube URL above to preview</p>
        </div>
      )}
    </div>
  );
}

/* ====== ARTICLE ====== */
function ArticleBlock({ block, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Article Title</label>
        <input className={inputCls} value={block.title||""} onChange={e=>onChange({...block,title:e.target.value})} placeholder="e.g. The Fundamental Theorem of Calculus" />
      </div>
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Content</label>
        <textarea className={inputCls+" resize-y min-h-[160px] leading-7"} rows={8} value={block.content||""} onChange={e=>onChange({...block,content:e.target.value})} placeholder="Write article content here..." />
      </div>
      <div className="p-3 bg-[#006236]/5 rounded-lg text-xs text-gray-500 leading-relaxed">
        <strong className="text-[#006236]">Tip:</strong> Use **text** for bold, wrap expressions in $ signs for inline math.
      </div>
    </div>
  );
}

/* ====== MATH ====== */
function MathBlock({ block, onChange }) {
  const [showPalette, setShowPalette] = useState(true);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Expression Label</label>
        <input className={inputCls} value={block.label||""} onChange={e=>onChange({...block,label:e.target.value})} placeholder="e.g. The Quadratic Formula" />
      </div>
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Math Expression</label>
        <textarea className={inputCls+" resize-y font-serif text-xl leading-8"} rows={3} value={block.expression||""} onChange={e=>onChange({...block,expression:e.target.value})} placeholder="e.g. ∫₀¹ x² dx = 1/3" />
      </div>
      <button onClick={()=>setShowPalette(!showPalette)} className="text-[#006236] text-xs font-semibold text-left cursor-pointer bg-transparent border-none p-0">
        {showPalette?"▼":"▶"} Symbol Palette
      </button>
      {showPalette && (
        <div className="flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg border border-[#006236]/15">
          {MATH_SYMBOLS.map(s=>(
            <button key={s} onClick={()=>onChange({...block,expression:(block.expression||"")+s})}
              className="w-9 h-9 border border-[#006236]/20 rounded-md bg-white cursor-pointer text-base font-serif text-[#006236] hover:bg-[#006236] hover:text-white transition-colors flex items-center justify-center">
              {s.trim()}
            </button>
          ))}
        </div>
      )}
      {block.expression && (
        <div className="p-5 bg-white rounded-xl border-2 border-[#006236]/15 text-center">
          {block.label && <div className="text-[#006236] text-sm font-semibold mb-2">{block.label}</div>}
          <div className="font-serif text-3xl text-gray-900 tracking-wide">{block.expression}</div>
        </div>
      )}
    </div>
  );
}

/* ====== QUIZ ====== */
function QuizBlock({ block, onChange }) {
  const questions = block.questions || [];
  const addQ = () => onChange({...block, questions:[...questions,{id:Date.now(),text:"",type:"multiple-choice",options:[{id:1,text:"",isCorrect:false},{id:2,text:"",isCorrect:false},{id:3,text:"",isCorrect:false},{id:4,text:"",isCorrect:false}],explanation:""}]});
  const updateQ = (i,u) => { const q=[...questions]; q[i]=u; onChange({...block,questions:q}); };
  const removeQ = (i) => onChange({...block,questions:questions.filter((_,j)=>j!==i)});
  const toggleCorrect = (qi,oi) => { const q={...questions[qi]}; q.options=q.options.map((o,i)=>({...o,isCorrect:i===oi})); updateQ(qi,q); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[#006236] text-xs font-semibold mb-1 block">Quiz Title</label>
          <input className={inputCls} value={block.title||""} onChange={e=>onChange({...block,title:e.target.value})} placeholder="e.g. Unit 3 Quiz: Derivatives" />
        </div>
        <div className="w-20">
          <label className="text-[#006236] text-xs font-semibold mb-1 block">Time (min)</label>
          <input type="number" className={inputCls+" text-center"} value={block.timeLimit||""} onChange={e=>onChange({...block,timeLimit:e.target.value})} placeholder="15" />
        </div>
        <div className="w-20">
          <label className="text-[#006236] text-xs font-semibold mb-1 block">Pass %</label>
          <input type="number" className={inputCls+" text-center"} value={block.passPercentage||""} onChange={e=>onChange({...block,passPercentage:e.target.value})} placeholder="70" />
        </div>
      </div>

      {questions.map((q,qi)=>(
        <div key={q.id} className="p-4 bg-white rounded-xl border border-[#006236]/15 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#006236] font-bold text-sm">Question {qi+1}</span>
            <button onClick={()=>removeQ(qi)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md cursor-pointer border-none bg-transparent text-xs">✕</button>
          </div>
          <textarea className={inputCls+" resize-y"} rows={2} value={q.text} onChange={e=>updateQ(qi,{...q,text:e.target.value})} placeholder="Enter the question..." />
          <div className="flex flex-col gap-2">
            {q.options.map((o,oi)=>(
              <div key={o.id} className="flex items-center gap-3">
                <button onClick={()=>toggleCorrect(qi,oi)}
                  className={`w-7 h-7 rounded-full border-2 flex-shrink-0 cursor-pointer flex items-center justify-center transition-colors ${o.isCorrect?'bg-[#006236] border-[#006236] text-white':'bg-white border-gray-300'}`}>
                  {o.isCorrect && "✓"}
                </button>
                <input className={inputCls+" flex-1"} value={o.text}
                  onChange={e=>{const opts=[...q.options];opts[oi]={...o,text:e.target.value};updateQ(qi,{...q,options:opts});}}
                  placeholder={`Option ${String.fromCharCode(65+oi)}`} />
              </div>
            ))}
            <span className="text-[11px] text-gray-400 ml-10">Click circle to mark correct answer</span>
          </div>
          <div>
            <label className="text-[#006236] text-[11px] font-semibold mb-1 block">Explanation (shown after answer)</label>
            <input className={inputCls} value={q.explanation||""} onChange={e=>updateQ(qi,{...q,explanation:e.target.value})} placeholder="Why is this correct..." />
          </div>
        </div>
      ))}

      <button onClick={addQ} className="p-3 rounded-lg border-2 border-dashed border-[#006236]/30 bg-transparent text-[#006236] cursor-pointer text-sm font-semibold hover:bg-[#006236]/5 transition-colors">
        + Add Question
      </button>
    </div>
  );
}

/* ====== EXERCISE ====== */
function ExerciseBlock({ block, onChange }) {
  const problems = block.problems || [];
  const addP = () => onChange({...block,problems:[...problems,{id:Date.now(),prompt:"",answer:"",hint:"",type:"free-response"}]});
  const updateP = (i,u) => { const p=[...problems]; p[i]=u; onChange({...block,problems:p}); };
  const removeP = (i) => onChange({...block,problems:problems.filter((_,j)=>j!==i)});

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Exercise Title</label>
        <input className={inputCls} value={block.title||""} onChange={e=>onChange({...block,title:e.target.value})} placeholder="e.g. Practice: Solving Quadratic Equations" />
      </div>
      <div>
        <label className="text-[#006236] text-xs font-semibold mb-1 block">Instructions</label>
        <textarea className={inputCls+" resize-y"} rows={2} value={block.instructions||""} onChange={e=>onChange({...block,instructions:e.target.value})} placeholder="Instructions for the exercise..." />
      </div>
      {problems.map((p,i)=>(
        <div key={p.id} className="p-4 bg-white rounded-xl border border-[#006236]/15 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#006236] font-bold text-sm">Problem {i+1}</span>
            <div className="flex gap-1 items-center">
              <select value={p.type} onChange={e=>updateP(i,{...p,type:e.target.value})}
                className="px-2 py-1 rounded-md border border-[#006236]/20 text-xs text-[#006236] bg-white cursor-pointer">
                <option value="free-response">Free Response</option>
                <option value="numeric">Numeric</option>
                <option value="true-false">True/False</option>
              </select>
              <button onClick={()=>removeP(i)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md cursor-pointer border-none bg-transparent text-xs">✕</button>
            </div>
          </div>
          <textarea className={inputCls+" resize-y"} rows={2} value={p.prompt} onChange={e=>updateP(i,{...p,prompt:e.target.value})} placeholder="Problem statement..." />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#006236] text-[11px] font-semibold mb-1 block">Expected Answer</label>
              <input className={inputCls} value={p.answer} onChange={e=>updateP(i,{...p,answer:e.target.value})} placeholder="Correct answer" />
            </div>
            <div>
              <label className="text-[#006236] text-[11px] font-semibold mb-1 block">Hint (optional)</label>
              <input className={inputCls} value={p.hint} onChange={e=>updateP(i,{...p,hint:e.target.value})} placeholder="A helpful hint..." />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addP} className="p-3 rounded-lg border-2 border-dashed border-[#006236]/30 bg-transparent text-[#006236] cursor-pointer text-sm font-semibold hover:bg-[#006236]/5 transition-colors">
        + Add Problem
      </button>
    </div>
  );
}

/* ====== MAIN EXPORTED COMPONENT ====== */
export default function ContentBlockEditor({ block, onChange, onRemove, onMoveUp, onMoveDown, index, total }) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = BLOCK_TYPES[block.type] || BLOCK_TYPES.article;
  const c = colorMap[meta.color] || colorMap.green;

  const renderEditor = () => {
    switch (block.type) {
      case "video": return <VideoBlock block={block} onChange={onChange} />;
      case "article": return <ArticleBlock block={block} onChange={onChange} />;
      case "math": return <MathBlock block={block} onChange={onChange} />;
      case "quiz": return <QuizBlock block={block} onChange={onChange} />;
      case "exercise": return <ExerciseBlock block={block} onChange={onChange} />;
      default: return null;
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${c.border} bg-gray-50 overflow-hidden`}>
      <div className={`flex items-center justify-between px-4 py-3 ${c.bgLight} cursor-pointer ${!collapsed?'border-b '+c.border:''}`} onClick={()=>setCollapsed(!collapsed)}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${c.bg} text-white flex items-center justify-center text-sm font-bold shrink-0`}>{meta.icon}</div>
          <span className="text-gray-700 text-sm font-semibold">{meta.label}{block.title?` — ${block.title}`:""}</span>
        </div>
        <div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}>
          <button disabled={index===0} onClick={onMoveUp} className="p-1.5 rounded-md bg-black/5 text-gray-500 border-none cursor-pointer disabled:opacity-30 hover:bg-black/10">▲</button>
          <button disabled={index===total-1} onClick={onMoveDown} className="p-1.5 rounded-md bg-black/5 text-gray-500 border-none cursor-pointer disabled:opacity-30 hover:bg-black/10">▼</button>
          <button onClick={onRemove} className="p-1.5 rounded-md bg-black/5 text-red-500 border-none cursor-pointer hover:bg-red-50">✕</button>
        </div>
      </div>
      {!collapsed && <div className="p-4">{renderEditor()}</div>}
    </div>
  );
}

export { BLOCK_TYPES };
