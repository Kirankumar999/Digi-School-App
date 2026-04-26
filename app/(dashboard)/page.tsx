"use client";

import { useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { PerformanceLineChart } from "@/components/dashboard/PerformanceLineChart";
import { AttendanceDoughnut } from "@/components/dashboard/AttendanceDoughnut";

const TODAYS_SCHEDULE = [
  { initial: "M", title: "Mathematics — Grade 10A", meta: "Mr. Anderson · Room 204", time: "08:00 - 09:00", pill: "brand", avatar: "g1" as const },
  { initial: "S", title: "Science — Grade 9B", meta: "Dr. Patel · Lab 1", time: "09:15 - 10:15", pill: "warning", avatar: "g3" as const },
  { initial: "E", title: "English Literature — Grade 11", meta: "Ms. Reyes · Room 102", time: "10:30 - 11:30", pill: "info", avatar: "g6" as const },
  { initial: "P", title: "Physical Education — Grade 8", meta: "Coach Williams · Field A", time: "13:00 - 14:00", pill: "success", avatar: "g4" as const },
];

const RECENT_ACTIVITY = [
  { dot: "b", icon: "user-plus", text: <><b>Alex Thompson</b> enrolled into Grade 9B</>, time: "2 minutes ago" },
  { dot: "s", icon: "check-circle", text: <>Math Quiz results published for <b>Grade 10A</b></>, time: "28 minutes ago" },
  { dot: "w", icon: "bell", text: <>Parent meeting scheduled with <b>5 families</b></>, time: "1 hour ago" },
  { dot: "c", icon: "credit-card", text: <>Fee payment received from <b>Mia Carter</b></>, time: "3 hours ago" },
  { dot: "b", icon: "book", text: <>New assignment posted in <b>English Literature</b></>, time: "5 hours ago" },
];

const TOP_STUDENTS = [
  { initials: "EL", name: "Emma Lawson", email: "emma.l@school.edu", grade: "10A", gpa: "3.98", progress: 96, status: "Excellent", pill: "success", avatar: "g1" as const },
  { initials: "JK", name: "James Kim", email: "james.k@school.edu", grade: "11B", gpa: "3.92", progress: 92, status: "Excellent", pill: "success", avatar: "g3" as const },
  { initials: "SO", name: "Sofia Ortega", email: "sofia.o@school.edu", grade: "9A", gpa: "3.85", progress: 88, status: "Great", pill: "brand", avatar: "g6" as const },
  { initials: "RP", name: "Rahul Patel", email: "rahul.p@school.edu", grade: "12C", gpa: "3.79", progress: 84, status: "Great", pill: "brand", avatar: "g4" as const },
];

const UPCOMING_EVENTS = [
  { title: "Annual Sports Day", date: "Apr 24", meta: "All grades · Main grounds · 8:00 AM", pill: "brand", color: "var(--brand-1)" },
  { title: "Parent–Teacher Meet", date: "Apr 26", meta: "Grades 9–12 · Auditorium · 10:00 AM", pill: "warning", color: "var(--brand-3)" },
  { title: "Science Exhibition", date: "May 02", meta: "All students · Science block", pill: "info", color: "var(--brand-4)" },
  { title: "Term 2 Begin", date: "May 06", meta: "Academic calendar resumes", pill: "success", color: "var(--success)" },
];

const dotIcon = (kind: string) => {
  switch (kind) {
    case "user-plus":
      return <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6" />;
    case "check-circle":
      return <path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />;
    case "bell":
      return <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />;
    case "credit-card":
      return <path strokeLinecap="round" strokeLinejoin="round" d="M2 5h20v14H2zM2 10h20" />;
    case "book":
      return <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />;
    default:
      return null;
  }
};

export default function DashboardHome() {
  const [perfRange, setPerfRange] = useState<"Week" | "Month" | "Term">("Week");

  return (
    <div className="flex flex-col gap-5">
      {/* Banner */}
      <div className="ep-banner">
        <div className="ep-banner-ic">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM5 18l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1zM18 16l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[18px] font-bold leading-tight">Term 2 enrollment is now open</h3>
          <p className="text-sm opacity-90 mt-1">You have 23 pending student applications waiting for review.</p>
        </div>
        <div className="hidden sm:block">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(6px)" }}
          >
            Review now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          variant="s1"
          label="Total Students"
          value={2847}
          delta="+12.4% this month"
          trend="up"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H3v-2a4 4 0 014-4h4a4 4 0 014 4v2H9zm3-10a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          }
        />
        <StatCard
          variant="s2"
          label="Total Teachers"
          value={186}
          delta="+3 new hires"
          trend="up"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
            </svg>
          }
        />
        <StatCard
          variant="s3"
          label="Avg. Attendance"
          value={94.2}
          decimals={1}
          suffix="%"
          delta="+1.2% vs last week"
          trend="up"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          }
        />
        <StatCard
          variant="s4"
          label="Fees Collected"
          value={184320}
          prefix="$"
          delta="8 pending invoices"
          trend="down"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 5h20v14H2zM2 10h20" />
            </svg>
          }
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="ep-card xl:col-span-2 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                Academic Performance
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
                Average score across grades — Term 2
              </p>
            </div>
            <div
              className="inline-flex p-1 gap-0.5 rounded-xl"
              style={{ background: "var(--surface-3)" }}
            >
              {(["Week", "Month", "Term"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setPerfRange(r)}
                  className="px-3 py-1.5 text-[13px] font-semibold rounded-lg transition"
                  style={{
                    background: perfRange === r ? "var(--surface)" : "transparent",
                    color: perfRange === r ? "var(--text)" : "var(--text-soft)",
                    boxShadow: perfRange === r ? "var(--shadow-sm)" : "none",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", height: 280 }}>
            <PerformanceLineChart />
          </div>
          <div className="flex flex-wrap gap-4 mt-3">
            {[
              { color: "var(--brand-1)", label: "Mathematics" },
              { color: "var(--brand-3)", label: "Science" },
              { color: "var(--brand-4)", label: "English" },
            ].map((l) => (
              <span key={l.label} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text-soft)" }}>
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="ep-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              Attendance Overview
            </h3>
            <Link href="/attendance" className="text-xs" style={{ color: "var(--text-mute)" }}>
              View all
            </Link>
          </div>
          <div style={{ position: "relative", height: 220 }}>
            <AttendanceDoughnut />
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-[11px]" style={{ color: "var(--text-mute)" }}>Present</div>
              <div className="font-bold text-[18px]" style={{ color: "var(--text)" }}>2,683</div>
            </div>
            <div>
              <div className="text-[11px]" style={{ color: "var(--text-mute)" }}>Absent</div>
              <div className="font-bold text-[18px]" style={{ color: "var(--danger)" }}>102</div>
            </div>
            <div>
              <div className="text-[11px]" style={{ color: "var(--text-mute)" }}>Late</div>
              <div className="font-bold text-[18px]" style={{ color: "var(--warning)" }}>62</div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="ep-card xl:col-span-2">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                Today&apos;s Schedule
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
                Wednesday, April 19 · 6 classes
              </p>
            </div>
            <Link href="/timetable" className="ep-btn ep-btn-ghost">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              Full timetable
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {TODAYS_SCHEDULE.map((s) => (
              <div
                key={s.title}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "var(--surface-2)" }}
              >
                <div className={`ep-avatar ${s.avatar}`} style={{ width: 44, height: 44, borderRadius: 12 }}>
                  {s.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{s.title}</div>
                  <div className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-mute)" }}>{s.meta}</div>
                </div>
                <span className={`ep-pill ${s.pill}`}>{s.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ep-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              Recent Activity
            </h3>
            <a className="text-xs" style={{ color: "var(--text-mute)" }} href="#">See all</a>
          </div>
          <div className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((a, i) => {
              const bg = {
                b: "var(--gradient-brand)",
                c: "var(--gradient-cool)",
                w: "var(--gradient-warm)",
                s: "var(--gradient-success)",
              }[a.dot] || "var(--gradient-brand)";
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="w-9 h-9 rounded-xl grid place-items-center text-white shrink-0"
                    style={{ background: bg }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      {dotIcon(a.icon)}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] leading-snug" style={{ color: "var(--text)" }}>{a.text}</div>
                    <div className="text-[11px] mt-1" style={{ color: "var(--text-mute)" }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top students + Upcoming events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="ep-card xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              Top Performing Students
            </h3>
            <Link href="/reports" className="text-xs" style={{ color: "var(--text-mute)" }}>View all</Link>
          </div>
          <div className="overflow-x-auto -mx-5">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>GPA</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TOP_STUDENTS.map((s) => (
                  <tr key={s.email}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`ep-avatar ${s.avatar}`} style={{ width: 34, height: 34 }}>{s.initials}</div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{s.name}</div>
                          <div className="text-[11px]" style={{ color: "var(--text-mute)" }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--text)" }}>{s.grade}</td>
                    <td><b style={{ color: "var(--text)" }}>{s.gpa}</b></td>
                    <td style={{ minWidth: 160 }}>
                      <div className="ep-progress">
                        <span style={{ width: `${s.progress}%` }} />
                      </div>
                    </td>
                    <td><span className={`ep-pill ${s.pill}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ep-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              Upcoming Events
            </h3>
            <a className="text-xs" style={{ color: "var(--text-mute)" }} href="#">Calendar</a>
          </div>
          <div className="flex flex-col gap-3">
            {UPCOMING_EVENTS.map((e) => (
              <div
                key={e.title}
                className="p-3.5 rounded-2xl"
                style={{ background: "var(--surface-2)", borderLeft: `4px solid ${e.color}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm" style={{ color: "var(--text)" }}>{e.title}</strong>
                  <span className={`ep-pill ${e.pill}`}>{e.date}</span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: "var(--text-mute)" }}>{e.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
