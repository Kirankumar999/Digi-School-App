"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { StudentPhotoCapture } from "@/components/StudentPhotoCapture";
import { StudentProfile } from "@/components/StudentProfile";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  status: string;
  profilePicture: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ModalView = "none" | "add" | "upload" | "photo" | "profile";

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

function getInitials(first: string, last: string) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
}

const statusColors: Record<string, string> = {
  Active: "bg-emerald/10 text-emerald-dark",
  Inactive: "bg-slate-100 text-slate-500",
  Graduated: "bg-sky/10 text-sky",
  Transferred: "bg-amber-badge/10 text-amber-badge",
};

export default function StudentsPage() {
  const { t, tGrade, tSection, tGender } = useLocale();
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalView>("none");
  const [photoStudent, setPhotoStudent] = useState<Student | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (gradeFilter) params.set("grade", gradeFilter);
      if (sectionFilter) params.set("section", sectionFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/students?${params}`);
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
        setPagination(data.pagination);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to fetch students" });
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, sectionFilter, statusFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} student(s)? This cannot be undone.`)) return;

    const res = await fetch("/api/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ type: "success", text: data.message });
      setSelected(new Set());
      fetchStudents(pagination.page);
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
    if (selected.size === students.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(students.map((s) => s._id)));
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("students.title")}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination.total} {t("students.totalStudents")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/students/template"
            download
            className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t("students.template")}
          </a>
          <button
            onClick={() => setModal("upload")}
            className="py-2 px-4 rounded-xl border border-teal/30 text-teal text-sm font-semibold hover:bg-teal/5 transition flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {t("students.uploadExcel")}
          </button>
          <button
            onClick={() => setModal("add")}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-teal to-emerald text-white text-sm font-semibold shadow-lg shadow-teal/25 hover:shadow-xl hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("students.addStudent")}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border ${message.type === "success" ? "bg-emerald/10 border-emerald/20 text-emerald-dark" : "bg-rose/10 border-rose/20 text-rose"}`}>
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
            placeholder={t("students.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer">
            <option value="">{t("common.all")} {t("common.grade")}</option>
            {["1","2","3","4","5","6","7","8","9","10"].map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer">
            <option value="">{t("common.all")} {t("common.section")}</option>
            {["A","B","C","D"].map((s) => <option key={s} value={s}>{tSection(s)}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer">
            <option value="">{t("common.all")} {t("common.status")}</option>
            {["Active","Inactive","Graduated","Transferred"].map((s) => <option key={s} value={s}>{t(`studentStatus.${s}`)}</option>)}
          </select>
          {selected.size > 0 && (
            <button onClick={handleDelete} className="px-4 py-2.5 text-sm font-semibold text-rose bg-rose/10 rounded-xl hover:bg-rose/20 transition cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete ({selected.size})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3 px-4 text-left">
                  <input type="checkbox" checked={students.length > 0 && selected.size === students.length} onChange={toggleAll} className="rounded border-slate-300 cursor-pointer" />
                </th>
                {[t("students.studentId"), t("common.name"), t("common.grade"), t("common.section"), t("common.phone"), t("gender.Male").split(" ")[0] ? t("gender.Male").split("|")[0] : "Gender", t("students.guardianName"), t("common.status"), ""].map((h, i) => (
                  <th key={h || `action-${i}`} className="py-3 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="py-16 text-center text-slate-400">
                  <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading students...
                </td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={10} className="py-16 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p className="text-slate-500 font-medium">No students found</p>
                  <p className="text-slate-400 text-xs mt-1">Add students manually or upload an Excel file</p>
                </td></tr>
              ) : students.map((s) => (
                <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4">
                    <input type="checkbox" checked={selected.has(s._id)} onChange={() => toggleSelect(s._id)} className="rounded border-slate-300 cursor-pointer" />
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-xs whitespace-nowrap">{s.studentId}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => { setPhotoStudent(s); setModal("photo"); }}
                        className="relative group cursor-pointer shrink-0"
                        title="Click to update photo"
                      >
                        {s.profilePicture ? (
                          <img src={s.profilePicture} alt={s.firstName} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getGradient(s.firstName + s.lastName)} flex items-center justify-center text-white text-xs font-bold`}>
                            {getInitials(s.firstName, s.lastName)}
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </button>
                      <div>
                        <p className="text-slate-800 font-medium text-sm">{s.firstName} {s.lastName}</p>
                        {s.email && <p className="text-slate-400 text-xs">{s.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{tGrade(s.grade)}</td>
                  <td className="py-3 px-3 text-slate-600">{tSection(s.section)}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{s.phone || "—"}</td>
                  <td className="py-3 px-3 text-slate-600">{tGender(s.gender)}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{s.guardianName || "—"}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[s.status] || "bg-slate-100 text-slate-500"}`}>
                      {t(`studentStatus.${s.status}`)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => { setProfileStudent(s); setModal("profile"); }}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-teal hover:bg-teal/5 transition cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchStudents(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >&lt;</button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchStudents(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${p === pagination.page ? "bg-teal text-white" : "text-slate-500 hover:bg-slate-100"}`}
                >{p}</button>
              ))}
              <button
                onClick={() => fetchStudents(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="w-8 h-8 rounded-lg text-xs text-slate-500 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >&gt;</button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setModal("none"); setPhotoStudent(null); setProfileStudent(null); }}>
          <div className={`bg-white rounded-2xl shadow-2xl w-full ${modal === "profile" ? "max-w-xl" : "max-w-2xl"} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            {modal === "add" && (
              <AddStudentForm
                onClose={() => setModal("none")}
                onSuccess={(msg) => { setModal("none"); setMessage({ type: "success", text: msg }); fetchStudents(); }}
              />
            )}
            {modal === "upload" && (
              <UploadExcel
                onClose={() => setModal("none")}
                onSuccess={(msg) => { setModal("none"); setMessage({ type: "success", text: msg }); fetchStudents(); }}
              />
            )}
            {modal === "photo" && photoStudent && (
              <StudentPhotoCapture
                currentPhoto={photoStudent.profilePicture || ""}
                studentName={`${photoStudent.firstName} ${photoStudent.lastName}`}
                onSave={async (base64) => {
                  const res = await fetch(`/api/students/${photoStudent._id}/photo`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profilePicture: base64 }),
                  });
                  if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error);
                  }
                  setModal("none");
                  setPhotoStudent(null);
                  setMessage({ type: "success", text: "Student photo updated!" });
                  fetchStudents(pagination.page);
                }}
                onClose={() => { setModal("none"); setPhotoStudent(null); }}
              />
            )}
            {modal === "profile" && profileStudent && (
              <StudentProfile
                student={profileStudent}
                onClose={() => { setModal("none"); setProfileStudent(null); }}
                onUpdate={(updated) => {
                  setProfileStudent(updated);
                  setStudents((prev) => prev.map((s) => s._id === updated._id ? updated : s));
                }}
                onPhotoClick={() => {
                  setPhotoStudent(profileStudent);
                  setModal("photo");
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Add Student Form ─── */
function AddStudentForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: (msg: string) => void }) {
  const [form, setForm] = useState({
    studentId: "", firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", gender: "Male", grade: "", section: "",
    guardianName: "", guardianPhone: "", address: "", status: "Active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setSaving(false);
      return;
    }
    onSuccess("Student added successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-emerald flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Add New Student</h3>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">&times;</button>
      </div>

      {error && <div className="mx-6 mt-4 p-3 rounded-xl bg-rose/10 border border-rose/20 text-sm text-rose font-medium">{error}</div>}

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Student ID*", field: "studentId", placeholder: "S100001", required: true },
          { label: "First Name*", field: "firstName", placeholder: "John", required: true },
          { label: "Last Name*", field: "lastName", placeholder: "Doe", required: true },
          { label: "Email", field: "email", placeholder: "john@school.com", type: "email" },
          { label: "Phone", field: "phone", placeholder: "555-0101" },
          { label: "Date of Birth", field: "dateOfBirth", type: "date" },
          { label: "Grade*", field: "grade", placeholder: "10", required: true },
          { label: "Section*", field: "section", placeholder: "A1", required: true },
          { label: "Guardian Name", field: "guardianName", placeholder: "Jane Doe" },
          { label: "Guardian Phone", field: "guardianPhone", placeholder: "555-0100" },
        ].map(({ label, field, placeholder, type, required }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
            <input
              type={type || "text"}
              value={form[field as keyof typeof form]}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              required={required}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
          <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer">
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer">
            <option>Active</option><option>Inactive</option><option>Graduated</option><option>Transferred</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 Main St, City"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
        <button type="button" onClick={onClose} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
        <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal to-emerald text-white text-sm font-semibold shadow-lg shadow-teal/25 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer">
          {saving ? "Saving..." : "Add Student"}
        </button>
      </div>
    </form>
  );
}

/* ─── Upload Excel ─── */
function UploadExcel({ onClose, onSuccess }: { onClose: () => void; onSuccess: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ inserted: number; skipped: number; errored: number } | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ row: number; message: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Please select an Excel (.xlsx, .xls) or CSV file");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
    setValidationErrors([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/students/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        if (data.errors) setValidationErrors(data.errors);
        setUploading(false);
        return;
      }

      setResult(data.summary);
      setValidationErrors(data.errors || []);

      if (data.summary.inserted > 0) {
        setTimeout(() => onSuccess(`${data.summary.inserted} student(s) imported successfully!`), 1500);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky to-royal flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Upload Student Data</h3>
            <p className="text-xs text-slate-500">Import students from an Excel or CSV file</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">&times;</button>
      </div>

      <div className="p-6">
        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${dragOver ? "border-teal bg-teal/5" : "border-slate-200 hover:border-slate-300"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} className="hidden" />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); setValidationErrors([]); }}
                className="ml-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-slate-600 font-medium">Drag & drop your file here, or <span className="text-teal font-semibold cursor-pointer">browse</span></p>
              <p className="text-xs text-slate-400 mt-1">Supports .xlsx, .xls, and .csv (max 1000 rows)</p>
            </>
          )}
        </div>

        {/* Template link */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          Need help formatting? <a href="/api/students/template" download className="text-teal font-semibold hover:underline">Download the template</a>
        </div>

        {/* Error */}
        {error && <div className="mt-4 p-3 rounded-xl bg-rose/10 border border-rose/20 text-sm text-rose font-medium">{error}</div>}

        {/* Result */}
        {result && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 mb-2">Upload Summary</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-emerald/10">
                <div className="text-xl font-bold text-emerald-dark">{result.inserted}</div>
                <div className="text-xs text-slate-500">Imported</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-badge/10">
                <div className="text-xl font-bold text-amber-badge">{result.skipped}</div>
                <div className="text-xs text-slate-500">Skipped (duplicates)</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-rose/10">
                <div className="text-xl font-bold text-rose">{result.errored}</div>
                <div className="text-xs text-slate-500">Errors</div>
              </div>
            </div>
          </div>
        )}

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-rose/5 border border-rose/10 max-h-40 overflow-y-auto">
            <h4 className="text-xs font-bold text-rose mb-2">Validation Errors</h4>
            {validationErrors.map((err, i) => (
              <p key={i} className="text-xs text-slate-600 py-0.5">
                <span className="font-semibold text-rose">Row {err.row}:</span> {err.message}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 p-6 border-t border-slate-100">
        <button onClick={onClose} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky to-royal text-white text-sm font-semibold shadow-lg shadow-royal/25 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </span>
          ) : "Import Students"}
        </button>
      </div>
    </div>
  );
}
