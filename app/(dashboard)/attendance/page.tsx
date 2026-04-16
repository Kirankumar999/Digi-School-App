"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface StudentRecord {
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "late" | "leave";
  profilePicture?: string;
}

interface AttendanceDay {
  date: string;
  classGrade: string;
  section: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalLeave: number;
  totalStudents: number;
  percentage: number;
}

const STATUS_COLORS: Record<string, string> = {
  present: "bg-emerald-100 text-emerald-700 border-emerald-200",
  absent: "bg-red-100 text-red-700 border-red-200",
  late: "bg-amber-100 text-amber-700 border-amber-200",
  leave: "bg-blue-100 text-blue-700 border-blue-200",
};

const STATUS_ICONS: Record<string, string> = {
  present: "✓",
  absent: "✗",
  late: "⏱",
  leave: "📋",
};

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const SECTIONS = ["A", "B", "C", "D"];

export default function AttendancePage() {
  const { t, tGrade, tSection } = useLocale();
  const [view, setView] = useState<"mark" | "report">("mark");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [classGrade, setClassGrade] = useState("");
  const [section, setSection] = useState("");
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState<{ days: AttendanceDay[]; overallPercentage: number; totalDays: number } | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const statusLabel = useCallback((s: string) => t(`attendance.${s}`), [t]);

  const loadStudents = useCallback(async () => {
    if (!classGrade || !section) return;
    setLoading(true);
    try {
      const [studRes, attRes] = await Promise.all([
        fetch(`/api/attendance/students?classGrade=${classGrade}&section=${section}`),
        fetch(`/api/attendance?date=${date}&classGrade=${classGrade}&section=${section}`),
      ]);
      const studData = await studRes.json();
      const attData = await attRes.json();
      const existingRecords = attData.attendance?.[0]?.records || [];
      const existingMap = new Map(existingRecords.map((r: StudentRecord) => [r.studentId, r.status]));
      const merged = (studData.students || []).map((s: { _id: string; firstName: string; lastName: string; profilePicture?: string }) => ({
        studentId: s._id,
        studentName: `${s.firstName} ${s.lastName}`,
        status: existingMap.get(s._id) || "present",
        profilePicture: s.profilePicture || "",
      }));
      setRecords(merged);
    } catch { setMsg(t("common.failedToLoad")); }
    finally { setLoading(false); }
  }, [classGrade, section, date, t]);

  useEffect(() => { if (view === "mark" && classGrade && section) loadStudents(); }, [view, classGrade, section, date, loadStudents]);

  const toggleStatus = (idx: number) => {
    const order: StudentRecord["status"][] = ["present", "absent", "late", "leave"];
    setRecords((prev) => prev.map((r, i) => {
      if (i !== idx) return r;
      return { ...r, status: order[(order.indexOf(r.status) + 1) % order.length] };
    }));
  };

  const markAll = (status: StudentRecord["status"]) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const saveAttendance = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/attendance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, classGrade, section, records }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("attendance.savedSuccess"));
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
    finally { setSaving(false); }
  };

  const loadReport = useCallback(async () => {
    if (!classGrade || !section) return;
    setReportLoading(true);
    try {
      const res = await fetch(`/api/attendance/report?month=${reportMonth}&classGrade=${classGrade}&section=${section}`);
      setReportData(await res.json());
    } catch { setMsg(t("common.failedToLoad")); }
    finally { setReportLoading(false); }
  }, [reportMonth, classGrade, section, t]);

  useEffect(() => { if (view === "report" && classGrade && section) loadReport(); }, [view, reportMonth, classGrade, section, loadReport]);

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const leaveCount = records.filter((r) => r.status === "leave").length;

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-emerald flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            {t("attendance.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("attendance.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("mark")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "mark" ? "bg-teal text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t("attendance.markAttendance")}
          </button>
          <button onClick={() => setView("report")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "report" ? "bg-teal text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {t("attendance.monthlyReport")}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {view === "mark" && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.date")}</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
            </div>
          )}
          {view === "report" && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("months.January").split(" ")[0] ? t("attendance.monthlyReport").split(" ")[0] : "Month"}</label>
              <input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.class")}</label>
            <select value={classGrade} onChange={(e) => setClassGrade(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
              <option value="">{t("common.selectClass")}</option>
              {GRADES.map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.section")}</label>
            <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
              <option value="">{t("common.selectSection")}</option>
              {SECTIONS.map((s) => <option key={s} value={s}>{tSection(s)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg === t("attendance.savedSuccess") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg}
        </div>
      )}

      {view === "mark" && (
        <>
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-500 mt-3">{t("common.loading")}</p>
            </div>
          ) : records.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-4 gap-0 border-b border-slate-100">
                {[
                  { label: t("attendance.present"), count: presentCount, color: "text-emerald-600 bg-emerald-50" },
                  { label: t("attendance.absent"), count: absentCount, color: "text-red-600 bg-red-50" },
                  { label: t("attendance.late"), count: lateCount, color: "text-amber-600 bg-amber-50" },
                  { label: t("attendance.leave"), count: leaveCount, color: "text-blue-600 bg-blue-50" },
                ].map((s) => (
                  <div key={s.label} className={`p-3 text-center ${s.color}`}>
                    <div className="text-2xl font-bold">{s.count}</div>
                    <div className="text-xs font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-medium text-slate-500">{t("common.quickActions")}:</span>
                {(["present", "absent", "late", "leave"] as const).map((s) => (
                  <button key={s} onClick={() => markAll(s)} className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${STATUS_COLORS[s]}`}>
                    {t(`attendance.all${s.charAt(0).toUpperCase() + s.slice(1)}`)}
                  </button>
                ))}
              </div>
              <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                {records.map((rec, idx) => (
                  <div key={rec.studentId} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition">
                    <span className="w-6 text-xs text-slate-400 text-right">{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky to-royal flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {rec.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{rec.studentName}</p>
                    </div>
                    <button onClick={() => toggleStatus(idx)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer min-w-[90px] text-center ${STATUS_COLORS[rec.status]}`}>
                      {STATUS_ICONS[rec.status]} {statusLabel(rec.status)}
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button onClick={saveAttendance} disabled={saving} className="w-full py-2.5 bg-gradient-to-r from-teal to-emerald text-white rounded-lg font-medium text-sm hover:shadow-lg transition disabled:opacity-50 cursor-pointer">
                  {saving ? t("attendance.saving") : `${t("attendance.saveAttendance")} (${records.length} ${t("attendance.studentsLabel")})`}
                </button>
              </div>
            </div>
          ) : classGrade && section ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500 text-sm">{t("attendance.noStudentsFound")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-500 text-sm">{t("attendance.selectClassSection")}</p>
            </div>
          )}
        </>
      )}

      {view === "report" && (
        <>
          {reportLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-500 mt-3">{t("common.loading")}</p>
            </div>
          ) : reportData && reportData.days.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                  <div className="text-3xl font-bold text-teal">{reportData.overallPercentage}%</div>
                  <div className="text-xs text-slate-500 mt-1">{t("attendance.overallAttendance")}</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                  <div className="text-3xl font-bold text-slate-700">{reportData.totalDays}</div>
                  <div className="text-xs text-slate-500 mt-1">{t("attendance.workingDays")}</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-600">{reportData.days.reduce((a, b) => a + b.totalPresent, 0)}</div>
                  <div className="text-xs text-slate-500 mt-1">{t("attendance.totalPresent")}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700">{t("attendance.dailyBreakdown")}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-slate-100">
                        <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("common.date")}</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 text-center">{t("attendance.present")}</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 text-center">{t("attendance.absent")}</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 text-center">{t("attendance.late")}</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 text-center">{t("attendance.leave")}</th>
                        <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 text-center">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {reportData.days.map((day) => (
                        <tr key={day.date} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-medium text-slate-700">
                            {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                          </td>
                          <td className="px-4 py-2.5 text-center text-emerald-600 font-medium">{day.totalPresent}</td>
                          <td className="px-4 py-2.5 text-center text-red-600 font-medium">{day.totalAbsent}</td>
                          <td className="px-4 py-2.5 text-center text-amber-600 font-medium">{day.totalLate}</td>
                          <td className="px-4 py-2.5 text-center text-blue-600 font-medium">{day.totalLeave}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${day.percentage >= 80 ? "bg-emerald-100 text-emerald-700" : day.percentage >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                              {day.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : classGrade && section ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500 text-sm">{t("common.noData")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500 text-sm">{t("attendance.selectClassSection")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
