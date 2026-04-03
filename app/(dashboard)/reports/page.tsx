"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

/* ─── Types ─── */
interface StudentOption { _id: string; studentId: string; firstName: string; lastName: string; grade: string; section: string; profilePicture?: string }
interface SubjectPerf { subject: string; avgPercentage: number; totalMarks: number; marksObtained: number; testsCount: number; bestScore: number; worstScore: number; grade: string }
interface GradeDist { grade: string; count: number }
interface TestTl { _id: string; testName: string; subject: string; percentage: number; grade: string; marksObtained: number; totalMarks: number; createdAt: string }
interface OverallStats { totalTests: number; avgPercentage: number; bestPercentage: number; worstPercentage: number; totalMarks: number; totalObtained: number }
interface OverviewData {
  totalStudents: number; totalTests: number; avgPercentage: number;
  subjectPerformance: { subject: string; avgPercentage: number; totalTests: number }[];
  gradeDistribution: GradeDist[];
  trend: { label: string; avgPercentage: number; count: number }[];
  topPerformers: { studentId: string; studentName: string; avgPercentage: number; testsCount: number }[];
  needsAttention: { studentId: string; studentName: string; avgPercentage: number; testsCount: number }[];
}
interface SubjectGradeRC { subject: string; totalMarks: number; marksObtained: number; percentage: number; grade: string; testsCount: number; remarks: string }
interface ReportCardData {
  _id: string; reportCardId: string; studentName: string; studentGrade: string; studentSection: string;
  classNum: number; term: string; academicYear: string; subjectGrades: SubjectGradeRC[];
  overallPercentage: number; overallGrade: string; attendance: { totalDays: number; presentDays: number; percentage: number };
  aiRemarks: string; strengths: string[]; areasToImprove: string[]; recommendations: string[];
  teacherComments: string; principalComments: string;
  coScholastic: { activity: string; grade: string }[];
  createdAt: string;
}

type TabView = "overview" | "student" | "reportcards";

const GRADE_COLORS: Record<string, string> = { "A+": "#059669", A: "#10b981", "B+": "#0ea5e9", B: "#3b82f6", C: "#f59e0b", D: "#f97316", F: "#ef4444" };
const GRADE_BG: Record<string, string> = { "A+": "bg-emerald-100 text-emerald-700", A: "bg-emerald-50 text-emerald-600", "B+": "bg-sky-100 text-sky-700", B: "bg-blue-100 text-blue-600", C: "bg-amber-100 text-amber-700", D: "bg-orange-100 text-orange-700", F: "bg-rose-100 text-rose-700" };

const svg = (d: string, cls = "w-4 h-4") => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg>
);

export default function ReportsPage() {
  const [tab, setTab] = useState<TabView>("overview");

  /* ── Overview ── */
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [oLoading, setOLoading] = useState(false);

  /* ── Student analytics ── */
  const [studentSearch, setStudentSearch] = useState("");
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [sLoading, setSLoading] = useState(false);
  const [sData, setSData] = useState<{ overallStats: OverallStats; subjectPerformance: SubjectPerf[]; gradeDistribution: GradeDist[]; testTimeline: TestTl[] } | null>(null);

  /* ── Report cards ── */
  const [rcList, setRcList] = useState<ReportCardData[]>([]);
  const [rcLoading, setRcLoading] = useState(false);
  const [genOpen, setGenOpen] = useState(false);
  const [genStudent, setGenStudent] = useState<StudentOption | null>(null);
  const [genSearch, setGenSearch] = useState("");
  const [genOptions, setGenOptions] = useState<StudentOption[]>([]);
  const [showGenDrop, setShowGenDrop] = useState(false);
  const genRef = useRef<HTMLDivElement>(null);
  const [genTerm, setGenTerm] = useState("Term 1");
  const [genYear, setGenYear] = useState("2025-2026");
  const [genAttTotal, setGenAttTotal] = useState(200);
  const [genAttPresent, setGenAttPresent] = useState(180);
  const [genTeacher, setGenTeacher] = useState("");
  const [genPrincipal, setGenPrincipal] = useState("");
  const [generating, setGenerating] = useState(false);
  const [viewRC, setViewRC] = useState<ReportCardData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [rcSelected, setRcSelected] = useState<Set<string>>(new Set());

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Fetch overview ── */
  const fetchOverview = useCallback(async () => {
    setOLoading(true);
    try {
      const res = await fetch("/api/analytics/overview");
      const d = await res.json();
      if (res.ok) setOverview(d.overview);
    } catch { /* ignore */ }
    finally { setOLoading(false); }
  }, []);

  useEffect(() => { if (tab === "overview") fetchOverview(); }, [tab, fetchOverview]);

  /* ── Student search ── */
  useEffect(() => {
    if (studentSearch.length < 2) { setStudentOptions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/students?search=${encodeURIComponent(studentSearch)}&limit=8`);
        const d = await res.json();
        if (res.ok) setStudentOptions(d.students || []);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(t);
  }, [studentSearch]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectStudent = async (s: StudentOption) => {
    setSelectedStudent(s);
    setStudentSearch(`${s.firstName} ${s.lastName}`);
    setShowDropdown(false);
    setSLoading(true);
    try {
      const res = await fetch(`/api/analytics/student/${s._id}`);
      const d = await res.json();
      if (res.ok) setSData(d.analytics);
      else setMsg({ type: "error", text: d.error });
    } catch { setMsg({ type: "error", text: "Failed to load analytics" }); }
    finally { setSLoading(false); }
  };

  /* ── Gen student search ── */
  useEffect(() => {
    if (genSearch.length < 2) { setGenOptions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/students?search=${encodeURIComponent(genSearch)}&limit=8`);
        const d = await res.json();
        if (res.ok) setGenOptions(d.students || []);
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(t);
  }, [genSearch]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (genRef.current && !genRef.current.contains(e.target as Node)) setShowGenDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Report cards list ── */
  const fetchRC = useCallback(async () => {
    setRcLoading(true);
    try {
      const res = await fetch("/api/report-cards?limit=50");
      const d = await res.json();
      if (res.ok) setRcList(d.reportCards);
    } catch { /* ignore */ }
    finally { setRcLoading(false); }
  }, []);

  useEffect(() => { if (tab === "reportcards") fetchRC(); }, [tab, fetchRC]);

  /* ── Generate report card ── */
  const handleGenerate = async () => {
    if (!genStudent) { setMsg({ type: "error", text: "Select a student" }); return; }
    setGenerating(true); setMsg(null);
    try {
      const res = await fetch("/api/report-cards/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: genStudent._id, term: genTerm, academicYear: genYear,
          attendance: { totalDays: genAttTotal, presentDays: genAttPresent },
          teacherComments: genTeacher || undefined, principalComments: genPrincipal || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: d.error || "Generation failed" }); return; }
      setMsg({ type: "success", text: "Report card generated!" });
      setViewRC(d.reportCard);
      setGenOpen(false);
      fetchRC();
    } catch { setMsg({ type: "error", text: "Network error" }); }
    finally { setGenerating(false); }
  };

  const downloadPdf = async (id: string) => {
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/report-cards/${id}/pdf`);
      if (!res.ok) { setMsg({ type: "error", text: "PDF generation failed" }); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `report-card-${id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { setMsg({ type: "error", text: "Download failed" }); }
    finally { setPdfLoading(false); }
  };

  const deleteSelectedRC = async () => {
    if (!rcSelected.size || !confirm(`Delete ${rcSelected.size} report card(s)?`)) return;
    const res = await fetch("/api/report-cards", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...rcSelected] }) });
    if (res.ok) { setRcSelected(new Set()); fetchRC(); }
  };

  const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  /* ── RENDER ── */
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {svg("M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", "w-5 h-5")}
            Reports &amp; Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Performance analytics, student insights &amp; AI report cards</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1">
          {([["overview", "Overview"], ["student", "Student"], ["reportcards", "Report Cards"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${tab === k ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{l}</button>
          ))}
        </div>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border ${msg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
          {svg(msg.type === "success" ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")}
          {msg.text}
          <button onClick={() => setMsg(null)} className="ml-auto opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
        </div>
      )}

      {/* ========== OVERVIEW ========== */}
      {tab === "overview" && (
        oLoading || !overview ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
            <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Loading analytics...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Students", value: overview.totalStudents, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197", color: "from-teal-500 to-emerald-500" },
                { label: "Tests Evaluated", value: overview.totalTests, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "from-sky-500 to-blue-500" },
                { label: "Average Score", value: `${overview.avgPercentage}%`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "from-violet-500 to-purple-500" },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>{svg(c.icon, "w-6 h-6 text-white")}</div>
                  <div><p className="text-2xl font-bold text-slate-800">{c.value}</p><p className="text-xs text-slate-500">{c.label}</p></div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject performance bar */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Subject Performance</h3>
                {overview.subjectPerformance.length > 0 ? (
                  <Bar
                    data={{
                      labels: overview.subjectPerformance.map((s) => s.subject),
                      datasets: [{
                        label: "Avg %",
                        data: overview.subjectPerformance.map((s) => s.avgPercentage),
                        backgroundColor: ["#0d9488", "#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6", "#f97316"],
                        borderRadius: 6,
                      }],
                    }}
                    options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }}
                  />
                ) : <p className="text-sm text-slate-400 text-center py-8">No test data yet</p>}
              </div>

              {/* Grade doughnut */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Grade Distribution</h3>
                {overview.gradeDistribution.length > 0 ? (
                  <div className="max-w-[260px] mx-auto">
                    <Doughnut
                      data={{
                        labels: overview.gradeDistribution.map((g) => g.grade),
                        datasets: [{ data: overview.gradeDistribution.map((g) => g.count), backgroundColor: overview.gradeDistribution.map((g) => GRADE_COLORS[g.grade] || "#94a3b8"), borderWidth: 2, borderColor: "#fff" }],
                      }}
                      options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { padding: 12, usePointStyle: true, pointStyle: "circle" } } } }}
                    />
                  </div>
                ) : <p className="text-sm text-slate-400 text-center py-8">No grade data</p>}
              </div>
            </div>

            {/* Trend */}
            {overview.trend.length > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Monthly Performance Trend</h3>
                <Line
                  data={{
                    labels: overview.trend.map((t) => t.label),
                    datasets: [{
                      label: "Avg %",
                      data: overview.trend.map((t) => t.avgPercentage),
                      borderColor: "#0d9488",
                      backgroundColor: "rgba(13,148,136,0.1)",
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointBackgroundColor: "#0d9488",
                    }],
                  }}
                  options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }}
                />
              </div>
            )}

            {/* Top & Needs Attention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2">{svg("M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3")} Top Performers</h3>
                {overview.topPerformers.length > 0 ? (
                  <div className="space-y-2">{overview.topPerformers.map((p, i) => (
                    <div key={p.studentId} className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50/50">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="flex-1 text-sm font-medium text-slate-700">{p.studentName}</span>
                      <span className="text-sm font-bold text-emerald-600">{p.avgPercentage}%</span>
                      <span className="text-[10px] text-slate-400">{p.testsCount} tests</span>
                    </div>
                  ))}</div>
                ) : <p className="text-xs text-slate-400">No data yet</p>}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-bold text-amber-700 mb-4 flex items-center gap-2">{svg("M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z")} Needs Attention</h3>
                {overview.needsAttention.length > 0 ? (
                  <div className="space-y-2">{overview.needsAttention.map((p) => (
                    <div key={p.studentId} className="flex items-center gap-3 p-2 rounded-lg bg-amber-50/50">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">{initials(p.studentName)}</div>
                      <span className="flex-1 text-sm font-medium text-slate-700">{p.studentName}</span>
                      <span className="text-sm font-bold text-amber-600">{p.avgPercentage}%</span>
                      <span className="text-[10px] text-slate-400">{p.testsCount} tests</span>
                    </div>
                  ))}</div>
                ) : <p className="text-xs text-slate-400">All students above 50%</p>}
              </div>
            </div>
          </div>
        )
      )}

      {/* ========== STUDENT ANALYTICS ========== */}
      {tab === "student" && (
        <div className="space-y-6">
          {/* Student selector */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">{svg("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")} Select Student</h2>
            {selectedStudent ? (
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
                {selectedStudent.profilePicture ? <img src={selectedStudent.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" /> :
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">{initials(`${selectedStudent.firstName} ${selectedStudent.lastName}`)}</div>}
                <div className="flex-1"><p className="text-sm font-semibold text-slate-800">{selectedStudent.firstName} {selectedStudent.lastName}</p><p className="text-xs text-slate-500">Grade {selectedStudent.grade}{selectedStudent.section ? `-${selectedStudent.section}` : ""}</p></div>
                <button onClick={() => { setSelectedStudent(null); setStudentSearch(""); setSData(null); }} className="p-1.5 rounded-lg hover:bg-teal-100 text-teal-600 cursor-pointer">{svg("M6 18L18 6M6 6l12 12", "w-3.5 h-3.5")}</button>
              </div>
            ) : (
              <div ref={searchRef} className="relative">
                <input type="text" value={studentSearch} onChange={(e) => { setStudentSearch(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} placeholder="Search student..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 bg-slate-50" />
                {showDropdown && studentOptions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
                    {studentOptions.map((s) => (
                      <button key={s._id} onClick={() => selectStudent(s)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-left cursor-pointer">
                        {s.profilePicture ? <img src={s.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" /> :
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">{initials(`${s.firstName} ${s.lastName}`)}</div>}
                        <div><p className="text-sm font-medium text-slate-700">{s.firstName} {s.lastName}</p><p className="text-[10px] text-slate-400">Grade {s.grade}</p></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {sLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">
              <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Loading student analytics...
            </div>
          ) : sData ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Tests Taken", value: sData.overallStats.totalTests, color: "text-sky-600" },
                  { label: "Average Score", value: `${sData.overallStats.avgPercentage}%`, color: "text-teal-600" },
                  { label: "Best Score", value: `${sData.overallStats.bestPercentage}%`, color: "text-emerald-600" },
                  { label: "Total Marks", value: `${sData.overallStats.totalObtained}/${sData.overallStats.totalMarks}`, color: "text-violet-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Subject chart + Grade distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4">Subject-wise Performance</h3>
                  {sData.subjectPerformance.length > 0 ? (
                    <Bar
                      data={{
                        labels: sData.subjectPerformance.map((s) => s.subject),
                        datasets: [
                          { label: "Avg %", data: sData.subjectPerformance.map((s) => s.avgPercentage), backgroundColor: "#0d9488", borderRadius: 6 },
                          { label: "Best", data: sData.subjectPerformance.map((s) => s.bestScore), backgroundColor: "#10b981", borderRadius: 6 },
                        ],
                      }}
                      options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }}
                    />
                  ) : <p className="text-sm text-slate-400 text-center py-8">No data</p>}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4">Grade Breakdown</h3>
                  {sData.gradeDistribution.length > 0 ? (
                    <Doughnut
                      data={{
                        labels: sData.gradeDistribution.map((g) => g.grade),
                        datasets: [{ data: sData.gradeDistribution.map((g) => g.count), backgroundColor: sData.gradeDistribution.map((g) => GRADE_COLORS[g.grade] || "#94a3b8"), borderWidth: 2, borderColor: "#fff" }],
                      }}
                      options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle" } } } }}
                    />
                  ) : <p className="text-sm text-slate-400 text-center py-8">No data</p>}
                </div>
              </div>

              {/* Score timeline */}
              {sData.testTimeline.length > 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-4">Score Timeline</h3>
                  <Line
                    data={{
                      labels: sData.testTimeline.slice().reverse().map((t) => `${t.testName.slice(0, 12)}${t.testName.length > 12 ? "…" : ""}`),
                      datasets: [{
                        label: "%", data: sData.testTimeline.slice().reverse().map((t) => t.percentage),
                        borderColor: "#0d9488", backgroundColor: "rgba(13,148,136,0.1)", fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: "#0d9488",
                      }],
                    }}
                    options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }}
                  />
                </div>
              )}

              {/* Subject detail cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 mb-3">Subject Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sData.subjectPerformance.map((s) => (
                    <div key={s.subject} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-700">{s.subject}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${GRADE_BG[s.grade] || "bg-slate-100 text-slate-500"}`}>{s.grade}</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1"><span>Score</span><span>{s.avgPercentage}%</span></div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all" style={{ width: `${Math.min(s.avgPercentage, 100)}%` }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div><p className="font-bold text-slate-600">{s.testsCount}</p><p className="text-slate-400">Tests</p></div>
                        <div><p className="font-bold text-emerald-600">{s.bestScore}%</p><p className="text-slate-400">Best</p></div>
                        <div><p className="font-bold text-rose-500">{s.worstScore}%</p><p className="text-slate-400">Lowest</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test history table */}
              {sData.testTimeline.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-700">Test History</h3></div>
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-2.5 px-4 text-left text-xs font-bold text-slate-500">Test</th>
                      <th className="py-2.5 px-3 text-left text-xs font-bold text-slate-500">Subject</th>
                      <th className="py-2.5 px-3 text-center text-xs font-bold text-slate-500">Score</th>
                      <th className="py-2.5 px-3 text-center text-xs font-bold text-slate-500">Grade</th>
                      <th className="py-2.5 px-3 text-right text-xs font-bold text-slate-500">Date</th>
                    </tr></thead>
                    <tbody>{sData.testTimeline.map((t) => (
                      <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-2.5 px-4 text-slate-700 font-medium">{t.testName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{t.subject}</td>
                        <td className="py-2.5 px-3 text-center"><span className="font-semibold">{t.marksObtained}/{t.totalMarks}</span><span className="text-[10px] text-slate-400 ml-1">({t.percentage.toFixed(1)}%)</span></td>
                        <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${GRADE_BG[t.grade] || "bg-slate-100"}`}>{t.grade}</span></td>
                        <td className="py-2.5 px-3 text-right text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </>
          ) : !selectedStudent ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
              {svg("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "w-12 h-12 text-slate-300 mx-auto mb-3")}
              <p className="text-slate-500 font-medium">Select a student to view performance analytics</p>
              <p className="text-xs text-slate-400 mt-1">Charts, score trends, subject-wise breakdowns &amp; more</p>
            </div>
          ) : null}
        </div>
      )}

      {/* ========== REPORT CARDS ========== */}
      {tab === "reportcards" && (
        <div className="space-y-6">
          {/* Action bar */}
          <div className="flex items-center gap-3">
            <button onClick={() => setGenOpen(true)} className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 hover:brightness-110 cursor-pointer flex items-center gap-2">
              {svg("M12 4v16m8-8H4")} Generate Report Card
            </button>
            {rcSelected.size > 0 && (
              <button onClick={deleteSelectedRC} className="py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer flex items-center gap-1.5">
                {svg("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")} Delete ({rcSelected.size})
              </button>
            )}
          </div>

          {/* View RC */}
          {viewRC && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white flex items-center justify-between">
                <div>
                  <p className="text-teal-200 text-xs">{viewRC.term} — {viewRC.academicYear}</p>
                  <h2 className="text-lg font-bold">{viewRC.studentName}</h2>
                  <p className="text-teal-200 text-xs">Class {viewRC.classNum}{viewRC.studentSection ? `-${viewRC.studentSection}` : ""}</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <div><p className="text-2xl font-black">{viewRC.overallPercentage.toFixed(1)}%</p><p className="text-[10px] text-teal-200">Grade {viewRC.overallGrade}</p></div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {/* Subject table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="py-2 px-3 text-left text-xs font-bold text-slate-500">Subject</th><th className="py-2 px-3 text-center text-xs font-bold text-slate-500">Marks</th><th className="py-2 px-3 text-center text-xs font-bold text-slate-500">%</th><th className="py-2 px-3 text-center text-xs font-bold text-slate-500">Grade</th><th className="py-2 px-3 text-left text-xs font-bold text-slate-500">Remarks</th></tr></thead>
                    <tbody>{viewRC.subjectGrades.map((s) => (
                      <tr key={s.subject} className="border-b border-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-700">{s.subject}</td>
                        <td className="py-2 px-3 text-center">{s.marksObtained}/{s.totalMarks}</td>
                        <td className="py-2 px-3 text-center font-semibold">{s.percentage.toFixed(1)}%</td>
                        <td className="py-2 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${GRADE_BG[s.grade] || "bg-slate-100"}`}>{s.grade}</span></td>
                        <td className="py-2 px-3 text-xs text-slate-500">{s.remarks}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                {/* Co-scholastic */}
                {viewRC.coScholastic.length > 0 && (
                  <div><h4 className="text-xs font-bold text-slate-600 mb-2">Co-Scholastic Areas</h4>
                  <div className="flex flex-wrap gap-2">{viewRC.coScholastic.map((c) => (
                    <span key={c.activity} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"><span className="font-semibold text-slate-700">{c.activity}</span> <span className={`font-bold ${c.grade === "A" ? "text-emerald-600" : c.grade === "B" ? "text-sky-600" : "text-amber-600"}`}>{c.grade}</span></span>
                  ))}</div></div>
                )}
                {/* AI Remarks */}
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-teal-700 mb-2">Teacher&apos;s Remarks (AI)</h4>
                  <p className="text-sm text-teal-800">{viewRC.aiRemarks}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">{viewRC.strengths.map((s, i) => <li key={i} className="text-[11px] text-emerald-800 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">✓</span>{s}</li>)}</ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-700 mb-2">Areas to Improve</h4>
                    <ul className="space-y-1">{viewRC.areasToImprove.map((a, i) => <li key={i} className="text-[11px] text-amber-800 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">→</span>{a}</li>)}</ul>
                  </div>
                </div>
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-sky-700 mb-2">Recommendations for Parents</h4>
                  <ul className="space-y-1">{viewRC.recommendations.map((r, i) => <li key={i} className="text-[11px] text-sky-800 flex items-start gap-1.5"><span className="text-sky-500 mt-0.5">•</span>{r}</li>)}</ul>
                </div>
                {viewRC.attendance.totalDays > 0 && (
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-500">Attendance:</span>
                    <span className="font-semibold text-slate-700">{viewRC.attendance.presentDays}/{viewRC.attendance.totalDays} days ({viewRC.attendance.percentage.toFixed(1)}%)</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => downloadPdf(viewRC._id)} disabled={pdfLoading} className="py-2 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold hover:brightness-110 cursor-pointer flex items-center gap-2 disabled:opacity-50">
                    {pdfLoading ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : svg("M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")}
                    Download PDF
                  </button>
                  <button onClick={() => setViewRC(null)} className="py-2 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* RC List */}
          {rcLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">Loading...</div>
          ) : !rcList.length && !viewRC ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
              {svg("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-12 h-12 text-slate-300 mx-auto mb-3")}
              <p className="text-slate-500 font-medium">No report cards yet</p>
              <p className="text-xs text-slate-400 mt-1">Generate your first AI-powered report card</p>
            </div>
          ) : rcList.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-4 w-8"><input type="checkbox" onChange={() => { if (rcSelected.size === rcList.length) setRcSelected(new Set()); else setRcSelected(new Set(rcList.map(r => r._id))); }} checked={rcSelected.size === rcList.length && rcList.length > 0} className="rounded cursor-pointer" /></th>
                  <th className="py-3 px-3 text-left text-xs font-bold text-slate-500">Student</th>
                  <th className="py-3 px-3 text-left text-xs font-bold text-slate-500">Term</th>
                  <th className="py-3 px-3 text-center text-xs font-bold text-slate-500">Score</th>
                  <th className="py-3 px-3 text-center text-xs font-bold text-slate-500">Grade</th>
                  <th className="py-3 px-3 text-right text-xs font-bold text-slate-500">Date</th>
                  <th className="py-3 px-3 w-28"></th>
                </tr></thead>
                <tbody>{rcList.map((r) => (
                  <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4"><input type="checkbox" checked={rcSelected.has(r._id)} onChange={() => setRcSelected((p) => { const n = new Set(p); n.has(r._id) ? n.delete(r._id) : n.add(r._id); return n; })} className="rounded cursor-pointer" /></td>
                    <td className="py-3 px-3"><p className="font-medium text-slate-700">{r.studentName}</p><p className="text-[10px] text-slate-400">Class {r.classNum}{r.studentSection ? `-${r.studentSection}` : ""}</p></td>
                    <td className="py-3 px-3 text-slate-600">{r.term}<br /><span className="text-[10px] text-slate-400">{r.academicYear}</span></td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700">{r.overallPercentage.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${GRADE_BG[r.overallGrade] || "bg-slate-100"}`}>{r.overallGrade}</span></td>
                    <td className="py-3 px-3 text-right text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 px-3 flex gap-2 justify-end">
                      <button onClick={() => setViewRC(r)} className="text-xs font-semibold text-teal-600 hover:text-teal-800 cursor-pointer">View</button>
                      <button onClick={() => downloadPdf(r._id)} className="text-xs font-semibold text-sky-600 hover:text-sky-800 cursor-pointer">PDF</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : null}

          {/* Generate Modal */}
          {genOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !generating && setGenOpen(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-800">Generate AI Report Card</h2>
                  <button onClick={() => !generating && setGenOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">{svg("M6 18L18 6M6 6l12 12")}</button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Student */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Student *</label>
                    {genStudent ? (
                      <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">{initials(`${genStudent.firstName} ${genStudent.lastName}`)}</div>
                        <div className="flex-1"><p className="text-sm font-semibold">{genStudent.firstName} {genStudent.lastName}</p><p className="text-[10px] text-slate-400">Grade {genStudent.grade}</p></div>
                        <button onClick={() => { setGenStudent(null); setGenSearch(""); }} className="p-1 text-teal-600 cursor-pointer">{svg("M6 18L18 6M6 6l12 12", "w-3 h-3")}</button>
                      </div>
                    ) : (
                      <div ref={genRef} className="relative">
                        <input value={genSearch} onChange={(e) => { setGenSearch(e.target.value); setShowGenDrop(true); }} onFocus={() => setShowGenDrop(true)} placeholder="Search student..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 bg-slate-50" />
                        {showGenDrop && genOptions.length > 0 && (
                          <div className="absolute z-30 w-full mt-1 bg-white rounded-xl shadow-lg border max-h-48 overflow-y-auto">
                            {genOptions.map((s) => (
                              <button key={s._id} onClick={() => { setGenStudent(s); setGenSearch(`${s.firstName} ${s.lastName}`); setShowGenDrop(false); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-left cursor-pointer">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">{initials(`${s.firstName} ${s.lastName}`)}</div>
                                <div><p className="text-sm">{s.firstName} {s.lastName}</p><p className="text-[10px] text-slate-400">Grade {s.grade}</p></div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Term *</label>
                      <select value={genTerm} onChange={(e) => setGenTerm(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 cursor-pointer">{["Term 1","Term 2","Annual"].map((t) => <option key={t}>{t}</option>)}</select>
                    </div>
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Academic Year *</label>
                      <input value={genYear} onChange={(e) => setGenYear(e.target.value)} placeholder="2025-2026" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Total School Days</label>
                      <input type="number" value={genAttTotal} onChange={(e) => setGenAttTotal(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50" />
                    </div>
                    <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Days Present</label>
                      <input type="number" value={genAttPresent} onChange={(e) => setGenAttPresent(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50" />
                    </div>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Teacher Comments <span className="font-normal text-slate-400">(optional)</span></label>
                    <textarea value={genTeacher} onChange={(e) => setGenTeacher(e.target.value)} rows={2} placeholder="Additional comments..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 resize-none" />
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Principal Comments <span className="font-normal text-slate-400">(optional)</span></label>
                    <textarea value={genPrincipal} onChange={(e) => setGenPrincipal(e.target.value)} rows={2} placeholder="Additional comments..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 resize-none" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setGenOpen(false)} disabled={generating} className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button onClick={handleGenerate} disabled={generating || !genStudent} className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold hover:brightness-110 disabled:opacity-50 cursor-pointer flex items-center gap-2">
                    {generating ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating...</> : "Generate Report Card"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
