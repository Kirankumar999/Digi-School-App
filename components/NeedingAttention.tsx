const students = [
  { name: "Jatim Name", label: "Average Grade", initials: "JN" },
  { name: "Golor Ratira", label: "Grade", initials: "GR" },
  { name: "Same Doner", label: "Grade", initials: "SD" },
];

export function NeedingAttention() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
      <h3 className="text-xs font-bold text-slate-800 mb-2">Students Needing Attention</h3>
      <div className="space-y-2.5">
        {students.map((s) => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {s.initials}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-700">{s.name}</p>
                <p className="text-[9px] text-slate-400">{s.label}</p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
