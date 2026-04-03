"use client";

import { useState, FormEvent } from "react";

interface Teacher {
  _id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  subject: string;
  department: string;
  qualification: string;
  experience: string;
  address: string;
  joiningDate: string;
  salary: string;
  status: string;
  profilePicture: string;
}

interface TeacherProfileProps {
  teacher: Teacher;
  onClose: () => void;
  onUpdate: (updated: Teacher) => void;
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
  "On Leave": "bg-amber-100 text-amber-700 border-amber-200",
  Resigned: "bg-rose-100 text-rose-700 border-rose-200",
};

const statusDotColors: Record<string, string> = {
  Active: "bg-emerald-500",
  Inactive: "bg-slate-400",
  "On Leave": "bg-amber-500",
  Resigned: "bg-rose-500",
};

export function TeacherProfile({ teacher, onClose, onUpdate, onPhotoClick }: TeacherProfileProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    dateOfBirth: teacher.dateOfBirth,
    gender: teacher.gender,
    subject: teacher.subject,
    department: teacher.department,
    qualification: teacher.qualification,
    experience: teacher.experience,
    address: teacher.address,
    salary: teacher.salary,
    status: teacher.status,
  });

  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const initials = ((teacher.firstName?.[0] || "") + (teacher.lastName?.[0] || "")).toUpperCase();

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/teachers/${teacher._id}`, {
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
      onUpdate(data.teacher);
    } catch {
      setError("Failed to update teacher");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      dateOfBirth: teacher.dateOfBirth,
      gender: teacher.gender,
      subject: teacher.subject,
      department: teacher.department,
      qualification: teacher.qualification,
      experience: teacher.experience,
      address: teacher.address,
      salary: teacher.salary,
      status: teacher.status,
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

  const svgIcon = (d: string) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="relative bg-gradient-to-br from-indigo-800 via-indigo-700 to-violet-900 px-6 pt-6 pb-20 rounded-t-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] rounded-t-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColors[teacher.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDotColors[teacher.status] || "bg-slate-400"}`} />
              {teacher.status}
            </span>
            <span className="text-white/50 text-xs font-mono">{teacher.teacherId}</span>
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
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition cursor-pointer"
            >
              {svgIcon("M6 18L18 6M6 6l12 12")}
            </button>
          </div>
        </div>
      </div>

      <div className="relative px-6 -mt-14 mb-4">
        <div className="flex items-end gap-4">
          <button onClick={onPhotoClick} className="relative group cursor-pointer shrink-0" title="Change photo">
            {teacher.profilePicture ? (
              <img src={teacher.profilePicture} alt={fullName} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-xl" />
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
              {teacher.subject} &middot; {teacher.department}
            </p>
          </div>
        </div>
      </div>

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
              { label: "First Name*", field: "firstName", required: true },
              { label: "Last Name*", field: "lastName", required: true },
              { label: "Email", field: "email", type: "email" },
              { label: "Phone", field: "phone" },
              { label: "Date of Birth", field: "dateOfBirth", type: "date" },
              { label: "Subject*", field: "subject", required: true },
              { label: "Department*", field: "department", required: true },
              { label: "Qualification", field: "qualification" },
              { label: "Experience", field: "experience" },
              { label: "Salary", field: "salary" },
            ].map(({ label, field, type, required }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                <input
                  type={type || "text"}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => update(field, e.target.value)}
                  required={required}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/50 cursor-pointer">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/50 cursor-pointer">
                <option>Active</option><option>Inactive</option><option>On Leave</option><option>Resigned</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <button type="button" onClick={handleCancel} className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="px-6 pb-6 space-y-5">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {svgIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")}
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Full Name", fullName, svgIcon("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"))}
              {infoField("Teacher ID", teacher.teacherId, svgIcon("M7 20l4-16m2 16l4-16M6 9h14M4 15h14"))}
              {infoField("Gender", teacher.gender, svgIcon("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"))}
              {infoField("Date of Birth", teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "", svgIcon("M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {svgIcon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253")}
              Professional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Subject", teacher.subject, svgIcon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"))}
              {infoField("Department", teacher.department, svgIcon("M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"))}
              {infoField("Qualification", teacher.qualification, svgIcon("M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"))}
              {infoField("Experience", teacher.experience, svgIcon("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"))}
              {infoField("Joining Date", teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "", svgIcon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"))}
              {infoField("Salary", teacher.salary ? `$${teacher.salary}` : "", svgIcon("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"))}
              {infoField("Status", teacher.status, svgIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {svgIcon("M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z")}
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {infoField("Email", teacher.email, svgIcon("M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"))}
              {infoField("Phone", teacher.phone, svgIcon("M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"))}
              {infoField("Address", teacher.address, svgIcon("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
