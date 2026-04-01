const items = [
  {
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4",
  },
  {
    label: "Students",
    active: true,
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z",
  },
  {
    label: "Teachers",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    label: "Classes",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2",
  },
  {
    label: "Reports",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z",
  },
  {
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37",
  },
];

export function MiniNav() {
  return (
    <div className="hidden lg:flex flex-col w-11 bg-slate-50 border-r border-slate-100 py-4 px-1.5 space-y-1 shrink-0 items-center">
      {items.map((item) => (
        <button
          key={item.label}
          title={item.label}
          className={`flex items-center justify-center p-1.5 rounded-md transition cursor-pointer ${
            item.active
              ? "bg-gradient-to-br from-teal to-emerald text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
          </svg>
        </button>
      ))}
    </div>
  );
}
