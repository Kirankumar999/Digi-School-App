"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface ComplianceData {
  udise: {
    schoolCategory: string; medium: string; totalStudents: number; totalTeachers: number;
    totalClasses: number; studentTeacherRatio: number;
    genderWise: Record<string, number>; gradeWise: Record<string, number>;
    teacherQualifications: Record<string, number>;
  };
  rte: { totalSeats: number; reservedSeats: number; filled: number };
  mdm: { eligibleStudents: number; avgAttendance: number; attendanceDays: number };
  summary: { totalStudents: number; totalTeachers: number; totalClasses: number; studentTeacherRatio: number; avgAttendance: number };
}

export default function CompliancePage() {
  const { t, tGrade, tGender } = useLocale();
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "udise" | "rte" | "mdm">("overview");

  useEffect(() => {
    fetch("/api/compliance")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="text-center py-12 text-slate-500">{t("common.failedToLoad")}</div>;

  const { udise, rte, mdm, summary } = data;

  const tabLabels: Record<string, string> = {
    overview: t("compliance.overview"),
    udise: t("compliance.udise"),
    rte: t("compliance.rte"),
    mdm: t("compliance.mdm"),
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-badge to-orange-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          {t("compliance.title")}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">{t("compliance.subtitle")}</p>
      </div>

      <div className="flex gap-2">
        {(["overview", "udise", "rte", "mdm"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeTab === tab ? "bg-amber-badge text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: t("nav.students"), value: summary.totalStudents, color: "text-royal" },
              { label: t("nav.teachers"), value: summary.totalTeachers, color: "text-teal" },
              { label: t("nav.classes"), value: summary.totalClasses, color: "text-amber-600" },
              { label: t("compliance.studentTeacherRatio"), value: `${summary.studentTeacherRatio}:1`, color: "text-emerald-600" },
              { label: t("compliance.avgAttendance"), value: `${summary.avgAttendance}%`, color: "text-sky" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t("compliance.complianceChecklist")}</h3>
            <div className="space-y-2">
              {[
                { item: t("compliance.checklist.enrollment"), done: summary.totalStudents > 0 },
                { item: t("compliance.checklist.teacherData"), done: summary.totalTeachers > 0 },
                { item: t("compliance.checklist.classInfo"), done: summary.totalClasses > 0 },
                { item: t("compliance.checklist.rteNorms"), done: summary.studentTeacherRatio <= 30 },
                { item: t("compliance.checklist.attendanceActive"), done: summary.avgAttendance > 0 },
                { item: t("compliance.checklist.rteTracking"), done: rte.reservedSeats > 0 },
                { item: t("compliance.checklist.mdmLinked"), done: mdm.attendanceDays > 0 },
              ].map((c) => (
                <div key={c.item} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${c.done ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                    {c.done ? "✓" : "✗"}
                  </span>
                  <span className={`text-sm ${c.done ? "text-slate-700" : "text-red-600 font-medium"}`}>{c.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "udise" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{t("compliance.schoolData")}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">{t("compliance.schoolCategory")}:</span> <span className="font-medium text-slate-700">{t("compliance.primaryWithUpper")}</span></div>
              <div><span className="text-slate-500">{t("compliance.medium")}:</span> <span className="font-medium text-slate-700">{t("compliance.marathi")}</span></div>
              <div><span className="text-slate-500">{t("nav.students")}:</span> <span className="font-medium text-slate-700">{udise.totalStudents}</span></div>
              <div><span className="text-slate-500">{t("nav.teachers")}:</span> <span className="font-medium text-slate-700">{udise.totalTeachers}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">{t("compliance.genderDistribution")}</h4>
              <div className="space-y-2">
                {Object.entries(udise.genderWise).map(([gender, count]) => (
                  <div key={gender} className="flex justify-between text-sm">
                    <span className="text-slate-600">{tGender(gender)}</span>
                    <span className="font-medium text-slate-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">{t("compliance.gradeWiseEnrollment")}</h4>
              <div className="space-y-2">
                {Object.entries(udise.gradeWise).map(([grade, count]) => (
                  <div key={grade} className="flex justify-between text-sm">
                    <span className="text-slate-600">{tGrade(grade)}</span>
                    <span className="font-medium text-slate-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "rte" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("compliance.rteReservation")}</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{rte.totalSeats}</div>
              <div className="text-xs text-blue-600 mt-1">{t("compliance.totalSeats")}</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{rte.reservedSeats}</div>
              <div className="text-xs text-amber-600 mt-1">{t("compliance.reservedSeats")}</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">{rte.filled}</div>
              <div className="text-xs text-emerald-600 mt-1">{t("compliance.filled")}</div>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-emerald to-teal h-3 rounded-full transition-all" style={{ width: `${rte.reservedSeats > 0 ? (rte.filled / rte.reservedSeats) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {rte.reservedSeats > 0 ? Math.round((rte.filled / rte.reservedSeats) * 100) : 0}% {t("compliance.rteSeatsFilled")}
          </p>
        </div>
      )}

      {activeTab === "mdm" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("compliance.mdmRegister")}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{mdm.eligibleStudents}</div>
              <div className="text-xs text-green-600 mt-1">{t("compliance.eligibleStudents")}</div>
            </div>
            <div className="text-center p-4 bg-teal/10 rounded-lg">
              <div className="text-2xl font-bold text-teal">{mdm.avgAttendance}%</div>
              <div className="text-xs text-teal mt-1">{t("compliance.avgAttendance")}</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{mdm.attendanceDays}</div>
              <div className="text-xs text-blue-600 mt-1">{t("compliance.daysTracked")}</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">{t("compliance.mdmNote")}</p>
        </div>
      )}
    </div>
  );
}
