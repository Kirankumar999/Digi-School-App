"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ClassItem {
  _id: string;
  classId: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  teacherName: string;
  status: string;
  maxStudents: number;
  studentCount: number;
}

export function ClassMetrics() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classes?limit=6&status=Active");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes);
        setTotal(data.pagination.total);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const getCapacity = (c: ClassItem) =>
    c.maxStudents > 0 ? Math.min(Math.round((c.studentCount / c.maxStudents) * 100), 100) : 0;

  const topClass = classes.length > 0
    ? classes.reduce((a, b) => getCapacity(a) > getCapacity(b) ? a : b)
    : null;

  const lowClass = classes.length > 1
    ? classes.reduce((a, b) => getCapacity(a) < getCapacity(b) ? a : b)
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Class Overview</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{total} active class{total !== 1 ? "es" : ""}</p>
        </div>
        <button
          onClick={() => router.push("/classes")}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer"
        >
          Manage
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400">
          <svg className="w-5 h-5 animate-spin mx-auto mb-1.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      ) : classes.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          No classes found
        </div>
      ) : (
        <>
          {/* Class capacity cards */}
          <div className="space-y-2 mb-4">
            {classes.slice(0, 5).map((c) => {
              const pct = getCapacity(c);
              return (
                <div key={c._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 text-[10px] font-bold shrink-0">
                    {c.grade}{c.section}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700 truncate">{c.name}</p>
                      <span className="text-[10px] text-slate-400 ml-2 shrink-0">{c.studentCount}/{c.maxStudents}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full transition-all ${pct > 90 ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlights */}
          {topClass && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 mb-3">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Highest Enrollment</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {topClass.grade}{topClass.section}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{topClass.name}</p>
                    <p className="text-[10px] text-slate-400">{topClass.studentCount} students &middot; {getCapacity(topClass)}% full</p>
                  </div>
                </div>
                <button onClick={() => router.push("/classes")} className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center cursor-pointer">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {lowClass && lowClass._id !== topClass?._id && (
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Lowest Enrollment</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-[10px] font-bold">
                    {lowClass.grade}{lowClass.section}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{lowClass.name}</p>
                    <p className="text-[10px] text-slate-400">{lowClass.studentCount} students &middot; {getCapacity(lowClass)}% full</p>
                  </div>
                </div>
                <button onClick={() => router.push("/classes")} className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center cursor-pointer">
                  <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
