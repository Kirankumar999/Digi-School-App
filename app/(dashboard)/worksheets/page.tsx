"use client";

import { useState, useEffect, useCallback } from "react";

interface SyllabusChapter {
  number: number;
  name: string;
  topics: { name: string; keywords: string[] }[];
}

interface Question {
  id: number;
  type: string;
  question: string;
  options?: string[];
  pairs?: { left: string; right: string }[];
  answer: string | boolean;
  explanation?: string;
  marks: number;
}

interface WorksheetResult {
  _id: string;
  worksheetId: string;
  title: string;
  instructions: string;
  questions: Question[];
  totalMarks: number;
  estimatedTime: string;
  classNum: number;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
  cached: boolean;
}

interface HistoryItem {
  _id: string;
  worksheetId: string;
  title: string;
  classNum: number;
  subject: string;
  chapter: string;
  difficulty: string;
  numQuestions: number;
  totalMarks: number;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type TabView = "generate" | "history";

const QUESTION_TYPES = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "short_answer", label: "Short Answer" },
  { value: "long_answer", label: "Long Answer" },
  { value: "fill_in_the_blank", label: "Fill in the Blank" },
  { value: "true_false", label: "True / False" },
  { value: "match_the_following", label: "Match the Following" },
];

const TYPE_ICONS: Record<string, string> = {
  mcq: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  short_answer: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  long_answer: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  fill_in_the_blank: "M4 6h16M4 10h16M4 14h16M4 18h16",
  true_false: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  match_the_following: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
};

const TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice",
  short_answer: "Short Answer",
  long_answer: "Long Answer",
  fill_in_the_blank: "Fill in the Blank",
  true_false: "True / False",
  match_the_following: "Match the Following",
};

export default function WorksheetsPage() {
  const [tab, setTab] = useState<TabView>("generate");

  // Form state
  const [classNum, setClassNum] = useState(0);
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionTypes, setQuestionTypes] = useState<string[]>(["mcq", "short_answer"]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [language, setLanguage] = useState("English");

  // Syllabus data for cascading dropdowns
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<SyllabusChapter[]>([]);
  const [topics, setTopics] = useState<{ name: string; keywords: string[] }[]>([]);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState<WorksheetResult | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyPagination, setHistoryPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<Set<string>>(new Set());

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cascading dropdowns
  useEffect(() => {
    if (!classNum) { setSubjects([]); setSubject(""); return; }
    fetch(`/api/worksheets/syllabus?class=${classNum}`)
      .then((r) => r.json())
      .then((d) => { setSubjects(d.subjects || []); setSubject(""); setChapter(""); setTopic(""); });
  }, [classNum]);

  useEffect(() => {
    if (!classNum || !subject) { setChapters([]); setChapter(""); return; }
    fetch(`/api/worksheets/syllabus?class=${classNum}&subject=${encodeURIComponent(subject)}`)
      .then((r) => r.json())
      .then((d) => { setChapters(d.chapters || []); setChapter(""); setTopic(""); });
  }, [classNum, subject]);

  useEffect(() => {
    if (!classNum || !subject || !chapter) { setTopics([]); setTopic(""); return; }
    fetch(`/api/worksheets/syllabus?class=${classNum}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`)
      .then((r) => r.json())
      .then((d) => { setTopics(d.topics || []); setTopic(""); });
  }, [classNum, subject, chapter]);

  const toggleType = (t: string) => {
    setQuestionTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleGenerate = async () => {
    if (!classNum || !subject || !chapter || questionTypes.length === 0) {
      setMessage({ type: "error", text: "Please select class, subject, chapter, and at least one question type" });
      return;
    }

    setGenerating(true);
    setMessage(null);
    setWorksheet(null);

    try {
      const res = await fetch("/api/worksheets/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classNum, subject, chapter,
          topic: topic || undefined,
          difficulty, questionTypes, numQuestions,
          includeAnswerKey, language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Generation failed" });
        setGenerating(false);
        return;
      }

      setWorksheet({ ...data.worksheet, cached: data.cached });
      setMessage({
        type: "success",
        text: data.cached
          ? "Worksheet loaded from cache (same parameters used today)"
          : "Worksheet generated successfully!",
      });
    } catch {
      setMessage({ type: "error", text: "Network error — please try again" });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!worksheet?._id) return;
    setDownloading(true);

    try {
      const res = await fetch(`/api/worksheets/${worksheet._id}/pdf`);
      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "PDF generation failed" });
        setDownloading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${worksheet.worksheetId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage({ type: "error", text: "Failed to download PDF" });
    } finally {
      setDownloading(false);
    }
  };

  // History
  const fetchHistory = useCallback(async (page = 1) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/worksheets?page=${page}&limit=10`);
      const data = await res.json();
      if (res.ok) {
        setHistory(data.worksheets);
        setHistoryPagination(data.pagination);
      }
    } catch {
      /* ignore */
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab, fetchHistory]);

  const handleDeleteHistory = async () => {
    if (selectedHistory.size === 0) return;
    if (!confirm(`Delete ${selectedHistory.size} worksheet(s)?`)) return;

    const res = await fetch("/api/worksheets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedHistory) }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: data.message });
      setSelectedHistory(new Set());
      fetchHistory(historyPagination.page);
    }
  };

  const loadWorksheetFromHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/worksheets/${id}`);
      const data = await res.json();
      if (res.ok) {
        setWorksheet({
          ...data.worksheet,
          cached: false,
        });
        setTab("generate");
        setShowAnswers(false);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load worksheet" });
    }
  };

  const svgIcon = (d: string, cls = "w-4 h-4") => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {svgIcon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-5 h-5")}
            Smart Worksheet Generator
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">AI-powered, MSCERT-aligned worksheet creation</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1">
          {(["generate", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t === "generate" ? "Generate" : "History"}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
          {svgIcon(message.type === "success" ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto text-current opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
        </div>
      )}

      {tab === "generate" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                {svgIcon("M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4")}
                Configuration
              </h2>

              {/* Class */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Class *</label>
                <select
                  value={classNum}
                  onChange={(e) => setClassNum(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50 focus:border-violet-400 cursor-pointer bg-slate-50"
                >
                  <option value={0}>Select Class</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={subjects.length === 0}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50 focus:border-violet-400 cursor-pointer bg-slate-50 disabled:opacity-50"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Chapter */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chapter *</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  disabled={chapters.length === 0}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50 focus:border-violet-400 cursor-pointer bg-slate-50 disabled:opacity-50"
                >
                  <option value="">Select Chapter</option>
                  {chapters.map((c) => (
                    <option key={c.number} value={c.name}>Ch {c.number}: {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Topic (optional) */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Topic <span className="text-slate-400 font-normal">(optional)</span></label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={topics.length === 0}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50 focus:border-violet-400 cursor-pointer bg-slate-50 disabled:opacity-50"
                >
                  <option value="">All Topics</option>
                  {topics.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>

              {/* Difficulty */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Difficulty *</label>
                <div className="flex gap-2">
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        difficulty === d
                          ? d === "Easy" ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                            : d === "Medium" ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                            : "bg-rose-100 text-rose-700 ring-1 ring-rose-300"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Question Types *</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUESTION_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleType(value)}
                      className={`py-2 px-2.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        questionTypes.includes(value)
                          ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {svgIcon(TYPE_ICONS[value] || "M4 6h16M4 12h16M4 18h16", "w-3 h-3 shrink-0")}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Number of Questions</label>
                <div className="flex gap-1.5">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumQuestions(n)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${numQuestions === n ? "bg-violet-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300/50 focus:border-violet-400 cursor-pointer bg-slate-50"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Bilingual</option>
                </select>
              </div>

              {/* Include Answer Key */}
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeAnswerKey}
                  onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                  className="rounded border-slate-300 cursor-pointer"
                />
                <label className="text-xs text-slate-600">Include answer key in PDF</label>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !classNum || !subject || !chapter || questionTypes.length === 0}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating with AI...
                  </>
                ) : (
                  <>
                    {svgIcon("M13 10V3L4 14h7v7l9-11h-7z")}
                    Generate Worksheet
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-3">
            {generating ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-violet-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Generating Your Worksheet</h3>
                <p className="text-sm text-slate-500 mb-4">AI is creating curriculum-accurate questions...</p>
                <div className="flex items-center justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            ) : worksheet ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Worksheet header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">{worksheet.title}</h2>
                      <p className="text-violet-200 text-xs mt-1">
                        Class {worksheet.classNum} &middot; {worksheet.subject} &middot; {worksheet.chapter}
                        {worksheet.topic ? ` &middot; ${worksheet.topic}` : ""}
                      </p>
                    </div>
                    {worksheet.cached && (
                      <span className="px-2 py-1 rounded-lg bg-white/20 text-[10px] font-bold">CACHED</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-violet-200">
                    <span className="flex items-center gap-1">{svgIcon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", "w-3.5 h-3.5")} {worksheet.estimatedTime}</span>
                    <span className="flex items-center gap-1">{svgIcon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", "w-3.5 h-3.5")} {worksheet.totalMarks} marks</span>
                    <span className="flex items-center gap-1">{svgIcon("M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "w-3.5 h-3.5")} {worksheet.questions.length} questions</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      worksheet.difficulty === "Easy" ? "bg-emerald-400/30" : worksheet.difficulty === "Medium" ? "bg-amber-400/30" : "bg-rose-400/30"
                    }`}>{worksheet.difficulty}</span>
                  </div>
                </div>

                {/* Actions bar */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${showAnswers ? "bg-violet-100 text-violet-700" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                  >
                    {svgIcon(showAnswers ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z", "w-3.5 h-3.5")}
                    {showAnswers ? "Hide Answers" : "Show Answers"}
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {downloading ? (
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : svgIcon("M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-3.5 h-3.5")}
                    {downloading ? "Generating PDF..." : "Download PDF"}
                  </button>
                  <button
                    onClick={() => { setWorksheet(null); setMessage(null); }}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                  >
                    {svgIcon("M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", "w-3.5 h-3.5")}
                    New Worksheet
                  </button>
                </div>

                {/* Instructions */}
                {worksheet.instructions && (
                  <div className="mx-6 mt-4 p-3 rounded-xl bg-violet-50 border border-violet-100 text-xs text-violet-700">
                    <strong>Instructions:</strong> {worksheet.instructions}
                  </div>
                )}

                {/* Questions */}
                <div className="p-6 space-y-4">
                  {worksheet.questions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-violet-200 transition">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-500 border border-slate-200 mb-1.5">{TYPE_LABELS[q.type] || q.type}</span>
                            <p className="text-sm text-slate-800 font-medium">{q.question}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">[{q.marks} mark{q.marks > 1 ? "s" : ""}]</span>
                      </div>

                      {q.type === "mcq" && q.options && (
                        <div className="grid grid-cols-2 gap-1.5 ml-9 mt-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`py-1.5 px-3 rounded-lg text-xs ${showAnswers && opt === q.answer ? "bg-emerald-100 text-emerald-700 font-semibold ring-1 ring-emerald-300" : "bg-white text-slate-600 border border-slate-200"}`}>
                              ({String.fromCharCode(97 + i)}) {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === "true_false" && (
                        <div className="flex gap-2 ml-9 mt-2">
                          {[true, false].map((val) => (
                            <div key={String(val)} className={`py-1.5 px-4 rounded-lg text-xs ${showAnswers && q.answer === val ? "bg-emerald-100 text-emerald-700 font-semibold ring-1 ring-emerald-300" : "bg-white text-slate-600 border border-slate-200"}`}>
                              {val ? "True" : "False"}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === "match_the_following" && q.pairs && (
                        <div className="ml-9 mt-2 overflow-hidden rounded-lg border border-slate-200">
                          <table className="w-full text-xs">
                            <thead><tr className="bg-slate-100"><th className="text-left py-1.5 px-3 font-semibold text-slate-600">Column A</th><th className="text-left py-1.5 px-3 font-semibold text-slate-600">Column B</th></tr></thead>
                            <tbody>
                              {q.pairs.map((p, i) => (
                                <tr key={i} className="border-t border-slate-100">
                                  <td className="py-1.5 px-3 text-slate-700">{i + 1}. {p.left}</td>
                                  <td className="py-1.5 px-3 text-slate-700">{showAnswers ? p.right : "___"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {showAnswers && (
                        <div className="ml-9 mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                          {q.type !== "mcq" && q.type !== "true_false" && q.type !== "match_the_following" && (
                            <p className="text-xs text-emerald-700"><strong>Answer:</strong> {String(q.answer)}</p>
                          )}
                          {q.explanation && (
                            <p className="text-[11px] text-emerald-600 mt-1"><em>{q.explanation}</em></p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-5">
                  {svgIcon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-10 h-10 text-violet-500")}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Create Your Worksheet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Select class, subject, and chapter from the MSCERT syllabus, choose your preferences, and let AI generate a curriculum-aligned worksheet.
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">{svgIcon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "w-4 h-4")} MSCERT Aligned</span>
                  <span className="flex items-center gap-1.5">{svgIcon("M13 10V3L4 14h7v7l9-11h-7z", "w-4 h-4")} AI Powered</span>
                  <span className="flex items-center gap-1.5">{svgIcon("M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", "w-4 h-4")} PDF Export</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Tab */
        <div>
          {selectedHistory.size > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">{selectedHistory.size} selected</span>
              <button onClick={handleDeleteHistory} className="py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5">
                {svgIcon("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")}
                Delete
              </button>
            </div>
          )}

          {historyLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center text-slate-400">
              <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center">
              {svgIcon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", "w-12 h-12 text-slate-300 mx-auto mb-3")}
              <p className="text-slate-500 font-medium">No worksheets generated yet</p>
              <p className="text-slate-400 text-xs mt-1">Switch to the Generate tab to create your first worksheet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedHistory.has(h._id)}
                    onChange={() => setSelectedHistory((prev) => {
                      const next = new Set(prev);
                      if (next.has(h._id)) next.delete(h._id); else next.add(h._id);
                      return next;
                    })}
                    className="rounded border-slate-300 cursor-pointer shrink-0"
                  />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shrink-0">
                    <span className="text-violet-700 text-xs font-bold">{h.classNum}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">{h.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {h.subject} &middot; {h.chapter} &middot; {h.numQuestions} questions &middot; {h.totalMarks} marks
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      h.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600" : h.difficulty === "Medium" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    }`}>{h.difficulty}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(h.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <button
                    onClick={() => loadWorksheetFromHistory(h._id)}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition cursor-pointer shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {historyPagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-xs text-slate-500">
                Page {historyPagination.page} of {historyPagination.totalPages} ({historyPagination.total} worksheets)
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fetchHistory(historyPagination.page - 1)}
                  disabled={historyPagination.page <= 1}
                  className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                >&lt;</button>
                {Array.from({ length: Math.min(historyPagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchHistory(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${p === historyPagination.page ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                  >{p}</button>
                ))}
                <button
                  onClick={() => fetchHistory(historyPagination.page + 1)}
                  disabled={historyPagination.page >= historyPagination.totalPages}
                  className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                >&gt;</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
