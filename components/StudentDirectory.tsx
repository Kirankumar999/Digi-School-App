"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
  phone: string;
  status: string;
  profilePicture: string;
}

const GRADIENTS = [
  "from-blue-400 to-indigo-500",
  "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-sky-500",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export function StudentDirectory() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "5" });
      if (search) params.set("search", search);
      if (gradeFilter) params.set("grade", gradeFilter);
      if (sectionFilter) params.set("section", sectionFilter);

      const res = await fetch(`/api/students?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, sectionFilter, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setPage(1);
  }, [search, gradeFilter, sectionFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h2 className="text-sm font-bold text-slate-800 mb-3">Student Profile Management</h2>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-700">
          Student Directory
          <span className="ml-1.5 text-slate-400 font-normal">({total})</span>
        </h3>
        <button
          onClick={() => router.push("/students")}
          className="px-4 py-1.5 bg-gradient-to-r from-emerald to-teal text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald/25 transition-all cursor-pointer"
        >
          Add Students
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Search Student Name/ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal bg-slate-50"
        />
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
        >
          <option value="">Grade</option>
          {["1","2","3","4","5","6","7","8","9","10","11","12"].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
        >
          <option value="">Section</option>
          {["A1","A2","A3","A4","B1","B2","B3","B4"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              {["Student ID", "Name", "Grade", "Section", "Contact", "Actions"].map((h) => (
                <th key={h} className="text-left py-2 px-1 text-slate-500 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <svg className="w-5 h-5 animate-spin mx-auto mb-1.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const fullName = `${s.firstName} ${s.lastName}`;
                const initials = ((s.firstName?.[0] || "") + (s.lastName?.[0] || "")).toUpperCase();
                return (
                  <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{s.studentId}</td>
                    <td className="py-2 px-1 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {s.profilePicture ? (
                          <img src={s.profilePicture} alt={fullName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getGradient(fullName)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                            {initials}
                          </div>
                        )}
                        <span className="text-slate-700 font-medium">{fullName}</span>
                      </div>
                    </td>
                    <td className="py-2 px-1 text-slate-600">{s.grade}</td>
                    <td className="py-2 px-1 text-slate-600">{s.section}</td>
                    <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{s.phone || "—"}</td>
                    <td className="py-2 px-1">
                      <button
                        onClick={() => router.push("/students")}
                        className="text-teal hover:text-teal-dark font-semibold hover:underline whitespace-nowrap cursor-pointer"
                      >
                        View/Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="w-7 h-7 rounded-md text-xs text-slate-400 hover:bg-slate-100 flex items-center justify-center cursor-pointer disabled:opacity-30"
          >&lt;</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center cursor-pointer ${
                p === page ? "bg-teal text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >{p}</button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="w-7 h-7 rounded-md text-xs text-slate-400 hover:bg-slate-100 flex items-center justify-center cursor-pointer disabled:opacity-30"
          >&gt;</button>
        </div>
      )}
    </div>
  );
}
