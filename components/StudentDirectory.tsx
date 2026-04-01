const students = [
  { id: "S100301", name: "John Name", initials: "JN", grade: "A", section: "A1", contact: "009-435-0195", gradient: "from-blue-400 to-indigo-500" },
  { id: "S100302", name: "Ratik Kanin", initials: "RK", grade: "G", section: "A2", contact: "009-435-0732", gradient: "from-pink-400 to-rose-500" },
  { id: "S100303", name: "Dalone Rira", initials: "DR", grade: "G", section: "A4", contact: "009-435-0709", gradient: "from-amber-400 to-orange-500" },
  { id: "S100304", name: "Zama Kanan", initials: "ZK", grade: "G", section: "A3", contact: "009-435-0789", gradient: "from-emerald-400 to-teal-500" },
  { id: "S100305", name: "Join Wario", initials: "JW", grade: "D", section: "A4", contact: "009-435-4766", gradient: "from-violet-400 to-purple-500" },
];

export function StudentDirectory() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h2 className="text-sm font-bold text-slate-800 mb-3">Student Profile Management</h2>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-700">Student Directory</h3>
        <button className="px-4 py-1.5 bg-gradient-to-r from-emerald to-teal text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald/25 transition-all cursor-pointer">
          Add Students
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Search Student Name/ID"
          className="flex-1 min-w-[140px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal bg-slate-50"
        />
        <select className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30">
          <option>Grade</option>
          <option>A</option><option>B</option><option>C</option><option>D</option><option>G</option>
        </select>
        <select className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30">
          <option>Section</option>
          <option>A1</option><option>A2</option><option>A3</option><option>A4</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              {["Student ID", "Name", "Grade", "Section", "Contact", "Actions"].map((h) => (
                <th key={h} className="text-left py-2 px-1 text-slate-500 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{s.id}</td>
                <td className="py-2 px-1 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                      {s.initials}
                    </div>
                    <span className="text-slate-700 font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="py-2 px-1 text-slate-600">{s.grade}</td>
                <td className="py-2 px-1 text-slate-600">{s.section}</td>
                <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{s.contact}</td>
                <td className="py-2 px-1">
                  <a href="#" className="text-teal hover:text-teal-dark font-semibold hover:underline whitespace-nowrap">View/Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-1 mt-3">
        <button className="w-7 h-7 rounded-md text-xs text-slate-400 hover:bg-slate-100 flex items-center justify-center cursor-pointer">&lt;</button>
        <button className="w-7 h-7 rounded-md text-xs bg-teal text-white font-bold flex items-center justify-center cursor-pointer">1</button>
        <button className="w-7 h-7 rounded-md text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer">2</button>
        <button className="w-7 h-7 rounded-md text-xs text-slate-400 hover:bg-slate-100 flex items-center justify-center cursor-pointer">&gt;</button>
      </div>
    </div>
  );
}
