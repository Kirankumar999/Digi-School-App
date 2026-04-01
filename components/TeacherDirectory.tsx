const teachers = [
  { id: "S10901", name: "John Ramik", initials: "JR", dept: "Department", subject: "History", contact: "038-456-630", gradient: "from-cyan-400 to-blue-500" },
  { id: "S10902", name: "John Ramin", initials: "JR", dept: "Department", subject: "Department", contact: "038-456-630", gradient: "from-rose-400 to-pink-500" },
  { id: "S10903", name: "Aalan Kloen", initials: "AK", dept: "English", subject: "Math", contact: "038-456-300", gradient: "from-amber-400 to-yellow-500" },
  { id: "S10904", name: "Davana Roman", initials: "DR", dept: "History", subject: "Class", contact: "038-450-530", gradient: "from-emerald-400 to-green-500" },
  { id: "S10905", name: "Just Smith", initials: "JS", dept: "History", subject: "History", contact: "039-550-530", gradient: "from-violet-400 to-indigo-500" },
  { id: "S10906", name: "Kelty Sanen", initials: "KS", dept: "English", subject: "Department", contact: "039-330-195", gradient: "from-teal-400 to-cyan-500" },
];

export function TeacherDirectory() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-xs font-bold text-slate-800 mb-2">Teacher Directory</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 min-w-[120px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal bg-slate-50"
        />
        <select className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30">
          <option>Grade</option>
        </select>
        <select className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30">
          <option>Section</option>
        </select>
        <button className="px-3 py-1.5 bg-gradient-to-r from-teal to-emerald text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-teal/25 transition-all cursor-pointer">
          View Active
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              {["Teacher ID", "Name", "Department", "Subject", "Contact", "Actions"].map((h) => (
                <th key={h} className="text-left py-2 px-1 text-slate-500 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.id}</td>
                <td className="py-2 px-1 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                      {t.initials}
                    </div>
                    <span className="text-slate-700 font-medium">{t.name}</span>
                  </div>
                </td>
                <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.dept}</td>
                <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.subject}</td>
                <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.contact}</td>
                <td className="py-2 px-1">
                  <a href="#" className="text-teal hover:text-teal-dark font-semibold hover:underline whitespace-nowrap">View/Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
