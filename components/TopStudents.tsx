const topStudents = [
  { name: "Jamin Name", label: "Average Grade", score: 64, initials: "JN", gradient: "from-blue-400 to-indigo-500", scoreGradient: "from-sky to-blue-500" },
  { name: "Golol Riras", label: "Average Grade", score: 63, initials: "GR", gradient: "from-pink-400 to-rose-500", scoreGradient: "from-emerald to-teal" },
  { name: "Same Name", label: "Grade", score: 63, initials: "SN", gradient: "from-amber-400 to-orange-500", scoreGradient: "from-violet-400 to-purple-500" },
];

export function TopStudents() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
      <h3 className="text-xs font-bold text-slate-800 mb-2">Top Performing Students</h3>
      <div className="space-y-2.5">
        {topStudents.map((s) => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                {s.initials}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-700">{s.name}</p>
                <p className="text-[9px] text-slate-400">{s.label}</p>
              </div>
            </div>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${s.scoreGradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {s.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
