"use client";

import { useState, FormEvent } from "react";

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

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
  onUpdate: (updated: Student) => void;
  onPhotoClick: () => void;
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

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Graduated: "bg-sky-100 text-sky-700 border-sky-200",
  Transferred: "bg-amber-100 text-amber-700 border-amber-200",
};

export function StudentProfile({ student, onClose, onUpdate, onPhotoClick }: StudentProfileProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    grade: student.grade,
    section: student.section,
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
    address: student.address,
    status: student.status,
  });

  const fullName = `${student.firstName} ${student.lastName}`;
  const initials = ((student.firstName?.[0] || "") + (student.lastName?.[0] || "")).toUpperCase();

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setSaving(false);
        return;
      }

      setSuccess("Profile updated successfully!");
      setEditing(false);
      onUpdate(data.student);
    } catch {
      setError("Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      grade: student.grade,
      section: student.section,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      address: student.address,
      status: student.status,
    });
    setEditing(false);
    setError("");
  };

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
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 px-6 pt-6 pb-20 rounded-t-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] rounded-t-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[student.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === "Active" ? "bg-emerald-500" : student.status === "Inactive" ? "bg-slate-400" : student.status === "Graduated" ? "bg-sky-500" : "bg-amber-500"}`} />
              {student.status}
            </span>
            <span className="text-white/50 text-xs font-mono">{student.studentId}</span>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar + name overlay */}
      <div className="relative px-6 -mt-14 mb-4">
        <div className="flex items-end gap-4">
          <button onClick={onPhotoClick} className="relative group cursor-pointer shrink-0" title="Change photo">
            {student.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={student.profilePicture} alt={fullName} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-xl" />
            ) : (
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getGradient(fullName)} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-xl`}>
                {initials}
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </button>
          <div className="pb-1">
            <h2 className="text-xl font-bold text-slate-800">{fullName}</h2>
            <p className="text-sm text-slate-500">
              Grade {student.grade} &middot; Section {student.section}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="mx-6 mb-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Content */}
      {editing ? (
        <form onSubmit={handleSave} className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "First Name*", field: "firstName", required: true },
              { label: "Last Name*", field: "lastName", required: true },
              { label: "Email", field: "email", type: "email" },
              { label: "Phone", field: "phone" },
              { label: "Date of Birth", field: "dateOfBirth", type: "date" },
              { label: "Grade*", field: "grade", required: true },
              { label: "Section*", field: "section", required: true },
              { label: "Guardian Name", field: "guardianName" },
              { label: "Guardian Phone", field: "guardianPhone" },
            ].map(({ label, field, type, required }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                <input
                  type={type || "text"}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => update(field, e.target.value)}
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button type="button" onClick={handleCancel} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal to-emerald text-white text-sm font-semibold shadow-lg shadow-teal/25 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="px-6 pb-6 space-y-5">
          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Full Name", fullName,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}
              {infoField("Student ID", student.studentId,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
              )}
              {infoField("Gender", student.gender,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>
              )}
              {infoField("Date of Birth", student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Academic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Grade", student.grade,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              )}
              {infoField("Section", student.section,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              )}
              {infoField("Enrollment Date", student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              )}
              {infoField("Status", student.status,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Email", student.email,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              )}
              {infoField("Phone", student.phone,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              )}
              {infoField("Address", student.address,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Guardian Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Guardian Name", student.guardianName,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}
              {infoField("Guardian Phone", student.guardianPhone,
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
