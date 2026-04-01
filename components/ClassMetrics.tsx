import { DonutChart } from "./DonutChart";

const smallDonuts = [
  { label: "Class 6A", avg: "95%", pct: 95, gradientId: "g1", start: "#0d9488", end: "#10b981", text: "text-teal" },
  { label: "Class 8B", avg: "98%", pct: 98, gradientId: "g2", start: "#6366f1", end: "#8b5cf6", text: "text-royal" },
  { label: "Class 6A", avg: "95%", pct: 95, gradientId: "g3", start: "#38bdf8", end: "#0ea5e9", text: "text-sky" },
];

const largeDonuts = [
  { label: "Class 6A", avg: "95%", pct: 95, gradientId: "g4", start: "#0d9488", end: "#10b981", text: "text-teal" },
  { label: "Class 8B", avg: "95%", pct: 95, gradientId: "g5", start: "#6366f1", end: "#8b5cf6", text: "text-royal" },
];

export function ClassMetrics() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Class Progress Metrics</h3>
        <button className="px-3 py-1.5 bg-gradient-to-r from-royal to-violet-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-royal/25 transition-all cursor-pointer">
          Add Admins
        </button>
      </div>

      {/* Small donut row */}
      <div className="flex items-center justify-around mb-5">
        {smallDonuts.map((d) => (
          <div key={d.gradientId} className="text-center">
            <div className="mx-auto mb-2">
              <DonutChart
                percentage={d.pct}
                gradientId={d.gradientId}
                colorStart={d.start}
                colorEnd={d.end}
                textColor={d.text}
              />
            </div>
            <p className="text-xs font-semibold text-slate-700">{d.label}</p>
            <p className="text-[10px] text-slate-400">(Avg {d.avg})</p>
          </div>
        ))}
      </div>

      {/* Large donut row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {largeDonuts.map((d) => (
          <div key={d.gradientId} className="flex flex-col items-center">
            <div className="mb-2">
              <DonutChart
                percentage={d.pct}
                gradientId={d.gradientId}
                colorStart={d.start}
                colorEnd={d.end}
                textColor={d.text}
                size="lg"
              />
            </div>
            <p className="text-xs font-semibold text-slate-700">{d.label}</p>
            <p className="text-[10px] text-slate-400">(Avg {d.avg})</p>
          </div>
        ))}
      </div>

      {/* Top Performing Class */}
      <div className="bg-gradient-to-r from-emerald/5 to-teal/5 rounded-lg p-3 mb-3">
        <h4 className="text-xs font-bold text-slate-700 mb-2">Top Performing Class</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center text-white text-[10px] font-bold">JN</div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Jatim Name</p>
              <p className="text-[10px] text-slate-400">Average Grade</p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-emerald/15 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Class Needing Support */}
      <div className="bg-gradient-to-r from-rose/5 to-pink-500/5 rounded-lg p-3">
        <h4 className="text-xs font-bold text-slate-700 mb-2">Class Needing Support</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-[10px] font-bold">CR</div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Color Ria</p>
              <p className="text-[10px] text-slate-400">Grade</p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-rose/15 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
