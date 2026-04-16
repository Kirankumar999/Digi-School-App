"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Announcement {
  _id: string; title: string; content: string; category: string; priority: string;
  targetAudience: string; pinned: boolean; publishDate: string; createdByName: string; status: string;
}
interface SchoolEvent {
  _id: string; title: string; description: string; eventType: string;
  startDate: string; endDate: string; location: string; status: string;
}

const CATEGORIES = ["Academic", "Event", "Holiday", "Circular", "Emergency", "General"];
const EVENT_TYPES = ["Academic", "Cultural", "Sports", "Holiday", "PTM", "Exam", "Other"];
const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-blue-100 text-blue-700 border-blue-200",
};
const CATEGORY_ICONS: Record<string, string> = {
  Academic: "📚", Event: "🎉", Holiday: "🏖️", Circular: "📄", Emergency: "🚨", General: "📢",
};

export default function NoticesPage() {
  const { t } = useLocale();
  const [view, setView] = useState<"notices" | "events" | "create" | "createEvent">("notices");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");
  const [nCategory, setNCategory] = useState("General");
  const [nPriority, setNPriority] = useState("Medium");
  const [nTarget, setNTarget] = useState("All");
  const [nPinned, setNPinned] = useState(false);

  const [eTitle, setETitle] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [eType, setEType] = useState("Other");
  const [eStartDate, setEStartDate] = useState("");
  const [eEndDate, setEEndDate] = useState("");
  const [eLocation, setELocation] = useState("");

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements?limit=30");
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events?limit=30");
      const data = await res.json();
      setEvents(data.events || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadAnnouncements(); loadEvents(); }, [loadAnnouncements, loadEvents]);

  const createAnnouncement = async () => {
    if (!nTitle || !nContent) { setMsg(t("common.fillRequired")); return; }
    try {
      const res = await fetch("/api/announcements", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nTitle, content: nContent, category: nCategory, priority: nPriority, targetAudience: nTarget, pinned: nPinned }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("notices.announcementCreated"));
      setNTitle(""); setNContent(""); setView("notices"); loadAnnouncements();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const createEvent = async () => {
    if (!eTitle || !eStartDate) { setMsg(t("common.fillRequired")); return; }
    try {
      const res = await fetch("/api/events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: eTitle, description: eDesc, eventType: eType, startDate: eStartDate, endDate: eEndDate, location: eLocation }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("notices.eventCreated"));
      setETitle(""); setEDesc(""); setView("events"); loadEvents();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await fetch("/api/announcements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [id] }) });
      loadAnnouncements();
    } catch { /* ignore */ }
  };

  const isSuccess = msg === t("notices.announcementCreated") || msg === t("notices.eventCreated");

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-badge to-orange-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
            {t("notices.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("notices.subtitle")}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setView("notices")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "notices" ? "bg-amber-badge text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("notices.announcements")}</button>
          <button onClick={() => setView("events")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "events" ? "bg-amber-badge text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("notices.events")}</button>
          <button onClick={() => setView("create")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "create" ? "bg-amber-badge text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("notices.createNotice")}</button>
          <button onClick={() => setView("createEvent")} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === "createEvent" ? "bg-amber-badge text-white shadow" : "bg-white text-slate-600 border border-slate-200"}`}>{t("notices.addEvent")}</button>
        </div>
      </div>

      {msg && <div className={`px-4 py-3 rounded-lg text-sm font-medium ${isSuccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

      {view === "create" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("notices.createAnnouncement")}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.announcementTitle")} *</label>
              <input value={nTitle} onChange={(e) => setNTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.content")} *</label>
              <textarea value={nContent} onChange={(e) => setNContent(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.category")}</label>
                <select value={nCategory} onChange={(e) => setNCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{t(`notices.categories.${c}`)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.priority")}</label>
                <select value={nPriority} onChange={(e) => setNPriority(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                  {["High", "Medium", "Low"].map((p) => <option key={p} value={p}>{t(`notices.priorities.${p}`)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.target")}</label>
                <select value={nTarget} onChange={(e) => setNTarget(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                  {["All", "Students", "Teachers", "Parents"].map((tg) => <option key={tg} value={tg}>{t(`notices.targets.${tg}`)}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={nPinned} onChange={(e) => setNPinned(e.target.checked)} className="rounded" />
                  <span className="text-sm text-slate-600">{t("notices.pinToTop")}</span>
                </label>
              </div>
            </div>
            <button onClick={createAnnouncement} className="px-6 py-2.5 bg-gradient-to-r from-amber-badge to-orange-500 text-white rounded-lg font-medium text-sm cursor-pointer">{t("notices.createAnnouncement")}</button>
          </div>
        </div>
      )}

      {view === "createEvent" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("notices.addSchoolEvent")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.eventTitle")} *</label>
              <input value={eTitle} onChange={(e) => setETitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.eventType")}</label>
              <select value={eType} onChange={(e) => setEType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none">
                {EVENT_TYPES.map((et) => <option key={et} value={et}>{t(`notices.eventTypes.${et}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("exams.startDate")} *</label>
              <input type="date" value={eStartDate} onChange={(e) => setEStartDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("exams.endDate")}</label>
              <input type="date" value={eEndDate} onChange={(e) => setEEndDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("notices.location")}</label>
              <input value={eLocation} onChange={(e) => setELocation(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.description")}</label>
              <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none resize-none" />
            </div>
          </div>
          <button onClick={createEvent} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-amber-badge to-orange-500 text-white rounded-lg font-medium text-sm cursor-pointer">{t("notices.addSchoolEvent")}</button>
        </div>
      )}

      {view === "notices" && (
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <div className="w-8 h-8 border-2 border-amber-badge border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : announcements.length > 0 ? (
            announcements.map((a) => (
              <div key={a._id} className={`bg-white rounded-xl shadow-sm border border-slate-100 p-4 ${a.pinned ? "ring-2 ring-amber-badge/30" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{CATEGORY_ICONS[a.category] || "📢"}</span>
                      <h3 className="text-sm font-semibold text-slate-800">{a.title}</h3>
                      {a.pinned && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{t("notices.pinned")}</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{a.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_COLORS[a.priority] || PRIORITY_COLORS.Medium}`}>{t(`notices.priorities.${a.priority}`)}</span>
                      <span className="text-xs text-slate-400">{t(`notices.categories.${a.category}`)}</span>
                      <span className="text-xs text-slate-400">{t("notices.target")}: {t(`notices.targets.${a.targetAudience}`)}</span>
                      <span className="text-xs text-slate-400">{new Date(a.publishDate).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteAnnouncement(a._id)} className="text-red-400 hover:text-red-600 cursor-pointer p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500 text-sm">{t("notices.noAnnouncements")}</p>
            </div>
          )}
        </div>
      )}

      {view === "events" && (
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map((e) => (
              <div key={e._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-sky to-royal flex flex-col items-center justify-center text-white shrink-0">
                  <span className="text-lg font-bold leading-none">{new Date(e.startDate + "T00:00:00").getDate()}</span>
                  <span className="text-[10px] font-medium">{new Date(e.startDate + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">{e.title}</h3>
                  {e.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{e.description}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{t(`notices.eventTypes.${e.eventType}`)}</span>
                    {e.location && <span className="text-xs text-slate-400">{e.location}</span>}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.status === "Completed" ? "bg-emerald-100 text-emerald-700" : e.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {t(`notices.eventStatus.${e.status}`)}
                </span>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <p className="text-slate-500 text-sm">{t("notices.noEvents")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
