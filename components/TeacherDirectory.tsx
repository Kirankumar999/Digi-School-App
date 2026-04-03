"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Teacher {
  _id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  subject: string;
  department: string;
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

const DEPARTMENTS = ["Science", "Mathematics", "Languages", "Social Studies", "Arts", "Physical Education", "Computer Science", "Administration"];

export function TeacherDirectory() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "5" });
      if (search) params.set("search", search);
      if (deptFilter) params.set("department", deptFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/teachers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.teachers);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, statusFilter, page]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    setPage(1);
  }, [search, deptFilter, statusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h2 className="text-sm font-bold text-slate-800 mb-3">Teacher Profile Management</h2>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-700">
          Teacher Directory
          <span className="ml-1.5 text-slate-400 font-normal">({total})</span>
        </h3>
        <button
          onClick={() => router.push("/teachers")}
          className="px-4 py-1.5 bg-gradient-to-r from-emerald to-teal text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald/25 transition-all cursor-pointer"
        >
          Add Teachers
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Search Teacher Name/ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal bg-slate-50"
        />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
        >
          <option value="">Department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
        >
          <option value="">Status</option>
          {["Active", "Inactive", "On Leave", "Resigned"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              {["Teacher ID", "Name", "Department", "Subject", "Contact", "Actions"].map((h) => (
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
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((t) => {
                const fullName = `${t.firstName} ${t.lastName}`;
                const initials = ((t.firstName?.[0] || "") + (t.lastName?.[0] || "")).toUpperCase();
                return (
                  <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.teacherId}</td>
                    <td className="py-2 px-1 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {t.profilePicture ? (
                          <img src={t.profilePicture} alt={fullName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getGradient(fullName)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                            {initials}
                          </div>
                        )}
                        <span className="text-slate-700 font-medium">{fullName}</span>
                      </div>
                    </td>
                    <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.department}</td>
                    <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.subject}</td>
                    <td className="py-2 px-1 text-slate-600 whitespace-nowrap">{t.phone || "—"}</td>
                    <td className="py-2 px-1">
                      <button
                        onClick={() => router.push("/teachers")}
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
