"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Doubt {
  _id: string; question: string; answer: string; subject: string; chapter: string;
  classGrade: string; language: string; status: string; studentName: string; createdAt: string;
}

const GRADES = ["1","2","3","4","5","6","7","8","9","10"];
const SUBJECTS = ["Mathematics", "Marathi", "English", "Hindi", "EVS", "Science", "Social Science"];
const LANGUAGES = ["English", "Marathi", "Hindi"];

export default function DoubtSolverPage() {
  const { t, tGrade, tSubject } = useLocale();
  const [view, setView] = useState<"ask" | "history">("ask");
  const [question, setQuestion] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState<Doubt[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);

  const loadHistory = useCallback(async () => {
    setHistLoading(true);
    try {
      const res = await fetch("/api/doubt-solver?limit=30");
      const data = await res.json();
      setHistory(data.questions || []);
    } catch { /* ignore */ }
    setHistLoading(false);
  }, []);

  useEffect(() => { if (view === "history") loadHistory(); }, [view, loadHistory]);

  const askQuestion = async () => {
    if (!question.trim()) { setMsg(t("doubtSolver.enterQuestion")); return; }
    setLoading(true); setAnswer(""); setMsg("");
    try {
      const res = await fetch("/api/doubt-solver", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, classGrade, subject, chapter, language, studentName: "Student" }),
      });
      const data = await res.json();
      if (data.doubt?.answer) {
        setAnswer(data.doubt.answer);
      } else {
        setMsg(t("doubtSolver.couldNotGenerate"));
      }
    } catch {
      setMsg(t("doubtSolver.failedToGetAnswer"));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            {t("doubtSolver.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("doubtSolver.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("ask")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "ask" ? "bg-violet-500 text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("doubtSolver.askQuestion")}</button>
          <button onClick={() => setView("history")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "history" ? "bg-violet-500 text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("doubtSolver.history")}</button>
        </div>
      </div>

      {msg && <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">{msg}</div>}

      {view === "ask" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.class")}</label>
                <select value={classGrade} onChange={(e) => setClassGrade(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                  <option value="">{t("doubtSolver.any")}</option>
                  {GRADES.map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.subject")}</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                  <option value="">{t("doubtSolver.any")}</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{tSubject(s)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("doubtSolver.chapter")}</label>
                <input value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" placeholder={t("doubtSolver.chapterOptional")} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("doubtSolver.language")}</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                  {LANGUAGES.map((l) => <option key={l} value={l}>{t(`languages.${l}`)}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("doubtSolver.askQuestion")}</label>
              <textarea
                value={question} onChange={(e) => setQuestion(e.target.value)} rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                placeholder={t("doubtSolver.typeQuestion")}
              />
            </div>
            <button onClick={askQuestion} disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium text-sm cursor-pointer disabled:opacity-50 hover:shadow-lg transition">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("doubtSolver.thinking")}
                </span>
              ) : t("doubtSolver.getAnswer")}
            </button>
          </div>

          {answer && (
            <div className="bg-white rounded-xl shadow-sm border border-violet-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-violet-700">{t("doubtSolver.aiAnswer")}</h3>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">{answer}</div>
            </div>
          )}
        </div>
      )}

      {view === "history" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {histLoading ? (
            <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : selectedDoubt ? (
            <div className="p-6">
              <button onClick={() => setSelectedDoubt(null)} className="text-sm text-violet-500 cursor-pointer mb-3 hover:underline">{t("common.backToList")}</button>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500">{tSubject(selectedDoubt.subject) || t("doubtSolver.general")} | {tGrade(selectedDoubt.classGrade)} | {t(`languages.${selectedDoubt.language}`)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedDoubt.status === "Answered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {selectedDoubt.status === "Answered" ? t("doubtSolver.answered") : t("doubtSolver.pending")}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-3">{selectedDoubt.question}</h3>
                {selectedDoubt.answer && (
                  <div className="bg-violet-50 rounded-lg p-4 border border-violet-100">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedDoubt.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ) : history.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {history.map((d) => (
                <button key={d._id} onClick={() => setSelectedDoubt(d)} className="w-full text-left px-4 py-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700 truncate flex-1">{d.question}</p>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${d.status === "Answered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {d.status === "Answered" ? t("doubtSolver.answered") : t("doubtSolver.pending")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tSubject(d.subject) || t("doubtSolver.general")} | {t(`languages.${d.language}`)} | {new Date(d.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center"><p className="text-slate-500 text-sm">{t("doubtSolver.noQuestionsYet")}</p></div>
          )}
        </div>
      )}
    </div>
  );
}
