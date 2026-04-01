const teachers = [
  { name: "Jalion Name", initials: "JN", gradient: "from-blue-400 to-indigo-500", perf: "High", perfColor: "bg-emerald/15 text-emerald-700" },
  { name: "Martia Hantianan", initials: "MH", gradient: "from-pink-400 to-rose-500", perf: "High", perfColor: "bg-emerald/15 text-emerald-700" },
  { name: "Allas Kallom", initials: "AK", gradient: "from-amber-400 to-orange-500", perf: "arrow", perfColor: "bg-emerald/15 text-emerald-700" },
  { name: "Juoos Kallom", initials: "JK", gradient: "from-emerald-400 to-teal-500", perf: "Mod", perfColor: "bg-amber-100 text-amber-700" },
  { name: "Jation Smith", initials: "JS", gradient: "from-violet-400 to-purple-500", perf: "Mod", perfColor: "bg-amber-100 text-amber-700" },
];

export function TeachersGlance() {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-800 mb-3">Teacher &amp; Class Performance</h2>
      <h3 className="text-xs font-semibold text-slate-700 mb-2">Teachers at a Glance</h3>
      <div className="space-y-2">
        {teachers.map((t) => (
          <div key={t.name} className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>
                {t.initials}
              </div>
              <span className="text-[11px] font-medium text-slate-700 truncate">{t.name}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] text-slate-400 hidden xl:inline">Class Perf.</span>
              {t.perf === "arrow" ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.perfColor}`}>
                  <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${t.perfColor}`}>
                  {t.perf}
                </span>
              )}
              <a href="#" className="text-[9px] text-teal hover:underline font-medium whitespace-nowrap">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
