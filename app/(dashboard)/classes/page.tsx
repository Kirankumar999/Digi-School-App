"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { ClassProfile } from "@/components/ClassProfile";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface ClassItem {
  _id: string;
  classId: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  schedule: string;
  maxStudents: number;
  academicYear: string;
  description: string;
  status: string;
  studentCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ModalView = "none" | "add" | "profile";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-500",
  Completed: "bg-sky-50 text-sky-700",
};

export default function ClassesPage() {
  const { t, tGrade } = useLocale();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalView>("none");
  const [profileClass, setProfileClass] = useState<ClassItem | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchClasses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (gradeFilter) params.set("grade", gradeFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/classes?${params}`);
      const data = await res.json();
      if (res.ok) {
        setClasses(data.classes);
        setPagination(data.pagination);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to fetch classes" });
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, statusFilter]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} class(es)? This cannot be undone.`)) return;

    const res = await fetch("/api/classes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: data.message });
      setSelected(new Set());
      fetchClasses(pagination.page);
    } else {
      setMessage({ type: "error", text: data.error });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === classes.length) setSelected(new Set());
    else setSelected(new Set(classes.map((c) => c._id)));
  };

  const closeModal = () => { setModal("none"); setProfileClass(null); };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("classes.title")}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination.total} {t("classes.totalClasses")}
          </p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("classes.addClass")}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {message.type === "success"
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          </svg>
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto text-current opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name, ID, subject or teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400"
          />
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300/50 cursor-pointer">
            <option value="">{t("common.all")} {t("common.grade")}</option>
            {["1","2","3","4","5","6","7","8","9","10"].map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300/50 cursor-pointer">
            <option value="">{t("common.all")} {t("common.status")}</option>
            {["Active", "Inactive", "Completed"].map((s) => <option key={s} value={s}>{s === "Completed" ? t("classes.completed") : t(`studentStatus.${s}`)}</option>)}
          </select>
          {selected.size > 0 && (
            <button onClick={handleDelete} className="px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete ({selected.size})
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading classes...
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-16 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-slate-500 font-medium">No classes found</p>
          <p className="text-slate-400 text-xs mt-1">Create your first class to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => {
            const capacityPct = c.maxStudents > 0 ? Math.min(Math.round((c.studentCount / c.maxStudents) * 100), 100) : 0;
            return (
              <div key={c._id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden group">
                {/* Card header with gradient */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={selected.has(c._id)} onChange={() => toggleSelect(c._id)} className="rounded border-slate-300 cursor-pointer" />
                      <span className="text-xs font-mono text-slate-400">{c.classId}</span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[c.status] || "bg-slate-100 text-slate-500"}`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Grade {c.grade} &middot; Section {c.section}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {c.subject}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {c.teacherName || "No teacher assigned"}
                    </div>
                    {c.room && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Room {c.room}
                      </div>
                    )}
                    {c.schedule && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {c.schedule}
                      </div>
                    )}
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>{c.studentCount} students</span>
                      <span>{capacityPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${capacityPct > 90 ? "bg-rose-500" : capacityPct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => { setProfileClass(c); setModal("profile"); }}
                    className="w-full py-2 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchClasses(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
            >&lt;</button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchClasses(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${p === pagination.page ? "bg-amber-500 text-white" : "text-slate-500 hover:bg-slate-100"}`}
              >{p}</button>
            ))}
            <button
              onClick={() => fetchClasses(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
            >&gt;</button>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div className={`bg-white rounded-2xl shadow-2xl w-full ${modal === "profile" ? "max-w-xl" : "max-w-2xl"} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            {modal === "add" && (
              <AddClassForm
                onClose={closeModal}
                onSuccess={(msg) => { closeModal(); setMessage({ type: "success", text: msg }); fetchClasses(); }}
              />
            )}
            {modal === "profile" && profileClass && (
              <ClassProfile
                classItem={profileClass}
                onClose={closeModal}
                onUpdate={(updated) => {
                  setProfileClass(updated);
                  setClasses((prev) => prev.map((c) => c._id === updated._id ? updated : c));
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Add Class Form ─── */
function AddClassForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: (msg: string) => void }) {
  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState({
    classId: "", name: "", grade: "", section: "", subject: "",
    teacherName: "", room: "", schedule: "", maxStudents: "40",
    academicYear: `${currentYear}-${currentYear + 1}`, description: "", status: "Active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, maxStudents: parseInt(form.maxStudents) || 40 }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setSaving(false);
      return;
    }
    onSuccess("Class added successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add New Class</h3>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">&times;</button>
      </div>

      {error && <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{error}</div>}

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Class ID*", field: "classId", placeholder: "CLS-10A-MATH", required: true },
          { label: "Class Name*", field: "name", placeholder: "Grade 10 - A1 Mathematics", required: true },
          { label: "Grade*", field: "grade", placeholder: "10", required: true },
          { label: "Section*", field: "section", placeholder: "A1", required: true },
          { label: "Subject*", field: "subject", placeholder: "Mathematics", required: true },
          { label: "Teacher Name", field: "teacherName", placeholder: "Robert Williams" },
          { label: "Room", field: "room", placeholder: "101" },
          { label: "Schedule", field: "schedule", placeholder: "Mon-Fri 9:00-10:00" },
          { label: "Max Students", field: "maxStudents", placeholder: "40", type: "number" },
          { label: "Academic Year", field: "academicYear", placeholder: `${currentYear}-${currentYear + 1}` },
        ].map(({ label, field, placeholder, type, required }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
            <input
              type={type || "text"}
              value={form[field as keyof typeof form]}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              required={required}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 cursor-pointer">
            <option>Active</option><option>Inactive</option><option>Completed</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Optional class description..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
        <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
        <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/25 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer">
          {saving ? "Saving..." : "Add Class"}
        </button>
      </div>
    </form>
  );
}
