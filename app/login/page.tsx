"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useLocale } from "@/lib/i18n/LocaleContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy via-navy-light to-teal-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-teal blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-emerald blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-sky blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-28 h-28 rounded-2xl bg-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20 p-2">
            <img
              src="/logo.svg"
              alt="DigiSchool"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">{t("app.name")}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            {t("app.description")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-6 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal" />
              {t("auth.studentTracking")}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              {t("auth.performanceAnalytics")}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky" />
              {t("auth.aiFeatures")}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <img
              src="/logo.svg"
              alt="DigiSchool"
              className="w-12 h-12 rounded-xl object-contain shadow-lg"
            />
            <span className="text-2xl font-extrabold text-navy tracking-tight">{t("app.name")}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{t("auth.loginTitle")}</h2>
            <p className="text-slate-500 mt-1">{t("auth.loginSubtitle")}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose/10 border border-rose/20 flex items-start gap-3">
              <svg className="w-5 h-5 text-rose shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-rose font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("auth.emailAddress")}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                {t("auth.password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal to-emerald text-white font-semibold text-sm shadow-lg shadow-teal/25 hover:shadow-xl hover:shadow-teal/30 hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("auth.signingIn")}
                </span>
              ) : (
                t("auth.login")
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="font-semibold text-teal hover:text-teal-dark transition">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
