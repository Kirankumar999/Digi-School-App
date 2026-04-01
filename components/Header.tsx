export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-2 pl-10 lg:pl-0">
          <span className="text-teal font-extrabold text-xl tracking-tight">DigiSchool</span>
          <span className="text-slate-700 font-semibold text-base hidden sm:inline">
            School Administration Portal
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-badge to-orange-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer ring-2 ring-white shadow">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
