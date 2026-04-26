"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [previewPic, setPreviewPic] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setPreviewPic(user.profilePicture || "");
    }
  }, [user]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    if (file.size > 400 * 1024) {
      setMessage({ type: "error", text: "Image must be under 400KB. Please compress or resize it." });
      return;
    }

    setUploadingPic(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreviewPic(base64);

      try {
        const res = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profilePicture: base64 }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage({ type: "error", text: data.error });
        } else {
          setMessage({ type: "success", text: "Profile picture updated!" });
          await refreshUser();
        }
      } catch {
        setMessage({ type: "error", text: "Failed to upload picture" });
      } finally {
        setUploadingPic(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = async () => {
    setUploadingPic(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setPreviewPic("");
        setMessage({ type: "success", text: "Profile picture removed" });
        await refreshUser();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to remove picture" });
    } finally {
      setUploadingPic(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, bio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await refreshUser();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-teal transition">Dashboard</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-800 font-medium">My Profile</span>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
            message.type === "success"
              ? "bg-emerald/10 border-emerald/20"
              : "bg-rose/10 border-rose/20"
          }`}
        >
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              message.type === "success" ? "text-emerald" : "text-rose"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {message.type === "success" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span className={`text-sm font-medium ${message.type === "success" ? "text-emerald-dark" : "text-rose"}`}>
            {message.text}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Profile picture */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-5">Profile Picture</h3>

            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative group mb-4">
                {previewPic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewPic}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-slate-100 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-badge to-orange-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-slate-100 shadow-lg">
                    {initials}
                  </div>
                )}

                {/* Camera overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPic}
                  className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  {uploadingPic ? (
                    <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />
              </div>

              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">{user.role}</p>

              <div className="flex gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPic}
                  className="flex-1 py-2 px-3 rounded-lg bg-teal/10 text-teal text-xs font-semibold hover:bg-teal/20 transition cursor-pointer disabled:opacity-50"
                >
                  Upload
                </button>
                {previewPic && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    disabled={uploadingPic}
                    className="flex-1 py-2 px-3 rounded-lg bg-rose/10 text-rose text-xs font-semibold hover:bg-rose/20 transition cursor-pointer disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-3 text-center">
                JPG, PNG or GIF. Max 400KB.
              </p>
            </div>
          </div>

          {/* Account info card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-4">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs font-medium">Email</span>
                <p className="text-slate-700 font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium">Role</span>
                <p className="text-slate-700 font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium">User ID</span>
                <p className="text-slate-500 font-mono text-xs truncate">{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Edit form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-emerald flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Edit Profile</h2>
                <p className="text-xs text-slate-500">Update your personal information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={50}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                  <span className="ml-2 text-xs font-normal text-slate-400">(cannot be changed)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                  <span className="ml-2 text-xs font-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-slate-700 mb-2">
                  Bio
                  <span className="ml-2 text-xs font-normal text-slate-400">({250 - bio.length} characters remaining)</span>
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={250}
                  rows={4}
                  placeholder="Tell us a little about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/"
                  className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal to-emerald text-white text-sm font-semibold shadow-lg shadow-teal/25 hover:shadow-xl hover:shadow-teal/30 hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
