"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface SyllabusChapter { number: number; name: string; topics: { name: string; keywords: string[] }[] }

interface LessonPhase {
  phase: string; duration: string; activity: string;
  teacherActions: string; studentActions: string; tips?: string;
}

interface DiffInstruction {
  slowLearners: string; advancedLearners: string;
  visualLearners?: string; kinestheticLearners?: string;
}

interface LessonPlanResult {
  _id: string; lessonPlanId: string; title: string;
  learningObjectives: string[]; prerequisites: string[];
  materialsNeeded: string[]; lessonFlow: LessonPhase[];
  differentiatedInstruction: DiffInstruction;
  boardWork: string; homework: string; assessmentCriteria: string[];
  crossCurricularLinks?: string; teacherReflection?: string;
  classNum: number; subject: string; chapter: string;
  topic: string; duration: string; teachingMethod: string;
  cached?: boolean;
}

interface HistoryItem {
  _id: string; lessonPlanId: string; title: string;
  classNum: number; subject: string; chapter: string;
  duration: string; teachingMethod: string; createdAt: string;
}

interface Pagination { total: number; page: number; limit: number; totalPages: number }

type TabView = "generate" | "history";

const DURATIONS = ["1 Period (40 min)", "2 Periods (80 min)", "Full Day Project"];
const METHODS = ["Lecture", "Activity-Based", "Discussion", "Demonstration", "Project-Based", "Blended"];

const METHOD_DESC: Record<string, string> = {
  Lecture: "Teacher-led explanation with examples",
  "Activity-Based": "Hands-on learning with manipulatives",
  Discussion: "Student-driven inquiry and dialogue",
  Demonstration: "Live demo followed by student practice",
  "Project-Based": "Real-world project collaboration",
  Blended: "Mix of instruction, activities & media",
};

const PHASE_COLORS: Record<string, string> = {
  introduction: "from-amber-500 to-yellow-500",
  "warm-up": "from-amber-500 to-yellow-500",
  explanation: "from-blue-500 to-sky-500",
  teaching: "from-blue-500 to-sky-500",
  practice: "from-emerald-500 to-teal-500",
  activity: "from-emerald-500 to-teal-500",
  assessment: "from-violet-500 to-purple-500",
  closure: "from-violet-500 to-purple-500",
  research: "from-pink-500 to-rose-500",
  presentation: "from-orange-500 to-amber-500",
  reflection: "from-green-500 to-emerald-500",
};

function getPhaseGradient(name: string) {
  for (const [key, val] of Object.entries(PHASE_COLORS)) {
    if (name.toLowerCase().includes(key)) return val;
  }
  return "from-slate-500 to-slate-600";
}

const icon = (d: string, cls = "w-4 h-4") => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

export default function LessonPlansPage() {
  const { t: tr, tGrade } = useLocale();
  const [tab, setTab] = useState<TabView>("generate");

  // Form
  const [classNum, setClassNum] = useState(0);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [method, setMethod] = useState("Activity-Based");
  const [language, setLanguage] = useState("English");
  const [includeReflection, setIncludeReflection] = useState(true);

  // Syllabus cascading
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<SyllabusChapter[]>([]);
  const [topics, setTopics] = useState<{ name: string }[]>([]);

  // Generation
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<LessonPlanResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hPag, setHPag] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [hLoading, setHLoading] = useState(false);
  const [hSelected, setHSelected] = useState<Set<string>>(new Set());

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cascading dropdowns (reuse syllabus API)
  useEffect(() => {
    if (!classNum) { setSubjects([]); setSubject(""); return; }
    fetch(`/api/worksheets/syllabus?class=${classNum}`).then(r => r.json()).then(d => { setSubjects(d.subjects || []); setSubject(""); setChapter(""); setTopic(""); });
  }, [classNum]);
  useEffect(() => {
    if (!classNum || !subject) { setChapters([]); setChapter(""); return; }
    fetch(`/api/worksheets/syllabus?class=${classNum}&subject=${encodeURIComponent(subject)}`).then(r => r.json()).then(d => { setChapters(d.chapters || []); setChapter(""); setTopic(""); });
  }, [classNum, subject]);
  useEffect(() => {
    if (!classNum || !subject || !chapter) { setTopics([]); setTopic(""); return; }
    fetch(`/api/worksheets/syllabus?class=${classNum}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`).then(r => r.json()).then(d => { setTopics(d.topics || []); setTopic(""); });
  }, [classNum, subject, chapter]);

  const handleGenerate = async () => {
    if (!classNum || !subject || !chapter) { setMsg({ type: "error", text: "Select class, subject, and chapter" }); return; }
    setGenerating(true); setMsg(null); setPlan(null);
    try {
      const res = await fetch("/api/lesson-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classNum, subject, chapter, topic: topic || undefined, duration, teachingMethod: method, language, includeReflection }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || "Generation failed" }); return; }
      setPlan({ ...data.lessonPlan, cached: data.cached });
      setMsg({ type: "success", text: data.cached ? "Lesson plan loaded from cache" : "Lesson plan generated!" });
    } catch { setMsg({ type: "error", text: "Network error" }); }
    finally { setGenerating(false); }
  };

  const handlePDF = async () => {
    if (!plan?._id) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/lesson-plans/${plan._id}/pdf`);
      if (!res.ok) { const d = await res.json(); setMsg({ type: "error", text: d.error }); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${plan.lessonPlanId}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { setMsg({ type: "error", text: "PDF download failed" }); }
    finally { setDownloading(false); }
  };

  const fetchHistory = useCallback(async (page = 1) => {
    setHLoading(true);
    try {
      const res = await fetch(`/api/lesson-plans?page=${page}&limit=10`);
      const d = await res.json();
      if (res.ok) { setHistory(d.lessonPlans); setHPag(d.pagination); }
    } catch { /* ignore */ }
    finally { setHLoading(false); }
  }, []);

  useEffect(() => { if (tab === "history") fetchHistory(); }, [tab, fetchHistory]);

  const handleDeleteHistory = async () => {
    if (!hSelected.size || !confirm(`Delete ${hSelected.size} plan(s)?`)) return;
    const res = await fetch("/api/lesson-plans", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...hSelected] }) });
    if (res.ok) { setHSelected(new Set()); fetchHistory(hPag.page); const d = await res.json(); setMsg({ type: "success", text: d.message }); }
  };

  const loadFromHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/lesson-plans/${id}`);
      const d = await res.json();
      if (res.ok) { setPlan({ ...d.lessonPlan, cached: false }); setTab("generate"); }
    } catch { setMsg({ type: "error", text: "Failed to load" }); }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {icon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "w-5 h-5")}
            {tr("lessonPlans.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{tr("lessonPlans.subtitle")}</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1">
          {(["generate", "history"] as const).map(tb => (
            <button key={tb} onClick={() => setTab(tb)} className={`py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${tab === tb ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {tb === "generate" ? tr("lessonPlans.generate") : tr("lessonPlans.history")}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border ${msg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
          {icon(msg.type === "success" ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")}
          {msg.text}
          <button onClick={() => setMsg(null)} className="ml-auto opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
        </div>
      )}

      {tab === "generate" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                {icon("M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4")}
                {tr("lessonPlans.configuration")}
              </h2>

              {/* Class */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("lessonPlans.classLabel")} *</label>
                <select value={classNum} onChange={e => setClassNum(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 cursor-pointer bg-slate-50">
                  <option value={0}>{tr("lessonPlans.selectClass")}</option>
                  {[1,2,3,4,5,6,7,8].map(c => <option key={c} value={c}>{tGrade(String(c))}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("lessonPlans.subjectLabel")} *</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!subjects.length} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300/50 cursor-pointer bg-slate-50 disabled:opacity-50">
                  <option value="">{tr("lessonPlans.selectSubject")}</option>
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Chapter */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("lessonPlans.chapterLabel")} *</label>
                <select value={chapter} onChange={e => setChapter(e.target.value)} disabled={!chapters.length} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300/50 cursor-pointer bg-slate-50 disabled:opacity-50">
                  <option value="">{tr("lessonPlans.selectChapter")}</option>
                  {chapters.map(c => <option key={c.number} value={c.name}>Ch {c.number}: {c.name}</option>)}
                </select>
              </div>

              {/* Topic */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("lessonPlans.topicLabel")} <span className="text-slate-400 font-normal">({tr("lessonPlans.optional")})</span></label>
                <select value={topic} onChange={e => setTopic(e.target.value)} disabled={!topics.length} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300/50 cursor-pointer bg-slate-50 disabled:opacity-50">
                  <option value="">{tr("lessonPlans.allTopics")}</option>
                  {topics.map(t => <option key={t.name}>{t.name}</option>)}
                </select>
              </div>

              {/* Duration */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("lessonPlans.duration")} *</label>
                <div className="space-y-1.5">
                  {DURATIONS.map(d => (
                    <button key={d} onClick={() => setDuration(d)} className={`w-full py-2 px-3 rounded-lg text-xs font-medium text-left transition cursor-pointer flex items-center gap-2 ${duration === d ? "bg-purple-100 text-purple-700 ring-1 ring-purple-300" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
                      {icon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", "w-3.5 h-3.5 shrink-0")}
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teaching Method */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("lessonPlans.teachingMethod")} *</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {METHODS.map(m => (
                    <button key={m} onClick={() => setMethod(m)} className={`py-2 px-2.5 rounded-lg text-[11px] font-medium transition cursor-pointer text-left ${method === m ? "bg-purple-100 text-purple-700 ring-1 ring-purple-300" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
                      <span className="block font-semibold">{m}</span>
                      <span className="block text-[9px] opacity-70 mt-0.5">{METHOD_DESC[m]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{tr("worksheets.language")}</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300/50 cursor-pointer bg-slate-50">
                  <option>English</option><option>Hindi</option><option>Marathi</option><option>Bilingual</option>
                </select>
              </div>

              {/* Reflection toggle */}
              <div className="mb-4 flex items-center gap-2">
                <input type="checkbox" checked={includeReflection} onChange={e => setIncludeReflection(e.target.checked)} className="rounded border-slate-300 cursor-pointer" />
                <label className="text-xs text-slate-600">{tr("lessonPlans.teacherReflection")}</label>
              </div>

              <button onClick={handleGenerate} disabled={generating || !classNum || !subject || !chapter} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                {generating ? (
                  <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{tr("lessonPlans.generatingAI")}</>
                ) : (
                  <>{icon("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z")}{tr("lessonPlans.generatePlan")}</>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            {generating ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{tr("lessonPlans.generatingTitle")}</h3>
                <p className="text-sm text-slate-500 mb-4">{tr("lessonPlans.generatingSubtitle")}</p>
                <div className="flex items-center justify-center gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
              </div>
            ) : plan ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">{plan.title}</h2>
                      <p className="text-purple-200 text-xs mt-1">Class {plan.classNum} &middot; {plan.subject} &middot; {plan.chapter}{plan.topic ? ` &middot; ${plan.topic}` : ""}</p>
                    </div>
                    {plan.cached && <span className="px-2 py-1 rounded-lg bg-white/20 text-[10px] font-bold">CACHED</span>}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-purple-200">
                    <span className="flex items-center gap-1">{icon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", "w-3.5 h-3.5")} {plan.duration}</span>
                    <span className="flex items-center gap-1">{icon("M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", "w-3.5 h-3.5")} {plan.teachingMethod}</span>
                    <span className="flex items-center gap-1">{icon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", "w-3.5 h-3.5")} {plan.lessonFlow.length} phases</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3 flex-wrap">
                  <button onClick={handlePDF} disabled={downloading} className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
                    {downloading ? <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : icon("M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-3.5 h-3.5")}
                    {downloading ? tr("worksheets.generatingPDF") : tr("worksheets.downloadPDF")}
                  </button>
                  <button onClick={() => { setPlan(null); setMsg(null); }} className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5">
                    {icon("M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", "w-3.5 h-3.5")} {tr("lessonPlans.newPlan")}
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Learning Objectives */}
                  <div>
                    <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">{icon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z")} {tr("lessonPlans.learningObjectives")}</h3>
                    <div className="space-y-2">
                      {plan.learningObjectives.map((o, i) => (
                        <div key={i} className="flex items-start gap-3 bg-purple-50 rounded-lg p-3">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                          <p className="text-sm text-slate-700">{o}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prerequisites & Materials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">{icon("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")} {tr("lessonPlans.prerequisites")}</h3>
                      <div className="flex flex-wrap gap-1.5">{plan.prerequisites.map((p, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">{p}</span>)}</div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">{icon("M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10")} {tr("lessonPlans.materialsNeeded")}</h3>
                      <div className="flex flex-wrap gap-1.5">{plan.materialsNeeded.map((m, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">{m}</span>)}</div>
                    </div>
                  </div>

                  {/* Lesson Flow Timeline */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">{icon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2")} {tr("lessonPlans.lessonFlow")}</h3>
                    <div className="space-y-4 relative">
                      <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-slate-200" />
                      {plan.lessonFlow.map((phase, i) => (
                        <div key={i} className="relative pl-12">
                          <div className={`absolute left-0 top-1 w-9 h-9 rounded-xl bg-gradient-to-br ${getPhaseGradient(phase.phase)} flex items-center justify-center text-white text-xs font-bold shadow-md z-10`}>{i+1}</div>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-purple-200 transition">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-slate-800">{phase.phase}</h4>
                              <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border">{phase.duration}</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-3">{phase.activity}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="bg-blue-50 rounded-lg p-2.5">
                                <p className="text-[10px] font-bold text-blue-600 mb-1">Teacher Actions</p>
                                <p className="text-[11px] text-blue-800">{phase.teacherActions}</p>
                              </div>
                              <div className="bg-emerald-50 rounded-lg p-2.5">
                                <p className="text-[10px] font-bold text-emerald-600 mb-1">Student Actions</p>
                                <p className="text-[11px] text-emerald-800">{phase.studentActions}</p>
                              </div>
                            </div>
                            {phase.tips && <div className="mt-2 bg-amber-50 rounded-lg p-2 border border-dashed border-amber-200"><p className="text-[10px] text-amber-700"><strong>Tip:</strong> {phase.tips}</p></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Differentiated Instruction */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">{icon("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z")} {tr("lessonPlans.differentiatedInstruction")}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3"><p className="text-[10px] font-bold text-orange-600 mb-1">{tr("lessonPlans.slowLearners")}</p><p className="text-[11px] text-orange-800">{plan.differentiatedInstruction.slowLearners}</p></div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3"><p className="text-[10px] font-bold text-green-600 mb-1">{tr("lessonPlans.advancedLearners")}</p><p className="text-[11px] text-green-800">{plan.differentiatedInstruction.advancedLearners}</p></div>
                      {plan.differentiatedInstruction.visualLearners && <div className="bg-blue-50 border border-blue-200 rounded-xl p-3"><p className="text-[10px] font-bold text-blue-600 mb-1">{tr("lessonPlans.visualLearners")}</p><p className="text-[11px] text-blue-800">{plan.differentiatedInstruction.visualLearners}</p></div>}
                      {plan.differentiatedInstruction.kinestheticLearners && <div className="bg-purple-50 border border-purple-200 rounded-xl p-3"><p className="text-[10px] font-bold text-purple-600 mb-1">{tr("lessonPlans.kinestheticLearners")}</p><p className="text-[11px] text-purple-800">{plan.differentiatedInstruction.kinestheticLearners}</p></div>}
                    </div>
                  </div>

                  {/* Board Work */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">{icon("M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z")} {tr("lessonPlans.boardWork")}</h3>
                    <div className="bg-slate-800 text-slate-200 rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed">{plan.boardWork}</div>
                  </div>

                  {/* Assessment */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">{icon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z")} {tr("lessonPlans.assessmentCriteria")}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {plan.assessmentCriteria.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg p-2.5"><span className="text-emerald-500 shrink-0 mt-0.5">{icon("M5 13l4 4L19 7", "w-3.5 h-3.5")}</span><p className="text-[11px] text-slate-700">{c}</p></div>
                      ))}
                    </div>
                  </div>

                  {/* Homework */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-2">{icon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")} {tr("lessonPlans.homework")}</h3>
                    <p className="text-sm text-amber-800">{plan.homework}</p>
                  </div>

                  {/* Cross-curricular */}
                  {plan.crossCurricularLinks && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-2">{icon("M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1")} {tr("lessonPlans.crossCurricularLinks")}</h3>
                      <p className="text-sm text-emerald-800">{plan.crossCurricularLinks}</p>
                    </div>
                  )}

                  {/* Teacher Reflection */}
                  {plan.teacherReflection && (
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-violet-700 mb-2 flex items-center gap-2">{icon("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z")} {tr("lessonPlans.teacherReflection")}</h3>
                      <p className="text-sm text-violet-800 italic">{plan.teacherReflection}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center mx-auto mb-5">
                  {icon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "w-10 h-10 text-purple-500")}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{tr("lessonPlans.createTitle")}</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{tr("lessonPlans.createSubtitle")}</p>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">{icon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "w-4 h-4")} {tr("lessonPlans.mscertAligned")}</span>
                  <span className="flex items-center gap-1.5">{icon("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", "w-4 h-4")} {tr("lessonPlans.differentiatedInstruction")}</span>
                  <span className="flex items-center gap-1.5">{icon("M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-4 h-4")} {tr("worksheets.pdfExport")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History */
        <div>
          {hSelected.size > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">{hSelected.size} {tr("worksheets.selected")}</span>
              <button onClick={handleDeleteHistory} className="py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5">
                {icon("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")} {tr("common.delete")}
              </button>
            </div>
          )}

          {hLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center text-slate-400">
              <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              {tr("common.loading")}...
            </div>
          ) : !history.length ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center">
              {icon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "w-12 h-12 text-slate-300 mx-auto mb-3")}
              <p className="text-slate-500 font-medium">{tr("lessonPlans.noHistory")}</p>
              <p className="text-slate-400 text-xs mt-1">{tr("lessonPlans.noHistoryHint")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(h => (
                <div key={h._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition flex items-center gap-4">
                  <input type="checkbox" checked={hSelected.has(h._id)} onChange={() => setHSelected(prev => { const n = new Set(prev); if (n.has(h._id)) n.delete(h._id); else n.add(h._id); return n; })} className="rounded border-slate-300 cursor-pointer shrink-0" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center shrink-0">
                    <span className="text-purple-700 text-xs font-bold">{h.classNum}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">{h.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{h.subject} &middot; {h.chapter} &middot; {h.teachingMethod} &middot; {h.duration}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 shrink-0">{new Date(h.createdAt).toLocaleDateString("en-IN")}</p>
                  <button onClick={() => loadFromHistory(h._id)} className="py-1.5 px-3 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition cursor-pointer shrink-0">{tr("common.view")}</button>
                </div>
              ))}
            </div>
          )}

          {hPag.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-xs text-slate-500">Page {hPag.page} of {hPag.totalPages}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => fetchHistory(hPag.page - 1)} disabled={hPag.page <= 1} className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer">&lt;</button>
                {Array.from({ length: Math.min(hPag.totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchHistory(p)} className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${p === hPag.page ? "bg-purple-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>
                ))}
                <button onClick={() => fetchHistory(hPag.page + 1)} disabled={hPag.page >= hPag.totalPages} className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer">&gt;</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
