import DashboardLayout from "./DashboardLayout";

const BAR_DATA = [
  { country: "Afghan", value: 30 },
  { country: "Tajikistan", value: 100 },
  { country: "UK", value: 80 },
  { country: "USA", value: 200 },
  { country: "Russia", value: 150 },
];
const MAX_VALUE = 250;

export default function Statistics() {
  return (
    <DashboardLayout activePage="statistics">
      <div className="flex-1 p-[clamp(16px,3vw,40px)] overflow-y-auto">
        {/* Title */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-white text-[clamp(24px,3vw,48px)] font-semibold">Student</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 15 12 9 18 15"/></svg>
        </div>

        <div className="bg-[#d9d9d9] rounded-2xl p-[clamp(16px,3vw,40px)]">
          {/* Product label */}
          <div className="border border-[#006236] rounded-2xl px-6 py-2.5 text-center mb-4">
            <span className="text-[#006236] text-[clamp(16px,1.6vw,24px)] font-semibold">Student</span>
          </div>

          {/* Summary dots */}
          <div className="flex items-center justify-center gap-[clamp(12px,2vw,32px)] mb-5 flex-wrap">
            {["Total Students: 1000","Total Courses: 1000","Total Amount(USD): 70,000"].map(label => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#006236]"/>
                <span className="text-[#006236] text-[clamp(11px,1vw,16px)] whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-[#006236] text-[clamp(13px,1.2vw,18px)]">{"Filter By ->"}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#006236] text-[clamp(16px,1.6vw,24px)] font-semibold">Country</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006236" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 15 12 9 18 15"/></svg>
            </div>
          </div>

          {/* Bar chart */}
          <div className="border border-[#006236] rounded p-[clamp(12px,2vw,24px)] flex items-end justify-center gap-[clamp(16px,3vw,40px)] min-h-[250px]">
            {BAR_DATA.map(item => {
              const heightPct = (item.value / MAX_VALUE) * 100;
              return (
                <div key={item.country} className="flex flex-col items-center gap-1">
                  <span className="text-[#006236] text-[clamp(11px,1vw,16px)] font-semibold">{item.value}</span>
                  <div className="bg-[#006236] rounded-sm min-h-[20px]" style={{ width: "clamp(20px,2.5vw,30px)", height: `${heightPct * 1.8}px` }}/>
                  <div className="text-[#006236] text-[clamp(10px,0.9vw,14px)] whitespace-nowrap mt-1" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{item.country}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
