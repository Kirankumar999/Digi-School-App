"use client";

import { useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useLocale } from "@/lib/i18n/LocaleContext";

type NavItem = {
  key: string;
  href: string;
  labelKey: string;
  icon: ReactNode;
  badge?: string;
};

type NavGroup = {
  groupKey: string;
  items: NavItem[];
};

const Icon = ({ children }: { children: ReactNode }) => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);

const NAV: NavGroup[] = [
  {
    groupKey: "Main",
    items: [
      {
        key: "dashboard", href: "/", labelKey: "nav.dashboard",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h7V3H3v10zm11 8h7V11h-7v10zM3 21h7v-6H3v6zM14 3v6h7V3h-7z" /></Icon>,
      },
      {
        key: "students", href: "/students", labelKey: "nav.students",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H3v-2a4 4 0 014-4h4a4 4 0 014 4v2H9zm3-10a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z" /></Icon>,
      },
      {
        key: "teachers", href: "/teachers", labelKey: "nav.teachers",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c3 3 9 3 12 0v-5" /></Icon>,
      },
      {
        key: "classes", href: "/classes", labelKey: "nav.classes",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M2 4a2 2 0 012-2h6.5a3.5 3.5 0 013.5 3.5V22M22 4a2 2 0 00-2-2h-6.5A3.5 3.5 0 0010 5.5V22" /></Icon>,
      },
    ],
  },
  {
    groupKey: "Academics",
    items: [
      {
        key: "attendance", href: "/attendance", labelKey: "nav.attendance",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></Icon>,
      },
      {
        key: "timetable", href: "/timetable", labelKey: "nav.timetable",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /></Icon>,
      },
      {
        key: "exams", href: "/exams", labelKey: "nav.exams",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-2 5L9 9l11 4-5 1-2 1zM7.7 6.3L9 7M7 12H5M9 17l-1.3 1.3M16.5 7.5L17.8 6.3" /></Icon>,
      },
    ],
  },
  {
    groupKey: "AI Tools",
    items: [
      {
        key: "worksheets", href: "/worksheets", labelKey: "nav.worksheets",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4a1 1 0 001 1h4M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2zM9 13h6M9 17h6" /></Icon>,
      },
      {
        key: "lessonPlans", href: "/lesson-plans", labelKey: "nav.lessonPlans",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></Icon>,
      },
      {
        key: "tests", href: "/tests", labelKey: "nav.tests",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></Icon>,
      },
      {
        key: "doubtSolver", href: "/doubt-solver", labelKey: "nav.doubtSolver",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>,
      },
      {
        key: "reports", href: "/reports", labelKey: "nav.reports",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 6-6" /></Icon>,
      },
    ],
  },
  {
    groupKey: "Admin",
    items: [
      {
        key: "fees", href: "/fees", labelKey: "nav.fees",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M2 5h20v14H2zM2 10h20M6 15h2M11 15h2" /></Icon>,
      },
      {
        key: "notices", href: "/notices", labelKey: "nav.notices",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></Icon>,
      },
      {
        key: "compliance", href: "/compliance", labelKey: "nav.compliance",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
      },
      {
        key: "settings", href: "/settings", labelKey: "nav.settings",
        icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6 1.65 1.65 0 0010 3.09V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82 1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></Icon>,
      },
    ],
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/45 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu button */}
      <button
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-xl shadow-md"
        style={{ background: "var(--surface)", color: "var(--text)" }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] flex flex-col z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: "22px 16px",
          gap: "18px",
        }}
      >
        {/* Brand */}
        <button
          onClick={() => handleNav("/")}
          className="flex items-center gap-3 px-2 py-1 cursor-pointer text-left"
        >
          <div className="ep-brand-mark">
            <Image
              src="/PradnyaShala.png"
              alt="PradnyaShala"
              width={40}
              height={40}
              className="w-full h-full object-contain p-1 relative z-[1]"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-[18px] tracking-tight" style={{ color: "var(--text)" }}>
            प्रज्ञाशाळा
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--text-mute)" }}>
              Intelligent School
            </div>
          </div>
        </button>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto pr-1 -mr-1 flex flex-col gap-3 mt-1">
          {NAV.map((group) => (
            <div key={group.groupKey} className="flex flex-col gap-0.5">
              <div
                className="text-[11px] uppercase tracking-[0.15em] px-3 pt-2 pb-1"
                style={{ color: "var(--text-mute)" }}
              >
                {group.groupKey}
              </div>
              {group.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <button
                    key={it.key}
                    onClick={() => handleNav(it.href)}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                    style={
                      active
                        ? {
                            background: "var(--gradient-brand)",
                            color: "#fff",
                            boxShadow: "0 10px 24px rgba(99,102,241,0.35)",
                          }
                        : { color: "var(--text-soft)" }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "var(--surface-3)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-soft)";
                      }
                    }}
                  >
                    <span className="grid place-items-center">{it.icon}</span>
                    <span className="flex-1 text-left truncate">{t(it.labelKey)}</span>
                    {it.badge && (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: active ? "rgba(255,255,255,0.25)" : "var(--brand-3)",
                          color: "#fff",
                        }}
                      >
                        {it.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer profile + logout */}
        <div
          className="rounded-2xl p-3 flex items-center gap-3"
          style={{ background: "var(--surface-3)" }}
        >
          <div
            className="w-10 h-10 rounded-full grid place-items-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "var(--gradient-warm)" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold leading-tight truncate" style={{ color: "var(--text)" }}>
              {user?.name || "Loading..."}
            </div>
            <div className="text-[11px] truncate" style={{ color: "var(--text-mute)" }}>
              {user?.email || ""}
            </div>
          </div>
          <button
            onClick={logout}
            title={t("auth.logout")}
            className="p-1.5 rounded-lg cursor-pointer transition"
            style={{ color: "var(--text-soft)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface)";
              e.currentTarget.style.color = "var(--danger)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-soft)";
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
