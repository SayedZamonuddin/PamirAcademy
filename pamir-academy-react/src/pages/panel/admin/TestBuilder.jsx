import { useState, useRef } from "react";
import DashboardLayout from "./DashboardLayout";

/* ---- Math & Science Symbol Palettes ---- */
const MATH_SYMBOLS = [
  "∑","∫","√","∞","π","θ","Δ","α","β","γ","λ","μ","σ","φ","ω",
  "≤","≥","≠","±","÷","×","²","³","ⁿ","⁰","¹","⁴","⁵",
  "∂","∈","∉","⊂","⊃","∪","∩","∅","ℝ","ℤ","ℕ","ℚ",
  "ƒ","→","⇒","⇔","∀","∃","¬","∧","∨",
  "lim ","log ","ln ","sin ","cos ","tan ",
  "≈","∝","°","′","″","‰",
  "⟨","⟩","⌊","⌋","⌈","⌉",
  "⊕","⊗","⊥","∥","∠","△","□","∘",
];

const SYMBOL_CATEGORIES = [
  { label: "Greek", symbols: ["α","β","γ","δ","ε","ζ","η","θ","λ","μ","ν","π","ρ","σ","τ","φ","χ","ψ","ω","Δ","Σ","Ω","Φ","Γ","Λ"] },
  { label: "Operators", symbols: ["±","×","÷","·","∘","⊕","⊗","√","∛","∑","∏","∫","∂","∇"] },
  { label: "Relations", symbols: ["≠","≈","≡","≤","≥","≪","≫","∝","∈","∉","⊂","⊃","⊆","⊇","∪","∩","∅"] },
  { label: "Arrows", symbols: ["→","←","↔","⇒","⇐","⇔","↑","↓","↗","↘","⟶","⟵"] },
  { label: "Logic", symbols: ["∀","∃","∄","¬","∧","∨","⊤","⊥","⊢","⊨"] },
  { label: "Sets & Numbers", symbols: ["ℕ","ℤ","ℚ","ℝ","ℂ","∞","ℵ","∅"] },
  { label: "Superscripts", symbols: ["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹","ⁿ","ⁱ","⁺","⁻"] },
  { label: "Subscripts", symbols: ["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉","ₙ","ᵢ","ₓ"] },
  { label: "Geometry", symbols: ["∠","△","□","○","⊥","∥","≅","∼","°","′","″"] },
  { label: "Functions", symbols: ["lim ","log ","ln ","sin ","cos ","tan ","sec ","csc ","cot ","exp ","max ","min "] },
];

const QUESTION_TYPES = [
  { value: "radio", label: "Single Choice", icon: "◉" },
  { value: "checkbox", label: "Multiple Choice", icon: "☑" },
  { value: "select", label: "Dropdown", icon: "▾" },
  { value: "text", label: "Short Answer", icon: "✎" },
  { value: "math", label: "Math Answer", icon: "ƒx" },
  { value: "truefalse", label: "True / False", icon: "T/F" },
  { value: "matching", label: "Matching", icon: "⇄" },
  { value: "ordering", label: "Ordering", icon: "↕" },
];

const LEVELS = ["beginner", "intermediate", "advanced"];

const DEFAULT_SUBJECTS = ["English", "Physics", "Mathematics", "Programming", "Chemistry", "Biology"];

/* ---- Utility: unique ID ---- */
let _id = 0;
const uid = () => `q_${Date.now()}_${++_id}`;

/* ---- Default new question ---- */
const newQuestion = () => ({
  id: uid(),
  type: "radio",
  instruction: "",
  question: "",
  options: ["", ""],
  correctAnswer: "",
  correctAnswers: [],
  matchPairs: [{ left: "", right: "" }],
  orderItems: [""],
  points: 1,
  imageUrl: "",
  explanation: "",
  hasGraph: false,
  graphData: { points: [], xLabel: "x", yLabel: "y", xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
});

/* ============================================================
   SVG Icons
   ============================================================ */
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const CopyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const ChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 15 12 9 18 15"/></svg>;
const MoveUpIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;
const MoveDownIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SaveIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const ImageIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const GraphIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="21" x2="3" y2="3"/><line x1="3" y1="21" x2="21" y2="21"/><polyline points="7 16 11 10 15 14 19 6"/></svg>;

/* ============================================================
   Math Symbol Picker component
   ============================================================ */
function MathPalette({ onInsert, show, onToggle }) {
  const [activeCategory, setActiveCategory] = useState(0);
  if (!show) return (
    <button onClick={onToggle} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 cursor-pointer text-xs hover:bg-blue-100 transition-colors" title="Math symbols">
      <span className="text-sm font-bold">ƒx</span> Symbols
    </button>
  );

  return (
    <div className="bg-white border-2 border-[#006236]/20 rounded-xl shadow-lg p-3 w-full max-w-[520px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#006236] font-semibold text-sm">Math & Science Symbols</span>
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none text-lg leading-none">×</button>
      </div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-2">
        {SYMBOL_CATEGORIES.map((cat, i) => (
          <button key={cat.label} onClick={() => setActiveCategory(i)}
            className={`px-2 py-0.5 rounded text-xs cursor-pointer border-none transition-colors ${i === activeCategory ? "bg-[#006236] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat.label}
          </button>
        ))}
      </div>
      {/* Symbols grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(36px,1fr))] gap-1">
        {SYMBOL_CATEGORIES[activeCategory].symbols.map((s, i) => (
          <button key={i} onClick={() => onInsert(s)}
            className="h-9 flex items-center justify-center rounded border border-gray-200 bg-gray-50 hover:bg-[#006236]/10 hover:border-[#006236]/30 cursor-pointer text-base transition-colors text-gray-800">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Simple Graph Builder (SVG coordinate plane with plottable points)
   ============================================================ */
function GraphBuilder({ graphData, onChange }) {
  const { points = [], xLabel = "x", yLabel = "y", xMin = -10, xMax = 10, yMin = -10, yMax = 10 } = graphData;
  const svgW = 320, svgH = 260, pad = 35;
  const plotW = svgW - 2 * pad, plotH = svgH - 2 * pad;
  const toSvgX = (x) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y) => pad + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const handleSvgClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const x = +((xMin + ((sx - pad) / plotW) * (xMax - xMin)).toFixed(1));
    const y = +((yMin + ((plotH - (sy - pad)) / plotH) * (yMax - yMin)).toFixed(1));
    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      onChange({ ...graphData, points: [...points, { x, y }] });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {[["xLabel","X Label"],["yLabel","Y Label"]].map(([k,l])=>(
          <div key={k} className="flex items-center gap-1">
            <label className="text-xs text-gray-500">{l}:</label>
            <input className="w-16 px-1.5 py-0.5 text-xs border border-gray-300 rounded outline-none" value={graphData[k]||""} onChange={e=>onChange({...graphData,[k]:e.target.value})}/>
          </div>
        ))}
        {[["xMin","X Min"],["xMax","X Max"],["yMin","Y Min"],["yMax","Y Max"]].map(([k,l])=>(
          <div key={k} className="flex items-center gap-1">
            <label className="text-xs text-gray-500">{l}:</label>
            <input type="number" className="w-14 px-1.5 py-0.5 text-xs border border-gray-300 rounded outline-none" value={graphData[k]} onChange={e=>onChange({...graphData,[k]:+e.target.value})}/>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg inline-block">
        <svg width={svgW} height={svgH} onClick={handleSvgClick} className="cursor-crosshair">
          {/* Grid lines */}
          {Array.from({ length: 11 }, (_, i) => {
            const val = xMin + (i / 10) * (xMax - xMin);
            const sx = toSvgX(val);
            return <line key={`vg${i}`} x1={sx} y1={pad} x2={sx} y2={pad + plotH} stroke="#e5e7eb" strokeWidth="1"/>;
          })}
          {Array.from({ length: 11 }, (_, i) => {
            const val = yMin + (i / 10) * (yMax - yMin);
            const sy = toSvgY(val);
            return <line key={`hg${i}`} x1={pad} y1={sy} x2={pad + plotW} y2={sy} stroke="#e5e7eb" strokeWidth="1"/>;
          })}
          {/* Axes */}
          {xMin <= 0 && xMax >= 0 && <line x1={toSvgX(0)} y1={pad} x2={toSvgX(0)} y2={pad+plotH} stroke="#9ca3af" strokeWidth="1.5"/>}
          {yMin <= 0 && yMax >= 0 && <line x1={pad} y1={toSvgY(0)} x2={pad+plotW} y2={toSvgY(0)} stroke="#9ca3af" strokeWidth="1.5"/>}
          {/* Border */}
          <rect x={pad} y={pad} width={plotW} height={plotH} fill="none" stroke="#d1d5db" strokeWidth="1.5" rx="2"/>
          {/* Axis labels */}
          <text x={pad + plotW / 2} y={svgH - 5} textAnchor="middle" fill="#006236" fontSize="12" fontWeight="600">{xLabel}</text>
          <text x="10" y={pad + plotH / 2} textAnchor="middle" fill="#006236" fontSize="12" fontWeight="600" transform={`rotate(-90, 10, ${pad + plotH/2})`}>{yLabel}</text>
          {/* Tick labels */}
          <text x={pad} y={svgH - 18} textAnchor="middle" fill="#6b7280" fontSize="9">{xMin}</text>
          <text x={pad + plotW} y={svgH - 18} textAnchor="middle" fill="#6b7280" fontSize="9">{xMax}</text>
          <text x={pad - 8} y={pad + plotH + 3} textAnchor="end" fill="#6b7280" fontSize="9">{yMin}</text>
          <text x={pad - 8} y={pad + 4} textAnchor="end" fill="#6b7280" fontSize="9">{yMax}</text>
          {/* Points & connecting lines */}
          {points.length > 1 && points.map((p, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            return <line key={`ln${i}`} x1={toSvgX(prev.x)} y1={toSvgY(prev.y)} x2={toSvgX(p.x)} y2={toSvgY(p.y)} stroke="#006236" strokeWidth="2" strokeLinecap="round"/>;
          })}
          {points.map((p, i) => (
            <g key={`pt${i}`}>
              <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="5" fill="#006236" stroke="#fff" strokeWidth="2"/>
              <text x={toSvgX(p.x)} y={toSvgY(p.y) - 10} textAnchor="middle" fill="#006236" fontSize="9" fontWeight="600">({p.x},{p.y})</text>
            </g>
          ))}
          {points.length === 0 && <text x={svgW/2} y={svgH/2} textAnchor="middle" fill="#9ca3af" fontSize="12">Click to plot points</text>}
        </svg>
      </div>
      {points.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{points.length} point(s)</span>
          <button onClick={() => onChange({ ...graphData, points: points.slice(0, -1) })} className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded cursor-pointer border border-red-200 hover:bg-red-100">Undo last</button>
          <button onClick={() => onChange({ ...graphData, points: [] })} className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded cursor-pointer border border-red-200 hover:bg-red-100">Clear all</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Question Editor Card
   ============================================================ */
function QuestionEditor({ question, index, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast, total }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [activeField, setActiveField] = useState("instruction");
  const instructionRef = useRef(null);
  const questionRef = useRef(null);

  const q = question;
  const update = (patch) => onChange({ ...q, ...patch });

  const insertSymbol = (sym) => {
    const ref = activeField === "instruction" ? instructionRef : questionRef;
    const el = ref.current;
    if (!el) {
      update({ [activeField]: (q[activeField] || "") + sym });
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const val = q[activeField] || "";
    const newVal = val.slice(0, start) + sym + val.slice(end);
    update({ [activeField]: newVal });
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + sym.length; el.focus(); }, 0);
  };

  const typeInfo = QUESTION_TYPES.find(t => t.value === q.type) || QUESTION_TYPES[0];

  return (
    <div className="bg-white rounded-2xl border-2 border-[#006236]/15 overflow-hidden transition-shadow hover:shadow-md">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#006236]/5 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <span className="w-8 h-8 rounded-lg bg-[#006236] text-white flex items-center justify-center text-sm font-bold shrink-0">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 truncate m-0">{q.instruction || "New question..."}</p>
          <span className="text-xs text-gray-400">{typeInfo.icon} {typeInfo.label} · {q.points} pt{q.points !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!isFirst && <button onClick={e=>{e.stopPropagation();onMoveUp();}} className="p-1 rounded hover:bg-[#006236]/10 text-[#006236] bg-transparent border-none cursor-pointer"><MoveUpIcon/></button>}
          {!isLast && <button onClick={e=>{e.stopPropagation();onMoveDown();}} className="p-1 rounded hover:bg-[#006236]/10 text-[#006236] bg-transparent border-none cursor-pointer"><MoveDownIcon/></button>}
          <button onClick={e=>{e.stopPropagation();onDuplicate();}} className="p-1 rounded hover:bg-blue-100 text-blue-500 bg-transparent border-none cursor-pointer" title="Duplicate"><CopyIcon/></button>
          <button onClick={e=>{e.stopPropagation();onDelete();}} className="p-1 rounded hover:bg-red-100 text-red-500 bg-transparent border-none cursor-pointer" title="Delete"><TrashIcon/></button>
          <span className="text-[#006236] ml-1">{collapsed ? <ChevronDown/> : <ChevronUp/>}</span>
        </div>
      </div>

      {collapsed ? null : (
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Row: Type + Points */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="text-[#006236] text-xs font-semibold mb-1 block">Question Type</label>
              <select value={q.type} onChange={e => update({ type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 cursor-pointer">
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div className="w-24">
              <label className="text-[#006236] text-xs font-semibold mb-1 block">Points</label>
              <input type="number" min="1" max="100" value={q.points} onChange={e => update({ points: Math.max(1, +e.target.value) })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 text-center"/>
            </div>
          </div>

          {/* Context / passage */}
          <div>
            <label className="text-[#006236] text-xs font-semibold mb-1 block">Context / Reading Passage <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea ref={questionRef} value={q.question || ""} onChange={e => update({ question: e.target.value })}
              onFocus={() => setActiveField("question")}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 resize-y min-h-[60px] transition-colors"
              rows={2} placeholder="Optional context, passage, or problem description..."/>
          </div>

          {/* Instruction / question text */}
          <div>
            <label className="text-[#006236] text-xs font-semibold mb-1 block">Question / Instruction <span className="text-red-500">*</span></label>
            <textarea ref={instructionRef} value={q.instruction} onChange={e => update({ instruction: e.target.value })}
              onFocus={() => setActiveField("instruction")}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 resize-y min-h-[60px] transition-colors"
              rows={2} placeholder="e.g. What is the derivative of x²?"/>
          </div>

          {/* Math palette */}
          <MathPalette show={showSymbols} onToggle={() => setShowSymbols(!showSymbols)} onInsert={insertSymbol}/>

          {/* Image attachment */}
          <div>
            <label className="text-[#006236] text-xs font-semibold mb-1 flex items-center gap-1"><ImageIcon/> Image / Diagram URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={q.imageUrl || ""} onChange={e => update({ imageUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 transition-colors"
              placeholder="https://example.com/diagram.png"/>
            {q.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-w-[400px]">
                <img src={q.imageUrl} alt="Question diagram" className="w-full h-auto max-h-[250px] object-contain bg-gray-50"
                  onError={e => { e.currentTarget.style.display = "none"; }}/>
              </div>
            )}
          </div>

          {/* Graph toggle */}
          <div className="flex items-center gap-2">
            <button onClick={() => update({ hasGraph: !q.hasGraph })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer border transition-colors ${
                q.hasGraph ? "bg-[#006236] text-white border-[#006236]" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              <GraphIcon/> {q.hasGraph ? "Graph Attached" : "Add Graph"}
            </button>
          </div>
          {q.hasGraph && <GraphBuilder graphData={q.graphData} onChange={gd => update({ graphData: gd })}/>}

          {/* ---- Answer options by type ---- */}
          {(q.type === "radio" || q.type === "checkbox" || q.type === "select") && (
            <div>
              <label className="text-[#006236] text-xs font-semibold mb-2 block">Answer Options</label>
              <div className="flex flex-col gap-2">
                {(q.options || []).map((opt, oi) => {
                  const isCorrect = q.type === "checkbox"
                    ? (q.correctAnswers || []).includes(opt)
                    : q.correctAnswer === opt;
                  return (
                    <div key={oi} className="flex items-center gap-2">
                      {/* Correct answer toggle */}
                      <button onClick={() => {
                        if (q.type === "checkbox") {
                          const ca = q.correctAnswers || [];
                          update({ correctAnswers: isCorrect ? ca.filter(a => a !== opt) : [...ca, opt] });
                        } else {
                          update({ correctAnswer: opt });
                        }
                      }}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                          isCorrect ? "bg-[#006236] border-[#006236] text-white" : "bg-white border-gray-300 text-transparent hover:border-[#006236]/50"
                        }`}
                        title={isCorrect ? "Correct answer" : "Mark as correct"}>
                        {q.type === "checkbox" ? "✓" : "●"}
                      </button>
                      <input value={opt} onChange={e => {
                        const newOpts = [...q.options];
                        const oldVal = newOpts[oi];
                        newOpts[oi] = e.target.value;
                        // Update correct answer references
                        if (q.type === "checkbox") {
                          const ca = (q.correctAnswers || []).map(a => a === oldVal ? e.target.value : a);
                          update({ options: newOpts, correctAnswers: ca });
                        } else {
                          update({ options: newOpts, correctAnswer: q.correctAnswer === oldVal ? e.target.value : q.correctAnswer });
                        }
                      }}
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 text-sm outline-none focus:border-[#006236]/50 transition-colors"
                        placeholder={`Option ${oi + 1}`}/>
                      {q.options.length > 2 && (
                        <button onClick={() => {
                          const newOpts = q.options.filter((_, i) => i !== oi);
                          const patch = { options: newOpts };
                          if (q.type === "checkbox") patch.correctAnswers = (q.correctAnswers || []).filter(a => a !== opt);
                          else if (q.correctAnswer === opt) patch.correctAnswer = "";
                          update(patch);
                        }}
                          className="p-1 text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"><TrashIcon/></button>
                      )}
                    </div>
                  );
                })}
                <button onClick={() => update({ options: [...q.options, ""] })}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-dashed border-[#006236]/20 text-[#006236] text-sm cursor-pointer bg-transparent hover:bg-[#006236]/5 transition-colors self-start">
                  <PlusIcon/> Add option
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Click the circle to mark the correct answer{q.type === "checkbox" ? "(s)" : ""}.</p>
            </div>
          )}

          {q.type === "truefalse" && (
            <div>
              <label className="text-[#006236] text-xs font-semibold mb-2 block">Correct Answer</label>
              <div className="flex gap-3">
                {["True", "False"].map(val => (
                  <button key={val} onClick={() => update({ correctAnswer: val })}
                    className={`flex-1 py-3 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-colors ${
                      q.correctAnswer === val ? "bg-[#006236] text-white border-[#006236]" : "bg-white text-gray-600 border-gray-200 hover:border-[#006236]/40"
                    }`}>{val}</button>
                ))}
              </div>
            </div>
          )}

          {(q.type === "text" || q.type === "math") && (
            <div>
              <label className="text-[#006236] text-xs font-semibold mb-1 block">Correct Answer</label>
              <input value={q.correctAnswer || ""} onChange={e => update({ correctAnswer: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 transition-colors"
                placeholder={q.type === "math" ? "e.g. 2x + 5" : "Expected answer..."}/>
              {q.type === "math" && <p className="text-xs text-gray-400 mt-1">Use the symbol palette above to insert math notation.</p>}
            </div>
          )}

          {q.type === "matching" && (
            <div>
              <label className="text-[#006236] text-xs font-semibold mb-2 block">Match Pairs</label>
              <div className="flex flex-col gap-2">
                {(q.matchPairs || []).map((pair, pi) => (
                  <div key={pi} className="flex items-center gap-2">
                    <input value={pair.left} onChange={e => {
                      const np = [...q.matchPairs]; np[pi] = { ...np[pi], left: e.target.value }; update({ matchPairs: np });
                    }} className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 text-sm outline-none focus:border-[#006236]/50" placeholder="Term"/>
                    <span className="text-[#006236] font-bold">⇄</span>
                    <input value={pair.right} onChange={e => {
                      const np = [...q.matchPairs]; np[pi] = { ...np[pi], right: e.target.value }; update({ matchPairs: np });
                    }} className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 text-sm outline-none focus:border-[#006236]/50" placeholder="Definition"/>
                    {q.matchPairs.length > 1 && (
                      <button onClick={() => update({ matchPairs: q.matchPairs.filter((_, i) => i !== pi) })}
                        className="p-1 text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"><TrashIcon/></button>
                    )}
                  </div>
                ))}
                <button onClick={() => update({ matchPairs: [...(q.matchPairs || []), { left: "", right: "" }] })}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-dashed border-[#006236]/20 text-[#006236] text-sm cursor-pointer bg-transparent hover:bg-[#006236]/5 self-start">
                  <PlusIcon/> Add pair
                </button>
              </div>
            </div>
          )}

          {q.type === "ordering" && (
            <div>
              <label className="text-[#006236] text-xs font-semibold mb-2 block">Items (in correct order)</label>
              <div className="flex flex-col gap-2">
                {(q.orderItems || [""]).map((item, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#006236]/10 text-[#006236] flex items-center justify-center text-xs font-bold shrink-0">{oi + 1}</span>
                    <input value={item} onChange={e => {
                      const ni = [...q.orderItems]; ni[oi] = e.target.value; update({ orderItems: ni });
                    }} className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 text-sm outline-none focus:border-[#006236]/50" placeholder={`Item ${oi + 1}`}/>
                    {q.orderItems.length > 1 && (
                      <button onClick={() => update({ orderItems: q.orderItems.filter((_, i) => i !== oi) })}
                        className="p-1 text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"><TrashIcon/></button>
                    )}
                  </div>
                ))}
                <button onClick={() => update({ orderItems: [...(q.orderItems || []), ""] })}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-dashed border-[#006236]/20 text-[#006236] text-sm cursor-pointer bg-transparent hover:bg-[#006236]/5 self-start">
                  <PlusIcon/> Add item
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter items in the correct order. They will be shuffled for students.</p>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="text-[#006236] text-xs font-semibold mb-1 block">Explanation <span className="text-gray-400 font-normal">(shown after submission)</span></label>
            <textarea value={q.explanation || ""} onChange={e => update({ explanation: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#006236]/20 text-sm outline-none bg-white focus:border-[#006236]/50 resize-y min-h-[50px] transition-colors"
              rows={2} placeholder="Explain the correct answer..."/>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Question Preview Card
   ============================================================ */
function QuestionPreview({ question, index }) {
  const q = question;
  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-[10px] border border-gray-200">
      {q.question && (
        <div className="mb-4 p-3 sm:p-4 bg-[#006236]/10 rounded-[5px] text-sm sm:text-base text-gray-800 whitespace-pre-wrap">{q.question}</div>
      )}
      <p className="text-[#006236] font-bold mb-1 text-sm sm:text-base">
        <span>{index + 1}.</span> {q.instruction || "—"}
      </p>
      <p className="text-xs text-gray-400 mb-3">{q.points} point{q.points !== 1 ? "s" : ""}</p>

      {q.imageUrl && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 max-w-[400px]">
          <img src={q.imageUrl} alt="" className="w-full h-auto max-h-[200px] object-contain bg-gray-50"/>
        </div>
      )}

      {q.hasGraph && q.graphData?.points?.length > 0 && (
        <div className="mb-3 inline-block bg-gray-50 rounded-lg p-2 border border-gray-200">
          <svg width="200" height="160" viewBox="0 0 200 160">
            <rect x="25" y="10" width="165" height="130" fill="none" stroke="#d1d5db" strokeWidth="1" rx="2"/>
            {q.graphData.points.map((p, i) => {
              const gd = q.graphData;
              const sx = 25 + ((p.x - gd.xMin) / (gd.xMax - gd.xMin)) * 165;
              const sy = 10 + 130 - ((p.y - gd.yMin) / (gd.yMax - gd.yMin)) * 130;
              return <circle key={i} cx={sx} cy={sy} r="3" fill="#006236"/>;
            })}
            {q.graphData.points.length > 1 && q.graphData.points.map((p, i) => {
              if (i === 0) return null;
              const prev = q.graphData.points[i - 1];
              const gd = q.graphData;
              const x1 = 25 + ((prev.x - gd.xMin) / (gd.xMax - gd.xMin)) * 165;
              const y1 = 10 + 130 - ((prev.y - gd.yMin) / (gd.yMax - gd.yMin)) * 130;
              const x2 = 25 + ((p.x - gd.xMin) / (gd.xMax - gd.xMin)) * 165;
              const y2 = 10 + 130 - ((p.y - gd.yMin) / (gd.yMax - gd.yMin)) * 130;
              return <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#006236" strokeWidth="1.5"/>;
            })}
          </svg>
        </div>
      )}

      {(q.type === "radio" || q.type === "select") && (
        <div className="flex flex-col gap-2">
          {(q.options || []).map((opt, oi) => (
            <div key={oi} className="w-full p-3 text-left rounded-[5px] border-2 border-[#006236] bg-white text-sm">{opt || `Option ${oi+1}`}</div>
          ))}
        </div>
      )}
      {q.type === "checkbox" && (
        <div className="flex flex-col gap-2">
          {(q.options || []).map((opt, oi) => (
            <div key={oi} className="w-full p-3 text-left rounded-[5px] border-2 border-[#006236] bg-white text-sm flex items-center gap-2">
              <input type="checkbox" disabled className="accent-[#006236]"/>{opt || `Option ${oi+1}`}
            </div>
          ))}
        </div>
      )}
      {q.type === "truefalse" && (
        <div className="flex gap-3">
          {["True","False"].map(v => <div key={v} className="flex-1 p-3 rounded-[5px] border-2 border-[#006236] text-sm text-center bg-white">{v}</div>)}
        </div>
      )}
      {(q.type === "text" || q.type === "math") && (
        <input disabled placeholder="Student enters answer here..." className="w-full p-3 rounded-[5px] border-2 border-[#006236] text-sm bg-gray-50"/>
      )}
      {q.type === "matching" && (
        <div className="grid grid-cols-2 gap-2">
          {(q.matchPairs || []).map((p, i) => (
            <div key={i} className="contents">
              <div className="p-2.5 rounded-[5px] border-2 border-[#006236] text-sm bg-white">{p.left || "—"}</div>
              <div className="p-2.5 rounded-[5px] border-2 border-orange-400 text-sm bg-orange-50">{p.right || "—"}</div>
            </div>
          ))}
        </div>
      )}
      {q.type === "ordering" && (
        <div className="flex flex-col gap-2">
          {(q.orderItems || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-[5px] border-2 border-[#006236] bg-white text-sm">
              <span className="w-5 h-5 rounded bg-[#006236]/10 text-[#006236] flex items-center justify-center text-xs font-bold">?</span>{item || "—"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT: TestBuilder
   ============================================================ */
export default function TestBuilder() {
  const [subjects] = useState(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [customSubject, setCustomSubject] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [mode, setMode] = useState("edit"); // "edit" | "preview"
  const [saved, setSaved] = useState(false);

  // Questions keyed by subject+level
  const [allQuestions, setAllQuestions] = useState({});
  const qKey = `${selectedSubject}__${activeLevel}`;
  const questions = allQuestions[qKey] || [];

  const setQuestions = (qs) => setAllQuestions({ ...allQuestions, [qKey]: typeof qs === "function" ? qs(questions) : qs });

  const addQuestion = () => setQuestions([...questions, newQuestion()]);
  const updateQuestion = (idx, q) => setQuestions(questions.map((qq, i) => i === idx ? q : qq));
  const deleteQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx));
  const duplicateQuestion = (idx) => {
    const clone = { ...questions[idx], id: uid() };
    const qs = [...questions]; qs.splice(idx + 1, 0, clone); setQuestions(qs);
  };
  const moveQuestion = (from, to) => {
    if (to < 0 || to >= questions.length) return;
    const qs = [...questions]; const [item] = qs.splice(from, 1); qs.splice(to, 0, item); setQuestions(qs);
  };

  const totalPoints = questions.reduce((s, q) => s + (q.points || 1), 0);

  const handleSave = () => {
    localStorage.setItem("adminTests", JSON.stringify(allQuestions));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePublish = () => {
    localStorage.setItem("adminTests", JSON.stringify(allQuestions));
    // Also save to sampleQuestions format for the Exam component
    const published = {};
    Object.entries(allQuestions).forEach(([key, qs]) => {
      const [subj, lvl] = key.split("__");
      if (!published[subj]) published[subj] = {};
      published[subj][lvl] = qs.map(q => ({
        id: q.id,
        question: q.question || "",
        instruction: q.instruction,
        type: q.type === "truefalse" ? "radio" : q.type === "math" ? "text" : q.type,
        options: q.type === "truefalse" ? ["True", "False"] : q.options,
        correctAnswer: q.correctAnswer,
        correctAnswers: q.correctAnswers,
        matchPairs: q.matchPairs,
        orderItems: q.orderItems,
        imageUrl: q.imageUrl,
        graphData: q.hasGraph ? q.graphData : undefined,
        explanation: q.explanation,
      }));
    });
    localStorage.setItem("publishedTests", JSON.stringify(published));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const subjectList = [...subjects, ...(allQuestions ? Object.keys(allQuestions).map(k => k.split("__")[0]).filter(s => !subjects.includes(s)) : [])].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <DashboardLayout activePage="tests">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top toolbar */}
        <div className="px-4 sm:px-6 py-4 bg-[#006236]/5 border-b border-[#006236]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[#006236] text-xl sm:text-2xl font-bold m-0 flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Test Builder
            </h1>
            <div className="flex items-center gap-2">
              {/* Mode toggle */}
              <button onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm cursor-pointer border-none transition-colors ${
                  mode === "preview" ? "bg-amber-500 text-white" : "bg-white text-[#006236] border border-[#006236]/20"
                }`}>
                {mode === "preview" ? <><EditIcon/> Edit</> : <><EyeIcon/> Preview</>}
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm cursor-pointer bg-white text-[#006236] border border-[#006236]/30 hover:bg-[#006236]/5 transition-colors">
                <SaveIcon/> Save Draft
              </button>
              <button onClick={handlePublish}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm cursor-pointer bg-[#006236] text-white border-none hover:bg-[#004d2a] transition-colors font-semibold">
                Publish Test
              </button>
              {saved && <span className="text-[#006236] text-sm font-semibold animate-pulse">✓ Saved!</span>}
            </div>
          </div>

          {/* Subject selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-[#006236] text-sm font-semibold">Subject:</label>
            <div className="flex flex-wrap gap-1.5">
              {subjectList.map(s => (
                <button key={s} onClick={() => setSelectedSubject(s)}
                  className={`px-3.5 py-1.5 rounded-full text-sm cursor-pointer border-none transition-colors ${
                    selectedSubject === s ? "bg-[#006236] text-white" : "bg-white text-[#006236] hover:bg-[#006236]/10"
                  }`}>{s}</button>
              ))}
              {addingSubject ? (
                <div className="flex items-center gap-1">
                  <input value={customSubject} onChange={e => setCustomSubject(e.target.value)} autoFocus
                    className="px-2.5 py-1 rounded-full border border-[#006236]/30 text-sm outline-none w-28"
                    placeholder="Subject name" onKeyDown={e => { if (e.key === "Enter" && customSubject.trim()) { setSelectedSubject(customSubject.trim()); setCustomSubject(""); setAddingSubject(false); }}}/>
                  <button onClick={() => { if (customSubject.trim()) { setSelectedSubject(customSubject.trim()); setCustomSubject(""); setAddingSubject(false); }}}
                    className="px-2 py-1 rounded-full bg-[#006236] text-white text-xs cursor-pointer border-none">Add</button>
                  <button onClick={() => { setCustomSubject(""); setAddingSubject(false); }}
                    className="px-2 py-1 rounded-full bg-gray-200 text-gray-600 text-xs cursor-pointer border-none">✕</button>
                </div>
              ) : (
                <button onClick={() => setAddingSubject(true)}
                  className="px-3 py-1.5 rounded-full text-sm cursor-pointer border-2 border-dashed border-[#006236]/30 text-[#006236] bg-transparent hover:bg-[#006236]/5 flex items-center gap-1">
                  <PlusIcon/> Add
                </button>
              )}
            </div>
          </div>

          {/* Level tabs */}
          <div className="flex items-center gap-1">
            {LEVELS.map(lvl => (
              <button key={lvl} onClick={() => setActiveLevel(lvl)}
                className={`px-5 py-2 rounded-t-xl text-sm cursor-pointer border-none font-semibold capitalize transition-colors ${
                  activeLevel === lvl ? "bg-white text-[#006236] shadow-sm" : "bg-[#006236]/10 text-[#006236]/60 hover:bg-[#006236]/15"
                }`}>{lvl}</button>
            ))}
            <div className="ml-auto flex items-center gap-3 text-sm text-gray-500">
              <span>{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
              <span>·</span>
              <span>{totalPoints} point{totalPoints !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-[900px] mx-auto flex flex-col gap-4">
            {mode === "preview" ? (
              /* PREVIEW MODE */
              <>
                <div className="bg-[#006236] text-white rounded-2xl px-6 py-4 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold m-0">{selectedSubject}</h2>
                  <p className="text-white/70 text-sm mt-1 capitalize">{activeLevel} Level · {questions.length} Questions · {totalPoints} Points</p>
                </div>
                {questions.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <p className="text-lg">No questions yet</p>
                    <p className="text-sm">Switch to Edit mode to add questions.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {questions.map((q, i) => <QuestionPreview key={q.id} question={q} index={i}/>)}
                  </div>
                )}
              </>
            ) : (
              /* EDIT MODE */
              <>
                {questions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-[#006236] text-xl font-bold mb-2">No questions yet</h3>
                    <p className="text-gray-400 text-sm mb-6">Start building your <span className="capitalize font-semibold">{activeLevel}</span> level test for <strong>{selectedSubject}</strong></p>
                    <button onClick={addQuestion}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#006236] text-white text-sm font-semibold cursor-pointer border-none mx-auto hover:bg-[#004d2a] transition-colors">
                      <PlusIcon/> Add First Question
                    </button>
                  </div>
                ) : (
                  <>
                    {questions.map((q, i) => (
                      <QuestionEditor key={q.id} question={q} index={i} total={questions.length}
                        onChange={q => updateQuestion(i, q)}
                        onDelete={() => deleteQuestion(i)}
                        onDuplicate={() => duplicateQuestion(i)}
                        onMoveUp={() => moveQuestion(i, i - 1)}
                        onMoveDown={() => moveQuestion(i, i + 1)}
                        isFirst={i === 0} isLast={i === questions.length - 1}/>
                    ))}
                    <button onClick={addQuestion}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-[#006236]/25 text-[#006236] cursor-pointer bg-transparent hover:bg-[#006236]/5 transition-colors self-center text-sm font-semibold">
                      <PlusIcon/> Add Question
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
