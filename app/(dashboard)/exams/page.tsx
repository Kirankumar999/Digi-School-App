"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface ExamSubject { name: string; maxMarks: number; passingMarks: number; date: string; }
interface Exam { _id: string; examId: string; name: string; type: string; grade: string; section: string; subjects: ExamSubject[]; startDate: string; endDate: string; status: string; }
interface MarkEntry { studentId: string; studentName: string; marks: { subject: string; obtained: number; maxMarks: number; passingMarks: number }[]; }
interface ExamResultItem { _id: string; studentName: string; totalObtained: number; totalMax: number; percentage: number; overallGrade: string; rank: number; status: string; marks: { subject: string; obtained: number; maxMarks: number; grade: string; passed: boolean }[]; }

const GRADES = ["1","2","3","4","5","6","7","8","9","10"];
const EXAM_TYPES = ["Unit Test", "Semester", "Annual", "Practice"];

export default function ExamsPage() {
  const { t, tGrade, tSubject } = useLocale();
  const [view, setView] = useState<"list" | "create" | "marks" | "results">("list");
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);
  const [results, setResults] = useState<ExamResultItem[]>([]);

  const [eName, setEName] = useState("");
  const [eType, setEType] = useState("Unit Test");
  const [eGrade, setEGrade] = useState("");
  const [eSection, setESection] = useState("");
  const [eSubjects, setESubjects] = useState<ExamSubject[]>([{ name: "", maxMarks: 100, passingMarks: 35, date: "" }]);
  const [eStartDate, setEStartDate] = useState("");
  const [eEndDate, setEEndDate] = useState("");

  const loadExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exams?limit=50");
      const data = await res.json();
      setExams(data.exams || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadExams(); }, [loadExams]);

  const createExam = async () => {
    if (!eName || !eGrade) { setMsg(t("common.fillRequired")); return; }
    try {
      const res = await fetch("/api/exams", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: eName, type: eType, grade: eGrade, section: eSection, subjects: eSubjects, startDate: eStartDate, endDate: eEndDate }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("exams.examCreated"));
      setView("list"); loadExams();
      setEName(""); setESubjects([{ name: "", maxMarks: 100, passingMarks: 35, date: "" }]);
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const openMarks = async (exam: Exam) => {
    setSelectedExam(exam);
    setView("marks");
    try {
      const res = await fetch(`/api/attendance/students?classGrade=${exam.grade}&section=${exam.section || "A"}`);
      const data = await res.json();
      const entries = (data.students || []).map((s: { _id: string; firstName: string; lastName: string }) => ({
        studentId: s._id,
        studentName: `${s.firstName} ${s.lastName}`,
        marks: exam.subjects.map((sub) => ({ subject: sub.name, obtained: 0, maxMarks: sub.maxMarks, passingMarks: sub.passingMarks })),
      }));
      setMarkEntries(entries);
    } catch { setMsg(t("common.failedToLoad")); }
  };

  const saveMarks = async () => {
    if (!selectedExam || markEntries.length === 0) return;
    try {
      const res = await fetch("/api/exams/results", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: markEntries.map((e) => ({
            examId: selectedExam.examId, examName: selectedExam.name,
            studentId: e.studentId, studentName: e.studentName,
            grade: selectedExam.grade, section: selectedExam.section,
            marks: e.marks,
          })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("exams.marksSaved")); setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const viewResults = async (exam: Exam) => {
    setSelectedExam(exam);
    setView("results");
    try {
      const res = await fetch(`/api/exams/results?examId=${exam.examId}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch { setMsg(t("common.failedToLoad")); }
  };

  const isSuccess = msg === t("exams.examCreated") || msg === t("exams.marksSaved");

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal to-violet-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            {t("exams.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("exams.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "list" ? "bg-royal text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("exams.examList")}</button>
          <button onClick={() => setView("create")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "create" ? "bg-royal text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("exams.createExam")}</button>
        </div>
      </div>

      {msg && <div className={`px-4 py-3 rounded-lg text-sm font-medium ${isSuccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

      {view === "create" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("exams.createExam")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("exams.examName")} *</label>
              <input value={eName} onChange={(e) => setEName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-royal/20 focus:border-royal outline-none" placeholder={t("exams.examNamePlaceholder")} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("exams.type")}</label>
              <select value={eType} onChange={(e) => setEType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-royal/20 outline-none">
                {EXAM_TYPES.map((et) => <option key={et} value={et}>{t(`exams.examTypes.${et}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.class")} *</label>
              <select value={eGrade} onChange={(e) => setEGrade(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                <option value="">{t("common.select")}</option>
                {GRADES.map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.section")}</label>
              <input value={eSection} onChange={(e) => setESection(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" placeholder="A" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("exams.startDate")}</label>
              <input type="date" value={eStartDate} onChange={(e) => setEStartDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("exams.endDate")}</label>
              <input type="date" value={eEndDate} onChange={(e) => setEEndDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
          </div>
          <h4 className="text-sm font-semibold text-slate-600 mb-2">{t("exams.subjectsLabel")}</h4>
          <div className="space-y-2 mb-4">
            {eSubjects.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={s.name} onChange={(e) => { const n = [...eSubjects]; n[i].name = e.target.value; setESubjects(n); }} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={t("exams.subjectName")} />
                <input type="number" value={s.maxMarks} onChange={(e) => { const n = [...eSubjects]; n[i].maxMarks = Number(e.target.value); setESubjects(n); }} className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={t("exams.maxMarks")} />
                <input type="number" value={s.passingMarks} onChange={(e) => { const n = [...eSubjects]; n[i].passingMarks = Number(e.target.value); setESubjects(n); }} className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={t("exams.passingMarks")} />
                <button onClick={() => setESubjects(eSubjects.filter((_, j) => j !== i))} className="text-red-500 text-sm cursor-pointer">{t("common.remove")}</button>
              </div>
            ))}
            <button onClick={() => setESubjects([...eSubjects, { name: "", maxMarks: 100, passingMarks: 35, date: "" }])} className="text-royal text-sm font-medium cursor-pointer">{t("exams.addSubject")}</button>
          </div>
          <button onClick={createExam} className="px-6 py-2.5 bg-gradient-to-r from-royal to-violet-500 text-white rounded-lg font-medium text-sm cursor-pointer">{t("exams.createExam")}</button>
        </div>
      )}

      {view === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-royal border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : exams.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <div key={exam._id} className="px-4 py-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{exam.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t(`exams.examTypes.${exam.type}`)} | {tGrade(exam.grade)}{exam.section ? `-${exam.section}` : ""} | {exam.subjects.length} {t("exams.subjectsLabel").toLowerCase()}
                    </p>
                    {exam.startDate && <p className="text-xs text-slate-400 mt-0.5">{exam.startDate}{exam.endDate ? ` → ${exam.endDate}` : ""}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${exam.status === "Completed" ? "bg-emerald-100 text-emerald-700" : exam.status === "Ongoing" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                      {t(`exams.examStatus.${exam.status}`)}
                    </span>
                    <button onClick={() => openMarks(exam)} className="px-3 py-1.5 bg-royal/10 text-royal rounded-lg text-xs font-medium cursor-pointer hover:bg-royal/20">{t("exams.enterMarks")}</button>
                    <button onClick={() => viewResults(exam)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-emerald-100">{t("exams.results")}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center"><p className="text-slate-500 text-sm">{t("exams.noExams")}</p></div>
          )}
        </div>
      )}

      {view === "marks" && selectedExam && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">{selectedExam.name} — {t("exams.enterMarks")}</h3>
              <p className="text-xs text-slate-500">{tGrade(selectedExam.grade)}{selectedExam.section ? `-${selectedExam.section}` : ""}</p>
            </div>
            <button onClick={() => setView("list")} className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">{t("common.backToList")}</button>
          </div>
          {markEntries.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">#</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{t("common.name")}</th>
                      {selectedExam.subjects.map((s) => (
                        <th key={s.name} className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{tSubject(s.name)}<br /><span className="font-normal">({s.maxMarks})</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {markEntries.map((entry, idx) => (
                      <tr key={entry.studentId} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-xs text-slate-400">{idx + 1}</td>
                        <td className="px-3 py-2 text-sm font-medium text-slate-700">{entry.studentName}</td>
                        {entry.marks.map((m, mi) => (
                          <td key={m.subject} className="px-3 py-2 text-center">
                            <input
                              type="number" min={0} max={m.maxMarks} value={m.obtained}
                              onChange={(e) => {
                                const newEntries = [...markEntries];
                                newEntries[idx].marks[mi].obtained = Number(e.target.value);
                                setMarkEntries(newEntries);
                              }}
                              className="w-16 px-2 py-1 rounded border border-slate-200 text-sm text-center outline-none focus:border-royal"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100">
                <button onClick={saveMarks} className="px-6 py-2.5 bg-gradient-to-r from-royal to-violet-500 text-white rounded-lg font-medium text-sm cursor-pointer">{t("exams.saveAllMarks")}</button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center"><p className="text-slate-500 text-sm">{t("exams.noStudentsForClass")}</p></div>
          )}
        </div>
      )}

      {view === "results" && selectedExam && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">{selectedExam.name} — {t("exams.results")}</h3>
              <p className="text-xs text-slate-500">{tGrade(selectedExam.grade)}</p>
            </div>
            <button onClick={() => setView("list")} className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">{t("common.backToList")}</button>
          </div>
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{t("exams.rank")}</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{t("common.name")}</th>
                    {results[0]?.marks.map((m) => <th key={m.subject} className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{tSubject(m.subject)}</th>)}
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{t("common.total")}</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{t("exams.percentage")}</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{t("exams.overallGrade")}</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-slate-500">{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center font-bold text-slate-700">{r.rank}</td>
                      <td className="px-3 py-2 font-medium text-slate-700">{r.studentName}</td>
                      {r.marks.map((m) => (
                        <td key={m.subject} className={`px-3 py-2 text-center ${m.passed ? "text-slate-600" : "text-red-600 font-bold"}`}>{m.obtained}</td>
                      ))}
                      <td className="px-3 py-2 text-center font-semibold text-slate-700">{r.totalObtained}/{r.totalMax}</td>
                      <td className="px-3 py-2 text-center font-semibold text-royal">{r.percentage}%</td>
                      <td className="px-3 py-2 text-center font-bold">{r.overallGrade}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "Pass" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{r.status === "Pass" ? t("exams.pass") : t("exams.fail")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center"><p className="text-slate-500 text-sm">{t("exams.noResultsYet")}</p></div>
          )}
        </div>
      )}
    </div>
  );
}
