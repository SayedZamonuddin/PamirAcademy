import { useState, useEffect } from "react";
import TeacherLayout from "./TeacherLayout";
import { getTeacherPayments } from "../../../utils/panelApi";

/* ---- SVG Icons ---- */
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const FilterIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const ChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>;
const DollarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const TrendUpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const MONTHS = ["All Time"];

export default function TeacherPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("All Time");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTeacherPayments();
        setPayments(data.map(p => ({
          id: `PAY-${p.id}`,
          date: p.date,
          student: p.student_name,
          subject: p.subject_name,
          level: p.level,
          sessions: p.sessions,
          rate: parseFloat(p.rate),
          amount: parseFloat(p.amount),
          status: p.status,
          method: p.method,
        })));
      } catch (err) { console.error("Payments fetch error:", err); }
      finally { setLoading(false); }
    })();
  }, []);

  const perPage = 6;
  const filtered = payments;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalEarned = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalSessions = payments.reduce((s, p) => s + p.sessions, 0);
  const avgRate = payments.length > 0 ? Math.round(payments.reduce((s, p) => s + p.rate, 0) / payments.length) : 0;

  // Derive monthly earnings from payment data
  const monthlyMap = {};
  payments.filter(p => p.status === "paid").forEach(p => {
    const d = new Date(p.date);
    const key = d.toLocaleDateString("en-US", { month: "short" });
    monthlyMap[key] = (monthlyMap[key] || 0) + p.amount;
  });
  const MONTHLY_EARNINGS = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }));
  const maxEarning = Math.max(1, ...MONTHLY_EARNINGS.map(m => m.amount));

  if (loading) {
    return (
      <TeacherLayout activePage="t-payments">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#006236] border-t-transparent rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout activePage="t-payments">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-gray-800 text-[clamp(24px,3vw,40px)] font-bold m-0">Payment History</h1>
            <p className="text-gray-500 text-sm m-0 mt-1">Track your earnings and payment records</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#006236] text-white text-sm font-semibold border-none cursor-pointer hover:bg-[#004d2a] transition-colors">
            <DownloadIcon/> Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Earned", value: `$${totalEarned.toLocaleString()}`, icon: <DollarIcon/>, color: "bg-[#006236]" },
            { label: "Pending", value: `$${totalPending.toLocaleString()}`, icon: <ClockIcon/>, color: "bg-amber-500" },
            { label: "Total Sessions", value: totalSessions, icon: <CalendarIcon/>, color: "bg-blue-500" },
            { label: "Avg Rate / Session", value: `$${avgRate}`, icon: <TrendUpIcon/>, color: "bg-[#006236]" },
          ].map((card, i) => (
            <div key={i} className="bg-white border border-[#006236]/10 rounded-2xl p-[clamp(14px,1.5vw,24px)] flex items-center gap-3">
              <div className={`${card.color} w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0`}>{card.icon}</div>
              <div>
                <p className="text-gray-500 text-xs m-0">{card.label}</p>
                <p className="text-[#006236] text-[clamp(20px,2vw,28px)] font-bold m-0">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Earnings Chart */}
        <div className="bg-white border border-[#006236]/10 rounded-2xl p-[clamp(16px,2vw,28px)]">
          <h3 className="text-[#006236] text-[clamp(14px,1.4vw,20px)] font-bold m-0 mb-4">Monthly Earnings</h3>
          <div className="flex items-end justify-between gap-[clamp(8px,1.5vw,20px)] h-[180px] px-2">
            {MONTHLY_EARNINGS.map(m => {
              const heightPct = (m.amount / maxEarning) * 100;
              const isCurrent = m.month === "Mar";
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[#006236] text-[clamp(10px,0.9vw,13px)] font-semibold">${m.amount}</span>
                  <div className={`w-full max-w-[50px] rounded-t-lg transition-all ${isCurrent ? "bg-amber-500" : "bg-[#006236]"}`} style={{ height: `${heightPct * 1.5}px`, minHeight: "20px" }}/>
                  <span className={`text-[clamp(10px,0.9vw,13px)] ${isCurrent ? "text-amber-600 font-bold" : "text-gray-500"}`}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-800 text-sm">Filter:</span>
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#006236]/10 text-[#006236] text-sm font-semibold cursor-pointer hover:bg-[#006236]/5 transition-colors">
                <FilterIcon/> {selectedMonth} <ChevronDown/>
              </button>
              {showFilter && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-20 py-1 min-w-[180px]">
                  {MONTHS.map(m => (
                    <button key={m} onClick={() => { setSelectedMonth(m); setShowFilter(false); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-2 text-sm cursor-pointer border-none transition-colors ${
                        selectedMonth === m ? "bg-[#006236]/10 text-[#006236] font-semibold" : "bg-transparent text-gray-600 hover:bg-gray-50"
                      }`}>{m}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span className="text-gray-500 text-sm">{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Payments Table */}
        <div className="bg-white border border-[#006236]/10 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_0.6fr_0.7fr] gap-2 px-5 py-3 bg-[#006236] text-white text-[clamp(11px,1vw,14px)] font-semibold">
            <span>Date</span>
            <span>Student</span>
            <span>Subject</span>
            <span className="text-center">Sessions</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Status</span>
          </div>

          {/* Table body */}
          <div className="divide-y divide-[#006236]/10">
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No transactions found for this period.</div>
            ) : (
              paginated.map(p => (
                <div key={p.id}>
                  <div onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                    className="grid grid-cols-[1fr_1.2fr_0.8fr_0.6fr_0.6fr_0.7fr] gap-2 px-5 py-3.5 items-center cursor-pointer hover:bg-[#006236]/5 transition-colors text-[clamp(12px,1.1vw,15px)]">
                    <span className="text-gray-600">{p.date}</span>
                    <span className="text-[#006236] font-semibold truncate">{p.student}</span>
                    <span className="text-gray-500">{p.level}</span>
                    <span className="text-gray-600 text-center">{p.sessions}</span>
                    <span className="text-[#006236] font-bold text-right">${p.amount}</span>
                    <span className="text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === "paid" ? "bg-[#006236]/15 text-[#006236]" : "bg-amber-100 text-amber-600"
                      }`}>{p.status === "paid" ? "Paid" : "Pending"}</span>
                    </span>
                  </div>
                  {/* Expanded detail */}
                  {expandedRow === p.id && (
                    <div className="px-5 pb-4 bg-[#006236]/5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div><span className="text-gray-400 text-xs block">Transaction ID</span><span className="text-[#006236] font-semibold">{p.id}</span></div>
                        <div><span className="text-gray-400 text-xs block">Rate / Session</span><span className="text-[#006236] font-semibold">${p.rate}</span></div>
                        <div><span className="text-gray-400 text-xs block">Payment Method</span><span className="text-[#006236] font-semibold">{p.method}</span></div>
                        <div><span className="text-gray-400 text-xs block">Subject & Level</span><span className="text-[#006236] font-semibold">{p.subject} — {p.level}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-[#006236]/10">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 rounded-full bg-[#006236]/10 text-[#006236] flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-default hover:bg-[#006236]/20 transition-colors">
                <ChevronLeft/>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer text-sm font-semibold transition-colors ${
                    currentPage === i + 1 ? "bg-[#006236] text-white" : "bg-transparent text-[#006236] hover:bg-[#006236]/10"
                  }`}>{i + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-[#006236]/10 text-[#006236] flex items-center justify-center border-none cursor-pointer disabled:opacity-30 disabled:cursor-default hover:bg-[#006236]/20 transition-colors">
                <ChevronRight/>
              </button>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
