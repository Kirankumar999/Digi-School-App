"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Period { periodNumber: number; startTime: string; endTime: string; subject: string; teacherName: string; type: string; }
interface DaySchedule { day: string; periods: Period[]; }
interface TimetableData { _id: string; timetableId: string; grade: string; section: string; schedule: DaySchedule[]; status: string; effectiveFrom: string; }

const GRADES = ["1","2","3","4","5","6","7","8","9","10"];
const SECTIONS = ["A","B","C","D"];
const TYPE_COLORS: Record<string, string> = {
  class: "bg-white",
  break: "bg-amber-50 border-amber-200",
  assembly: "bg-blue-50 border-blue-200",
  lunch: "bg-green-50 border-green-200",
  free: "bg-slate-50 border-slate-200",
};

export default function TimetablePage() {
  const { t, tGrade, tSection, tDay, tSubject } = useLocale();
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState("");

  const loadTimetable = useCallback(async () => {
    if (!grade || !section) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/timetable?grade=${grade}&section=${section}&status=Active`);
      const data = await res.json();
      setTimetable(data.timetables?.[0] || null);
    } catch { /* ignore */ }
    setLoading(false);
  }, [grade, section]);

  useEffect(() => { loadTimetable(); }, [loadTimetable]);

  const generateTimetable = async () => {
    if (!grade || !section) { setMsg(t("common.fillRequired")); return; }
    setGenerating(true); setMsg("");
    try {
      const res = await fetch("/api/timetable/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, section }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("timetable.generated"));
      loadTimetable();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
    setGenerating(false);
  };

  const translatePeriodLabel = (p: Period) => {
    if (p.type === "break") return t("timetable.break");
    if (p.type === "assembly") return t("timetable.assembly");
    if (p.type === "lunch") return t("timetable.lunch");
    if (p.type === "free") return t("timetable.free");
    return tSubject(p.subject);
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky to-royal flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            {t("timetable.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("timetable.subtitle")}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.class")}</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
              <option value="">{t("common.select")}</option>
              {GRADES.map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.section")}</label>
            <select value={section} onChange={(e) => setSection(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
              <option value="">{t("common.select")}</option>
              {SECTIONS.map((s) => <option key={s} value={s}>{tSection(s)}</option>)}
            </select>
          </div>
          <button
            onClick={generateTimetable}
            disabled={generating || !grade || !section}
            className="px-4 py-2 bg-gradient-to-r from-sky to-royal text-white rounded-lg font-medium text-sm cursor-pointer disabled:opacity-50 hover:shadow-lg transition"
          >
            {generating ? t("timetable.generating") : t("timetable.generate")}
          </button>
        </div>
      </div>

      {msg && <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg === t("timetable.generated") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-8 h-8 border-2 border-royal border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : timetable ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">{tGrade(timetable.grade)}-{tSection(timetable.section)} {t("timetable.title")}</h3>
            <span className="text-xs text-slate-500">{t("timetable.effective")}: {timetable.effectiveFrom}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 bg-slate-50 border-b border-r border-slate-200 sticky left-0 z-10">{t("days.Monday").split("").slice(0, 0).join("") || ""}</th>
                  {timetable.schedule[0]?.periods.map((p) => (
                    <th key={p.periodNumber} className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 bg-slate-50 border-b border-r border-slate-200 min-w-[100px]">
                      <div>{p.type === "class" ? `${t("timetable.period")} ${p.periodNumber}` : translatePeriodLabel(p)}</div>
                      <div className="font-normal text-slate-400">{p.startTime}-{p.endTime}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.schedule.map((day) => (
                  <tr key={day.day}>
                    <td className="px-3 py-2.5 font-semibold text-slate-700 bg-slate-50 border-b border-r border-slate-200 sticky left-0 z-10 text-xs">{tDay(day.day)}</td>
                    {day.periods.map((p) => (
                      <td key={p.periodNumber} className={`px-2 py-2 text-center border-b border-r border-slate-100 ${TYPE_COLORS[p.type] || ""}`}>
                        {p.type === "class" ? (
                          <div>
                            <div className="font-medium text-slate-700 text-xs">{tSubject(p.subject)}</div>
                            {p.teacherName && <div className="text-[10px] text-slate-400 mt-0.5">{p.teacherName}</div>}
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-slate-500">{translatePeriodLabel(p)}</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : grade && section ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-500 text-sm">{t("timetable.noTimetable")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-500 text-sm">{t("timetable.selectToView")}</p>
        </div>
      )}
    </div>
  );
}
