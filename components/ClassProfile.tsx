"use client";

import { useState, FormEvent } from "react";

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

interface ClassProfileProps {
  classItem: ClassItem;
  onClose: () => void;
  onUpdate: (updated: ClassItem) => void;
}

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Completed: "bg-sky-100 text-sky-700 border-sky-200",
};

const statusDotColors: Record<string, string> = {
  Active: "bg-emerald-500",
  Inactive: "bg-slate-400",
  Completed: "bg-sky-500",
};

export function ClassProfile({ classItem, onClose, onUpdate }: ClassProfileProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: classItem.name,
    grade: classItem.grade,
    section: classItem.section,
    subject: classItem.subject,
    teacherName: classItem.teacherName,
    room: classItem.room,
    schedule: classItem.schedule,
    maxStudents: String(classItem.maxStudents),
    academicYear: classItem.academicYear,
    description: classItem.description,
    status: classItem.status,
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/classes/${classItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, maxStudents: parseInt(form.maxStudents) || 40 }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setSaving(false);
        return;
      }

      setSuccess("Class updated successfully!");
      setEditing(false);
      onUpdate(data.class);
    } catch {
      setError("Failed to update class");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: classItem.name,
      grade: classItem.grade,
      section: classItem.section,
      subject: classItem.subject,
      teacherName: classItem.teacherName,
      room: classItem.room,
      schedule: classItem.schedule,
      maxStudents: String(classItem.maxStudents),
      academicYear: classItem.academicYear,
      description: classItem.description,
      status: classItem.status,
    });
    setEditing(false);
    setError("");
  };

  const capacityPct = classItem.maxStudents > 0
    ? Math.min(Math.round((classItem.studentCount / classItem.maxStudents) * 100), 100)
    : 0;

  const svgIcon = (d: string) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );

  const infoField = (label: string, value: string, icon: React.ReactNode) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition">
      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-slate-700 font-medium mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 px-6 pt-6 pb-16 rounded-t-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] rounded-t-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[classItem.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDotColors[classItem.status] || "bg-slate-400"}`} />
              {classItem.status}
            </span>
            <span className="text-white/50 text-xs font-mono">{classItem.classId}</span>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                {svgIcon("M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z")}
                Edit
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer">
              {svgIcon("M6 18L18 6M6 6l12 12")}
            </button>
          </div>
        </div>
      </div>

      {/* Name + stats overlay */}
      <div className="relative px-6 -mt-10 mb-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{classItem.name}</h2>
              <p className="text-sm text-slate-500">Grade {classItem.grade} &middot; Section {classItem.section} &middot; {classItem.subject}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">{classItem.studentCount}</p>
              <p className="text-[11px] text-slate-400">of {classItem.maxStudents} students</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${capacityPct > 90 ? "bg-rose-500" : capacityPct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{capacityPct}% capacity</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium flex items-center gap-2">
          {svgIcon("M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")}
          {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium flex items-center gap-2">
          {svgIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z")}
          {success}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Class Name*", field: "name", required: true },
              { label: "Grade*", field: "grade", required: true },
              { label: "Section*", field: "section", required: true },
              { label: "Subject*", field: "subject", required: true },
              { label: "Teacher Name", field: "teacherName" },
              { label: "Room", field: "room" },
              { label: "Schedule", field: "schedule", placeholder: "Mon-Fri 9:00-10:00" },
              { label: "Max Students", field: "maxStudents", type: "number" },
              { label: "Academic Year", field: "academicYear", placeholder: "2025-2026" },
            ].map(({ label, field, type, required, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                <input
                  type={type || "text"}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => update(field, e.target.value)}
                  required={required}
                  placeholder={placeholder}
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
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button type="button" onClick={handleCancel} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/25 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="px-6 pb-6 space-y-5">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {svgIcon("M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4")}
              Class Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Class Name", classItem.name, svgIcon("M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"))}
              {infoField("Class ID", classItem.classId, svgIcon("M7 20l4-16m2 16l4-16M6 9h14M4 15h14"))}
              {infoField("Grade", classItem.grade, svgIcon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"))}
              {infoField("Section", classItem.section, svgIcon("M4 6h16M4 10h16M4 14h16M4 18h16"))}
              {infoField("Subject", classItem.subject, svgIcon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"))}
              {infoField("Academic Year", classItem.academicYear, svgIcon("M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {svgIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")}
              Teacher & Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Assigned Teacher", classItem.teacherName, svgIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"))}
              {infoField("Room", classItem.room, svgIcon("M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"))}
              {infoField("Schedule", classItem.schedule, svgIcon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"))}
              {infoField("Max Students", String(classItem.maxStudents), svgIcon("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"))}
            </div>
          </div>
          {classItem.description && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                {svgIcon("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")}
                Description
              </h3>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{classItem.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
