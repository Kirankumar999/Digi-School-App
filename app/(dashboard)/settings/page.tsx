"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Parent { _id: string; phone: string; name: string; studentNames: string[]; preferredLanguage: string; }

export default function SettingsPage() {
  const { locale, setLocale, t } = useLocale();
  const [activeTab, setActiveTab] = useState<"general" | "parents" | "notifications">("general");
  const [parents, setParents] = useState<Parent[]>([]);
  const [pLoading, setPLoading] = useState(false);

  const [pPhone, setPPhone] = useState("");
  const [pName, setPName] = useState("");
  const [pStudentNames, setPStudentNames] = useState("");
  const [msg, setMsg] = useState("");

  const loadParents = useCallback(async () => {
    setPLoading(true);
    try {
      const res = await fetch("/api/parents?limit=50");
      const data = await res.json();
      setParents(data.parents || []);
    } catch { /* ignore */ }
    setPLoading(false);
  }, []);

  useEffect(() => { if (activeTab === "parents") loadParents(); }, [activeTab, loadParents]);

  const addParent = async () => {
    if (!pPhone || !pName) { setMsg(t("common.fillRequired")); return; }
    try {
      const res = await fetch("/api/parents", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: pPhone, name: pName,
          studentNames: pStudentNames.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("settingsPage.parentAdded")); setPPhone(""); setPName(""); setPStudentNames("");
      loadParents();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const tabLabels: Record<string, string> = {
    general: t("settingsPage.general"),
    parents: t("settingsPage.parentContacts"),
    notifications: t("settingsPage.notifications"),
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          {t("nav.settings")}
        </h1>
      </div>

      <div className="flex gap-2">
        {(["general", "parents", "notifications"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${activeTab === tab ? "bg-slate-800 text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {msg && <div className={`px-4 py-3 rounded-lg text-sm font-medium ${msg === t("settingsPage.parentAdded") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

      {activeTab === "general" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("settingsPage.generalSettings")}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">{t("settingsPage.languageLabel")}</label>
              <div className="flex gap-3">
                <button onClick={() => setLocale("en")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${locale === "en" ? "bg-teal text-white" : "bg-slate-100 text-slate-600"}`}>English</button>
                <button onClick={() => setLocale("mr")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${locale === "mr" ? "bg-teal text-white" : "bg-slate-100 text-slate-600"}`}>मराठी (Mukta)</button>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-600 mb-2">{t("settingsPage.appInfo")}</h4>
              <div className="text-sm text-slate-500 space-y-1">
                <p>{t("app.version")}</p>
                <p>{t("app.curriculum")}</p>
                <p>{t("app.aiModels")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "parents" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("settingsPage.addParentContact")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("settingsPage.parentPhone")} *</label>
                <input value={pPhone} onChange={(e) => setPPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" placeholder="9876543210" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("settingsPage.parentName")} *</label>
                <input value={pName} onChange={(e) => setPName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("settingsPage.children")}</label>
                <input value={pStudentNames} onChange={(e) => setPStudentNames(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" placeholder="Rahul, Priya" />
              </div>
            </div>
            <button onClick={addParent} className="mt-3 px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium cursor-pointer">{t("settingsPage.addParent")}</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {pLoading ? (
              <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : parents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {parents.map((p) => (
                  <div key={p._id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.phone}{p.studentNames.length > 0 ? ` — ${p.studentNames.join(", ")}` : ""}</p>
                    </div>
                    <span className="text-xs text-slate-400">{p.preferredLanguage}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">{t("settingsPage.noParents")}</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("settingsPage.notificationSettings")}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">{t("settingsPage.smsNotifications")}</p>
                <p className="text-xs text-slate-500">{t("settingsPage.smsDescription")}</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{t("settingsPage.smsRequired")}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">{t("settingsPage.whatsappNotifications")}</p>
                <p className="text-xs text-slate-500">{t("settingsPage.whatsappDescription")}</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{t("settingsPage.whatsappRequired")}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{t("settingsPage.inAppNotifications")}</p>
                <p className="text-xs text-slate-500">{t("settingsPage.inAppDescription")}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">{t("settingsPage.inAppActive")}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">{t("settingsPage.notificationNote")}</p>
        </div>
      )}
    </div>
  );
}
