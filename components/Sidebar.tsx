"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLocale } from "@/lib/i18n/LocaleContext";

const navItems = [
  {
    key: "nav.dashboard",
    href: "/",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />,
  },
  {
    key: "nav.students",
    href: "/students",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
  },
  {
    key: "nav.teachers",
    href: "/teachers",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  },
  {
    key: "nav.classes",
    href: "/classes",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  },
  {
    key: "nav.attendance",
    href: "/attendance",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
  },
  {
    key: "nav.exams",
    href: "/exams",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    key: "nav.fees",
    href: "/fees",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </>
    ),
  },
  {
    key: "nav.timetable",
    href: "/timetable",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
  { divider: true, key: "div-ai", labelKey: "nav.aiTools" },
  {
    key: "nav.worksheets",
    href: "/worksheets",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    key: "nav.lessonPlans",
    href: "/lesson-plans",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
  },
  {
    key: "nav.tests",
    href: "/tests",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
  },
  {
    key: "nav.doubtSolver",
    href: "/doubt-solver",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    key: "nav.reports",
    href: "/reports",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  },
  { divider: true, key: "div-admin", labelKey: "nav.admin" },
  {
    key: "nav.notices",
    href: "/notices",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
  },
  {
    key: "nav.compliance",
    href: "/compliance",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
  {
    key: "nav.settings",
    href: "/settings",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
  },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <button
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-lg bg-white shadow-md text-slate-600 hover:bg-slate-50"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-60 bg-navy flex flex-col z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <img
            src="/logo.svg"
            alt="DigiSchool"
            className="w-10 h-10 rounded-lg object-contain bg-white shadow-md shadow-black/20"
          />
          <span className="text-white font-bold text-lg tracking-tight">{t("app.name")}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            if ("divider" in item && item.divider) {
              const divItem = item as { key: string; divider: true; labelKey: string };
              return (
                <div key={divItem.key} className="pt-4 pb-1 px-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {t(divItem.labelKey)}
                  </p>
                </div>
              );
            }
            const navItem = item as { key: string; href: string; icon: React.ReactNode };
            const isActive = navItem.href === "/" ? pathname === "/" : pathname.startsWith(navItem.href);
            return (
              <button
                key={navItem.key}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-teal to-emerald text-white shadow-lg shadow-teal/20"
                    : "text-slate-400 hover:bg-navy-hover hover:text-slate-200"
                }`}
                onClick={() => { setOpen(false); router.push(navItem.href); }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {navItem.icon}
                </svg>
                {t(navItem.key)}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky to-royal flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-tight truncate">{user?.name || "Loading..."}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email || ""}</p>
            </div>
            <button
              onClick={logout}
              title={t("auth.logout")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
