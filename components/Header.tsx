"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-badge to-orange-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow">
                  {initials}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700 leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/60 py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-badge to-orange-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-slate-100">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-teal/10 text-teal capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); router.push("/profile"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose hover:bg-rose/5 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
