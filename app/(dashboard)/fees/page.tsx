"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface FeeComponent { name: string; amount: number; }
interface FeeStructure { _id: string; grade: string; academicYear: string; components: FeeComponent[]; totalAmount: number; }
interface Transaction {
  _id: string; transactionId: string; studentName: string; grade: string; section: string;
  amountPaid: number; totalFee: number; paymentDate: string; paymentMode: string;
  receiptNumber: string; status: string; scholarshipType: string; scholarshipAmount: number;
}

const GRADES = ["1","2","3","4","5","6","7","8","9","10"];
const PAYMENT_MODES = ["Cash","Online","Cheque","UPI"];
const STATUSES = ["Paid","Partial","Pending","Waived"];
const SCHOLARSHIP_TYPES = ["rte25","scst","obc","ebc","merit","other"];

export default function FeesPage() {
  const { t, tGrade } = useLocale();
  const [view, setView] = useState<"collect" | "structure" | "transactions">("collect");
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalCollected: 0, totalPending: 0, totalTransactions: 0 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [sGrade, setSGrade] = useState("");
  const [sYear, setSYear] = useState(() => { const y = new Date().getFullYear(); return `${y}-${y+1}`; });
  const [sComponents, setSComponents] = useState<FeeComponent[]>([{ name: "Tuition Fee", amount: 0 }]);

  const [cStudentId, setCStudentId] = useState("");
  const [cStudentName, setCStudentName] = useState("");
  const [cGrade, setCGrade] = useState("");
  const [cSection, setCSection] = useState("");
  const [cAmount, setCAmount] = useState(0);
  const [cTotalFee, setCTotalFee] = useState(0);
  const [cMode, setCMode] = useState("Cash");
  const [cScholarship, setCScholarship] = useState("");
  const [cScholarshipAmt, setCScholarshipAmt] = useState(0);
  const [cStatus, setCStatus] = useState("Paid");

  const loadStructures = useCallback(async () => {
    try {
      const res = await fetch(`/api/fees/structure?academicYear=${sYear}`);
      const data = await res.json();
      setStructures(data.structures || []);
    } catch { /* ignore */ }
  }, [sYear]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fees/transactions?limit=50`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setSummary(data.summary || { totalCollected: 0, totalPending: 0, totalTransactions: 0 });
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadStructures(); loadTransactions(); }, [loadStructures, loadTransactions]);

  const saveStructure = async () => {
    if (!sGrade) { setMsg(t("common.fillRequired")); return; }
    try {
      const res = await fetch("/api/fees/structure", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: sGrade, academicYear: sYear, components: sComponents }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("fees.feeStructureSaved"));
      loadStructures();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const collectFee = async () => {
    if (!cStudentName || !cGrade || !cAmount) { setMsg(t("common.fillRequired")); return; }
    try {
      const res = await fetch("/api/fees/transactions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: cStudentId || cStudentName, studentName: cStudentName,
          grade: cGrade, section: cSection, academicYear: sYear,
          amountPaid: cAmount, totalFee: cTotalFee || cAmount,
          paymentMode: cMode, status: cStatus,
          scholarshipType: cScholarship, scholarshipAmount: cScholarshipAmt,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(t("fees.paymentRecorded"));
      setCStudentName(""); setCAmount(0);
      loadTransactions();
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setMsg(e instanceof Error ? e.message : t("common.failedToSave")); }
  };

  const viewLabels: Record<string, string> = {
    collect: t("fees.collectFee"),
    structure: t("fees.feeStructure"),
    transactions: t("fees.transactions"),
  };

  const isSuccess = msg === t("fees.feeStructureSaved") || msg === t("fees.paymentRecorded");

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald to-teal flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            {t("fees.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("fees.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          {(["collect", "structure", "transactions"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${view === v ? "bg-teal text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {viewLabels[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">₹{summary.totalCollected.toLocaleString("en-IN")}</div>
          <div className="text-xs text-slate-500 mt-1">{t("fees.totalCollected")}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">₹{summary.totalPending.toLocaleString("en-IN")}</div>
          <div className="text-xs text-slate-500 mt-1">{t("fees.totalPending")}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <div className="text-2xl font-bold text-slate-700">{summary.totalTransactions}</div>
          <div className="text-xs text-slate-500 mt-1">{t("fees.transactions")}</div>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${isSuccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg}
        </div>
      )}

      {view === "collect" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("fees.recordPayment")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.studentName")} *</label>
              <input value={cStudentName} onChange={(e) => setCStudentName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.studentID")}</label>
              <input value={cStudentId} onChange={(e) => setCStudentId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" placeholder={t("common.optional")} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.class")} *</label>
              <select value={cGrade} onChange={(e) => setCGrade(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                <option value="">{t("common.select")}</option>
                {GRADES.map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.section")}</label>
              <input value={cSection} onChange={(e) => setCSection(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" placeholder="A, B, C..." />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.amountPaid")} *</label>
              <input type="number" value={cAmount} onChange={(e) => setCAmount(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.totalFee")}</label>
              <input type="number" value={cTotalFee} onChange={(e) => setCTotalFee(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.paymentMode")}</label>
              <select value={cMode} onChange={(e) => setCMode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{t(`fees.paymentModes.${m}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.status")}</label>
              <select value={cStatus} onChange={(e) => setCStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{t(`fees.${s.toLowerCase()}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.scholarship")}</label>
              <select value={cScholarship} onChange={(e) => setCScholarship(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                <option value="">{t("fees.scholarshipTypes.none")}</option>
                {SCHOLARSHIP_TYPES.map((s) => <option key={s} value={s}>{t(`fees.scholarshipTypes.${s}`)}</option>)}
              </select>
            </div>
            {cScholarship && (
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("fees.scholarshipAmount")}</label>
                <input type="number" value={cScholarshipAmt} onChange={(e) => setCScholarshipAmt(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
              </div>
            )}
          </div>
          <button onClick={collectFee} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-teal to-emerald text-white rounded-lg font-medium text-sm hover:shadow-lg transition cursor-pointer">
            {t("fees.recordPayment")}
          </button>
        </div>
      )}

      {view === "structure" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("fees.setFeeStructure")}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("common.grade")}</label>
                <select value={sGrade} onChange={(e) => setSGrade(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none">
                  <option value="">{t("common.select")}</option>
                  {GRADES.map((g) => <option key={g} value={g}>{tGrade(g)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{t("classes.academicYear")}</label>
                <input value={sYear} onChange={(e) => setSYear(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal/20 focus:border-teal outline-none" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {sComponents.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={c.name} onChange={(e) => { const n = [...sComponents]; n[i].name = e.target.value; setSComponents(n); }} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={t("fees.componentName")} />
                  <input type="number" value={c.amount} onChange={(e) => { const n = [...sComponents]; n[i].amount = Number(e.target.value); setSComponents(n); }} className="w-32 px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={t("fees.amount")} />
                  <button onClick={() => setSComponents(sComponents.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 cursor-pointer text-sm">{t("common.remove")}</button>
                </div>
              ))}
              <button onClick={() => setSComponents([...sComponents, { name: "", amount: 0 }])} className="text-teal text-sm font-medium cursor-pointer hover:underline">{t("fees.addComponent")}</button>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-slate-700">{t("common.total")}: ₹{sComponents.reduce((s, c) => s + c.amount, 0).toLocaleString("en-IN")}</p>
              <button onClick={saveStructure} className="px-6 py-2 bg-gradient-to-r from-teal to-emerald text-white rounded-lg font-medium text-sm cursor-pointer">{t("fees.saveStructure")}</button>
            </div>
          </div>
          {structures.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50"><h3 className="text-sm font-semibold text-slate-700">{t("fees.existingStructures")}</h3></div>
              <div className="divide-y divide-slate-100">
                {structures.map((s) => (
                  <div key={s._id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{tGrade(s.grade)} - {s.academicYear}</p>
                      <p className="text-xs text-slate-500">{s.components.map((c) => c.name).join(", ")}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">₹{s.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "transactions" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("fees.receipt")}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("fees.studentName")}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("common.class")}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("fees.amount")}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("fees.paymentMode")}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("common.date")}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">{t("common.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{tx.receiptNumber}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-700">{tx.studentName}</td>
                      <td className="px-4 py-2.5 text-slate-600">{tx.grade}{tx.section ? `-${tx.section}` : ""}</td>
                      <td className="px-4 py-2.5 font-medium text-emerald-600">₹{tx.amountPaid.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2.5 text-slate-600">{t(`fees.paymentModes.${tx.paymentMode}`)}</td>
                      <td className="px-4 py-2.5 text-slate-600">{tx.paymentDate}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === "Paid" ? "bg-emerald-100 text-emerald-700" : tx.status === "Partial" ? "bg-amber-100 text-amber-700" : tx.status === "Waived" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                          {t(`fees.${tx.status.toLowerCase()}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center"><p className="text-slate-500 text-sm">{t("fees.noTransactions")}</p></div>
          )}
        </div>
      )}
    </div>
  );
}
