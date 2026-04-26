"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("sarah@edupulse.io");
  const [password, setPassword] = useState("schoolpass");
  const [role, setRole] = useState("Administrator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.error) setError(result.error);
    setLoading(false);
  };

  return (
    <>
      <div className="ep-bg-decor" />
      <button
        onClick={toggleTheme}
        className="ep-theme-toggle fixed top-5 right-5 z-10"
        aria-label="Toggle theme"
      >
        <span className="knob">
          {theme === "dark" ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </span>
      </button>

      <main
        className="min-h-screen relative z-[1] grid"
        style={{ gridTemplateColumns: "1.05fr 1fr" }}
      >
        {/* Hero */}
        <section
          className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white relative overflow-hidden"
          style={{ background: "var(--gradient-brand)" }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              width: 360, height: 360, bottom: -120, left: -120, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,.18), transparent 60%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 260, height: 260, top: -80, right: -60, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,.22), transparent 60%)",
            }}
          />

          <div className="flex items-center gap-3 relative z-10">
            <div className="ep-brand-mark">
              <Image
                src="/PradnyaShala.png"
                alt="PradnyaShala"
                width={40}
                height={40}
                className="w-full h-full object-contain p-1 relative z-[1]"
                priority
              />
            </div>
            <div>
              <div className="font-extrabold text-lg">PradnyaShala</div>
              <div className="text-[11px] uppercase tracking-[0.18em] opacity-80">Intelligent School</div>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.08]">
              Run your school like a modern product, not a spreadsheet.
            </h1>
            <p className="text-[15px] opacity-90 mt-4 max-w-md">
              Manage students, attendance, exams, fees, timetables and parent
              communication — all in one beautifully designed workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            {[
              { num: "1,240+", lbl: "Schools onboarded" },
              { num: "98.7%", lbl: "Parent satisfaction" },
              { num: "42+", lbl: "Countries" },
            ].map((s) => (
              <div
                key={s.lbl}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-[22px] font-extrabold leading-tight">{s.num}</div>
                <div className="text-[12px] opacity-85 mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section
          className="flex items-center justify-center p-6 sm:p-10 col-span-2 lg:col-span-1"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="w-full max-w-[420px] p-8 sm:p-9 rounded-[28px] ep-fade-up"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="ep-brand-mark">
                <Image
                  src="/PradnyaShala.png"
                  alt="PradnyaShala"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1 relative z-[1]"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
                PradnyaShala
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
              Welcome back 👋
            </h2>
            <p className="text-[13.5px] mt-1" style={{ color: "var(--text-mute)" }}>
              Sign in to your school dashboard.
            </p>

            {error && (
              <div
                className="mt-5 p-3 rounded-xl flex items-start gap-2.5"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)" }}
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--danger)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "var(--danger)" }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* Role */}
              <Field label="I am a" icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M19.4 15a1.65 1.65 0 00.33 1.82l.06.06" />
                </svg>
              }>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="ep-field-input"
                >
                  <option>Administrator</option>
                  <option>Teacher</option>
                  <option>Student</option>
                  <option>Parent</option>
                </select>
              </Field>

              {/* Email */}
              <Field label={t("auth.emailAddress") || "Email address"} icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
                </svg>
              }>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  required
                  className="ep-field-input"
                />
              </Field>

              {/* Password */}
              <Field label={t("auth.password") || "Password"} icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              }>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="ep-field-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: "var(--text-mute)" }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </Field>

              <div className="flex items-center justify-between text-[12.5px] mt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer" style={{ color: "var(--text-soft)" }}>
                  <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" style={{ accentColor: "var(--brand-1)" }} />
                  Remember me
                </label>
                <a href="#" className="font-semibold" style={{ color: "var(--brand-1)" }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ep-btn ep-btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-[12.5px] mt-3" style={{ color: "var(--text-mute)" }}>
                New to EduPulse?{" "}
                <Link href="/signup" className="font-semibold" style={{ color: "var(--brand-1)" }}>
                  Create a school account
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Local styles for the form fields */}
      <style jsx>{`
        :global(.ep-field-input) {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border-radius: 12px;
          background: var(--surface-3);
          border: 1px solid transparent;
          font-size: 14px;
          color: var(--text);
          outline: none;
          transition: border-color 160ms, background 160ms;
        }
        :global(.ep-field-input:focus) {
          background: var(--surface);
          border-color: var(--brand-1);
        }
      `}</style>
    </>
  );
}

function Field({
  label, icon, children,
}: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold" style={{ color: "var(--text-soft)" }}>
        {label}
      </label>
      <div className="relative">
        <span
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-mute)" }}
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
