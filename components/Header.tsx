"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTheme } from "@/lib/ThemeContext";

const TITLES: Record<string, { title: string; crumbs: string[] }> = {
  "/": { title: "Dashboard", crumbs: ["Home", "Dashboard"] },
  "/students": { title: "Students", crumbs: ["Home", "Academics", "Students"] },
  "/teachers": { title: "Teachers", crumbs: ["Home", "Faculty", "Teachers"] },
  "/classes": { title: "Classes & Subjects", crumbs: ["Home", "Academics", "Classes"] },
  "/attendance": { title: "Attendance", crumbs: ["Home", "Academics", "Attendance"] },
  "/timetable": { title: "Timetable", crumbs: ["Home", "Academics", "Timetable"] },
  "/exams": { title: "Exams", crumbs: ["Home", "Academics", "Exams"] },
  "/fees": { title: "Fees", crumbs: ["Home", "Admin", "Fees"] },
  "/notices": { title: "Notices", crumbs: ["Home", "Admin", "Notices"] },
  "/settings": { title: "Settings", crumbs: ["Home", "Settings"] },
  "/profile": { title: "Profile", crumbs: ["Home", "Profile"] },
  "/worksheets": { title: "Worksheets", crumbs: ["Home", "AI Tools", "Worksheets"] },
  "/lesson-plans": { title: "Lesson Plans", crumbs: ["Home", "AI Tools", "Lesson Plans"] },
  "/tests": { title: "Tests", crumbs: ["Home", "AI Tools", "Tests"] },
  "/doubt-solver": { title: "Doubt Solver", crumbs: ["Home", "AI Tools", "Doubt Solver"] },
  "/reports": { title: "Reports", crumbs: ["Home", "AI Tools", "Reports"] },
  "/compliance": { title: "Compliance", crumbs: ["Home", "Admin", "Compliance"] },
};

export function Header() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
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
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const meta = TITLES[pathname] || { title: "PradnyaShala", crumbs: ["Home"] };
  const greetingName = user?.name?.split(" ")[0] || "";
  const displayTitle =
    pathname === "/" && greetingName ? `Welcome back, ${greetingName} 👋` : meta.title;

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-7"
      style={{
        height: "70px",
        background: "var(--glass)",
        backdropFilter: "saturate(140%) blur(14px)",
        WebkitBackdropFilter: "saturate(140%) blur(14px)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      {/* Page title + crumbs */}
      <div className="flex flex-col min-w-0 pl-10 lg:pl-0">
        <h1
          className="text-[18px] font-bold leading-tight tracking-tight truncate"
          style={{ color: "var(--text)" }}
        >
          {displayTitle}
        </h1>
        <div className="text-[12px] mt-0.5 truncate" style={{ color: "var(--text-mute)" }}>
          {meta.crumbs.map((c, i) => (
            <span key={i}>
              {i > 0 && <span className="opacity-50 mx-1.5">/</span>}
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:block ml-5 flex-1 max-w-[420px] relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center"
          style={{ color: "var(--text-mute)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search students, classes, fees…"
          className="w-full text-[13.5px] outline-none"
          style={{
            padding: "11px 14px 11px 40px",
            borderRadius: "12px",
            background: "var(--surface-3)",
            border: "1px solid transparent",
            color: "var(--text)",
            transition: "background 160ms, border-color 160ms",
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = "var(--surface)";
            e.currentTarget.style.borderColor = "var(--brand-1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = "var(--surface-3)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        />
        <kbd
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded-md"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-mute)",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Language */}
        <button
          onClick={() => setLocale(locale === "en" ? "mr" : "en")}
          className="px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
          style={{ background: "var(--surface-3)", color: "var(--text-soft)" }}
          title="Switch language"
        >
          {locale === "en" ? "मराठी" : "ENG"}
        </button>

        {/* Help */}
        <button
          className="hidden sm:grid relative w-10 h-10 rounded-xl place-items-center cursor-pointer transition"
          style={{ background: "var(--surface-3)", color: "var(--text-soft)" }}
          aria-label="Help"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Notifications */}
        <button
          className="relative w-10 h-10 rounded-xl grid place-items-center cursor-pointer transition"
          style={{ background: "var(--surface-3)", color: "var(--text-soft)" }}
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="ep-dot" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="ep-theme-toggle"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <span className="knob">
            {theme === "dark" ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </span>
        </button>

        {/* User chip */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 cursor-pointer rounded-full pr-3 pl-1.5 py-1 transition"
            style={{ background: "var(--surface-3)" }}
          >
            <div
              className="w-8 h-8 rounded-full grid place-items-center text-white text-[12px] font-bold"
              style={{ background: "var(--gradient-warm)" }}
            >
              {initials}
            </div>
            <div className="hidden md:flex flex-col leading-tight text-left">
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                {user?.name || "—"}
              </span>
              <span className="text-[11px] capitalize" style={{ color: "var(--text-mute)" }}>
                {user?.role || ""}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl py-2 z-50 ep-fade-up"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-soft)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ borderBottom: "1px solid var(--border-soft)" }}
              >
                <div
                  className="w-10 h-10 rounded-full grid place-items-center text-white text-sm font-bold"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                    {user?.name}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-mute)" }}>
                    {user?.email}
                  </p>
                  <span className="ep-pill brand mt-1.5 capitalize">{user?.role}</span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition"
                  style={{ color: "var(--text-soft)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--surface-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t("auth.myProfile")}
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition"
                  style={{ color: "var(--text-soft)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--surface-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6 1.65 1.65 0 0010 3.09V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                  {t("auth.settings")}
                </button>
              </div>
              <div style={{ borderTop: "1px solid var(--border-soft)" }} className="pt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition"
                  style={{ color: "var(--danger)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t("auth.logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
