"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface StudentOption { _id: string; studentId: string; firstName: string; lastName: string; grade: string; section: string; profilePicture?: string }

interface QuestionEval { questionNumber: number; questionText: string; studentAnswer: string; correctAnswer: string; marksAwarded: number; maxMarks: number; feedback: string; isCorrect: boolean }

interface EvalResult {
  _id: string; testResultId: string; testName: string; subject: string;
  totalMarks: number; marksObtained: number; percentage: number; grade: string;
  questions: QuestionEval[]; overallFeedback: string;
  strengths: string[]; areasToImprove: string[];
  studentName: string; studentGrade: string; classNum: number; chapter: string;
}

interface HistoryItem {
  _id: string; testResultId: string; testName: string; subject: string;
  studentName: string; studentGrade: string; totalMarks: number;
  marksObtained: number; percentage: number; grade: string; createdAt: string;
}

interface Pagination { total: number; page: number; limit: number; totalPages: number }

type TabView = "evaluate" | "history";

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-emerald-100 text-emerald-700 border-emerald-300",
  A: "bg-emerald-50 text-emerald-600 border-emerald-200",
  "B+": "bg-sky-100 text-sky-700 border-sky-300",
  B: "bg-sky-50 text-sky-600 border-sky-200",
  C: "bg-amber-100 text-amber-700 border-amber-300",
  D: "bg-orange-100 text-orange-700 border-orange-300",
  F: "bg-rose-100 text-rose-700 border-rose-300",
};

const svg = (d: string, cls = "w-4 h-4") => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

export default function TestsPage() {
  const [tab, setTab] = useState<TabView>("evaluate");

  // Student search
  const [studentSearch, setStudentSearch] = useState("");
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Form
  const [testName, setTestName] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [classNum, setClassNum] = useState(0);
  const [totalMarks, setTotalMarks] = useState(20);
  const [language, setLanguage] = useState("English");

  // Image
  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Evaluation
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hPag, setHPag] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [hLoading, setHLoading] = useState(false);
  const [hSelected, setHSelected] = useState<Set<string>>(new Set());

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Student search
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
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectStudent = (s: StudentOption) => {
    setSelectedStudent(s);
    setStudentSearch(`${s.firstName} ${s.lastName}`);
    setClassNum(parseInt(s.grade) || 0);
    setShowDropdown(false);
  };

  const compressImage = (dataUrl: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const c = document.createElement("canvas");
        c.width = img.width * scale;
        c.height = img.height * scale;
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    });
  };

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMsg({ type: "error", text: "Please upload an image file" }); return; }
    if (file.size > 10 * 1024 * 1024) { setMsg({ type: "error", text: "Image must be under 10MB" }); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const compressed = await compressImage(dataUrl);
      setImagePreview(compressed);
      setImageBase64(compressed);
    };
    reader.readAsDataURL(file);
  };

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; }
      setUseCamera(true);
    } catch { setMsg({ type: "error", text: "Camera access denied" }); }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL("image/jpeg", 0.85);
    const compressed = await compressImage(dataUrl);
    setImagePreview(compressed);
    setImageBase64(compressed);
    stopCamera();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setUseCamera(false);
  };

  const handleEvaluate = async () => {
    if (!selectedStudent) { setMsg({ type: "error", text: "Select a student first" }); return; }
    if (!imageBase64) { setMsg({ type: "error", text: "Upload or capture an answer sheet image" }); return; }
    if (!testName || !subject || !classNum) { setMsg({ type: "error", text: "Fill in test name, subject, and class" }); return; }

    setEvaluating(true); setMsg(null); setResult(null);
    try {
      const res = await fetch("/api/tests/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent._id, testName, subject, chapter: chapter || undefined, classNum, totalMarks, imageBase64, language }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || "Evaluation failed" }); return; }
      setResult(data.testResult);
      setMsg({ type: "success", text: "Answer sheet evaluated successfully!" });
    } catch { setMsg({ type: "error", text: "Network error" }); }
    finally { setEvaluating(false); }
  };

  // History
  const fetchHistory = useCallback(async (page = 1) => {
    setHLoading(true);
    try {
      const res = await fetch(`/api/tests?page=${page}&limit=20`);
      const d = await res.json();
      if (res.ok) { setHistory(d.testResults); setHPag(d.pagination); }
    } catch { /* ignore */ }
    finally { setHLoading(false); }
  }, []);

  useEffect(() => { if (tab === "history") fetchHistory(); }, [tab, fetchHistory]);

  const deleteSelected = async () => {
    if (!hSelected.size || !confirm(`Delete ${hSelected.size} result(s)?`)) return;
    const res = await fetch("/api/tests", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...hSelected] }) });
    if (res.ok) { setHSelected(new Set()); fetchHistory(hPag.page); }
  };

  const loadResult = async (id: string) => {
    try {
      const res = await fetch(`/api/tests/${id}`);
      const d = await res.json();
      if (res.ok) { setResult(d.testResult); setTab("evaluate"); }
    } catch { setMsg({ type: "error", text: "Failed to load" }); }
  };

  const resetForm = () => {
    setResult(null); setImagePreview(""); setImageBase64("");
    setMsg(null);
  };

  const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {svg("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", "w-5 h-5")}
            AI Answer Sheet Evaluator
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Upload a handwritten answer sheet — AI reads, evaluates &amp; scores</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1">
          {(["evaluate", "history"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "evaluate" ? "Evaluate" : "Results History"}
            </button>
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

      {tab === "evaluate" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Student Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                {svg("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")}
                Select Student
              </h2>

              {selectedStudent ? (
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200 mb-3">
                  {selectedStudent.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedStudent.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {initials(`${selectedStudent.firstName} ${selectedStudent.lastName}`)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                    <p className="text-xs text-slate-500">ID: {selectedStudent.studentId} &middot; Grade {selectedStudent.grade}{selectedStudent.section ? `-${selectedStudent.section}` : ""}</p>
                  </div>
                  <button onClick={() => { setSelectedStudent(null); setStudentSearch(""); setClassNum(0); }} className="p-1.5 rounded-lg hover:bg-teal-100 text-teal-600 cursor-pointer">
                    {svg("M6 18L18 6M6 6l12 12", "w-3.5 h-3.5")}
                  </button>
                </div>
              ) : (
                <div ref={searchRef} className="relative mb-3">
                  <input
                    type="text" value={studentSearch}
                    onChange={(e) => { setStudentSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search student by name or ID..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-teal-400 bg-slate-50"
                  />
                  {showDropdown && studentOptions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
                      {studentOptions.map((s) => (
                        <button key={s._id} onClick={() => selectStudent(s)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition text-left cursor-pointer">
                          {s.profilePicture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                              {initials(`${s.firstName} ${s.lastName}`)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-700">{s.firstName} {s.lastName}</p>
                            <p className="text-[10px] text-slate-400">ID: {s.studentId} &middot; Grade {s.grade}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Test Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                {svg("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")}
                Test Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Test Name *</label>
                  <input value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="e.g. Unit Test 1, Mid-Term Exam" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 bg-slate-50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mathematics" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Class *</label>
                    <select value={classNum} onChange={(e) => setClassNum(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 cursor-pointer bg-slate-50">
                      <option value={0}>Select</option>
                      {[1,2,3,4,5,6,7,8].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chapter <span className="text-slate-400 font-normal">(optional)</span></label>
                    <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Fractions" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Marks *</label>
                    <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} min={1} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 bg-slate-50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300/50 cursor-pointer bg-slate-50">
                    <option>English</option><option>Hindi</option><option>Marathi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                {svg("M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z")}
                Answer Sheet Image
              </h2>

              {useCamera ? (
                <div className="space-y-3">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl border border-slate-200" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-2">
                    <button onClick={capturePhoto} className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:brightness-110">
                      {svg("M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z")} Capture
                    </button>
                    <button onClick={stopCamera} className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              ) : imagePreview ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Answer sheet" className="w-full rounded-xl border border-slate-200 max-h-64 object-contain bg-slate-50" />
                  <button onClick={() => { setImagePreview(""); setImageBase64(""); }} className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer font-medium">Remove image</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block w-full py-8 border-2 border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    {svg("M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", "w-8 h-8 text-slate-300 mx-auto mb-2")}
                    <p className="text-sm text-slate-500 font-medium">Click to upload answer sheet</p>
                    <p className="text-xs text-slate-400 mt-1">JPEG, PNG up to 10MB</p>
                  </label>
                  <button onClick={startCamera} className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 flex items-center justify-center gap-2">
                    {svg("M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z")}
                    Use Camera
                  </button>
                </div>
              )}
            </div>

            {/* Evaluate Button */}
            <button onClick={handleEvaluate} disabled={evaluating || !selectedStudent || !imageBase64 || !testName || !subject || !classNum} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
              {evaluating ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Evaluating Answer Sheet...</>
              ) : (
                <>{svg("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4")}Evaluate with AI</>
              )}
            </button>
          </div>

          {/* Right: Result */}
          <div className="lg:col-span-3">
            {evaluating ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Reading Answer Sheet</h3>
                <p className="text-sm text-slate-500 mb-4">AI is reading handwriting, evaluating answers &amp; scoring...</p>
                <div className="flex items-center justify-center gap-1">{[0,1,2].map((i) => <div key={i} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
              </div>
            ) : result ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Score Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-200 text-xs mb-1">{result.studentName} &middot; Class {result.classNum}{result.chapter ? ` &middot; ${result.chapter}` : ""}</p>
                      <h2 className="text-lg font-bold">{result.testName}</h2>
                      <p className="text-teal-200 text-xs mt-1">{result.subject}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                        <div>
                          <p className="text-2xl font-black">{result.marksObtained}</p>
                          <p className="text-[10px] text-teal-200">/ {result.totalMarks}</p>
                        </div>
                      </div>
                      <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold border ${GRADE_COLORS[result.grade] || "bg-slate-100 text-slate-600 border-slate-200"}`}>{result.grade} — {result.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <button onClick={resetForm} className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5">
                    {svg("M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", "w-3.5 h-3.5")} Evaluate Another
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Overall Feedback */}
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-teal-700 mb-2 flex items-center gap-2">{svg("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z")} Overall Feedback</h3>
                    <p className="text-sm text-teal-800">{result.overallFeedback}</p>
                  </div>

                  {/* Strengths & Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-emerald-700 mb-2">💪 Strengths</h3>
                      <ul className="space-y-1">{result.strengths.map((s, i) => <li key={i} className="text-[11px] text-emerald-800 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">✓</span>{s}</li>)}</ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-amber-700 mb-2">📈 Areas to Improve</h3>
                      <ul className="space-y-1">{result.areasToImprove.map((a, i) => <li key={i} className="text-[11px] text-amber-800 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">→</span>{a}</li>)}</ul>
                    </div>
                  </div>

                  {/* Per-Question Breakdown */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">{svg("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2")} Question-wise Evaluation</h3>
                    <div className="space-y-3">
                      {result.questions.map((q) => (
                        <div key={q.questionNumber} className={`rounded-xl border p-4 ${q.isCorrect ? "bg-emerald-50/50 border-emerald-200" : q.marksAwarded > 0 ? "bg-amber-50/50 border-amber-200" : "bg-rose-50/50 border-rose-200"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${q.isCorrect ? "bg-emerald-500" : q.marksAwarded > 0 ? "bg-amber-500" : "bg-rose-500"}`}>
                                Q{q.questionNumber}
                              </span>
                              <span className="text-sm font-medium text-slate-700">{q.questionText || `Question ${q.questionNumber}`}</span>
                            </div>
                            <span className={`text-sm font-bold ${q.isCorrect ? "text-emerald-600" : q.marksAwarded > 0 ? "text-amber-600" : "text-rose-600"}`}>
                              {q.marksAwarded}/{q.maxMarks}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                            <div className="bg-white/70 rounded-lg p-2">
                              <p className="text-[10px] font-bold text-slate-400 mb-0.5">Student&apos;s Answer</p>
                              <p className="text-xs text-slate-700">{q.studentAnswer || "—"}</p>
                            </div>
                            <div className="bg-white/70 rounded-lg p-2">
                              <p className="text-[10px] font-bold text-slate-400 mb-0.5">Correct Answer</p>
                              <p className="text-xs text-slate-700">{q.correctAnswer}</p>
                            </div>
                          </div>
                          {q.feedback && <p className="text-[11px] text-slate-600 italic">{q.feedback}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center mx-auto mb-5">
                  {svg("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", "w-10 h-10 text-teal-500")}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Evaluate an Answer Sheet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Select a student, fill in test details, upload or photograph the handwritten answer sheet — AI will read, evaluate, and score each question.
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">{svg("M15 12a3 3 0 11-6 0 3 3 0 016 0z", "w-4 h-4")} Vision AI</span>
                  <span className="flex items-center gap-1.5">{svg("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "w-4 h-4")} Per-Question</span>
                  <span className="flex items-center gap-1.5">{svg("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "w-4 h-4")} Student-Linked</span>
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
              <span className="text-sm text-slate-600 font-medium">{hSelected.size} selected</span>
              <button onClick={deleteSelected} className="py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5">
                {svg("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")} Delete
              </button>
            </div>
          )}

          {hLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center text-slate-400">
              <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Loading...
            </div>
          ) : !history.length ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center">
              {svg("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", "w-12 h-12 text-slate-300 mx-auto mb-3")}
              <p className="text-slate-500 font-medium">No test results yet</p>
              <p className="text-slate-400 text-xs mt-1">Evaluate your first answer sheet to see results here</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-3 px-4 text-left w-8"><input type="checkbox" onChange={() => { if (hSelected.size === history.length) setHSelected(new Set()); else setHSelected(new Set(history.map(h => h._id))); }} checked={hSelected.size === history.length && history.length > 0} className="rounded border-slate-300 cursor-pointer" /></th>
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500">Student</th>
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500">Test</th>
                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500">Subject</th>
                    <th className="py-3 px-3 text-center text-xs font-bold text-slate-500">Score</th>
                    <th className="py-3 px-3 text-center text-xs font-bold text-slate-500">Grade</th>
                    <th className="py-3 px-3 text-right text-xs font-bold text-slate-500">Date</th>
                    <th className="py-3 px-3 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h._id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="py-3 px-4"><input type="checkbox" checked={hSelected.has(h._id)} onChange={() => setHSelected((prev) => { const n = new Set(prev); if (n.has(h._id)) n.delete(h._id); else n.add(h._id); return n; })} className="rounded border-slate-300 cursor-pointer" /></td>
                      <td className="py-3 px-3"><p className="text-sm font-medium text-slate-700">{h.studentName}</p><p className="text-[10px] text-slate-400">Grade {h.studentGrade}</p></td>
                      <td className="py-3 px-3 text-sm text-slate-600">{h.testName}</td>
                      <td className="py-3 px-3 text-sm text-slate-600">{h.subject}</td>
                      <td className="py-3 px-3 text-center"><span className="font-semibold text-slate-700">{h.marksObtained}/{h.totalMarks}</span><p className="text-[10px] text-slate-400">{h.percentage.toFixed(1)}%</p></td>
                      <td className="py-3 px-3 text-center"><span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${GRADE_COLORS[h.grade] || "bg-slate-100 text-slate-500"}`}>{h.grade}</span></td>
                      <td className="py-3 px-3 text-right text-xs text-slate-400">{new Date(h.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="py-3 px-3"><button onClick={() => loadResult(h._id)} className="text-xs font-semibold text-teal-600 hover:text-teal-800 cursor-pointer">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {hPag.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-xs text-slate-500">Page {hPag.page} of {hPag.totalPages}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => fetchHistory(hPag.page - 1)} disabled={hPag.page <= 1} className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer">&lt;</button>
                {Array.from({ length: Math.min(hPag.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => fetchHistory(p)} className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${p === hPag.page ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{p}</button>
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
