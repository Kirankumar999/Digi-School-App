import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ReportCard from "@/lib/models/ReportCard";
import fs from "fs/promises";
import path from "path";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function gradeColor(g: string): string {
  const m: Record<string, string> = { "A+": "#059669", A: "#10b981", "B+": "#0ea5e9", B: "#3b82f6", C: "#f59e0b", D: "#f97316", F: "#ef4444" };
  return m[g] || "#64748b";
}

function generateReportCardHTML(rc: Record<string, unknown>): string {
  const schoolName = "DigiSchool";
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const subjectGrades = rc.subjectGrades as { subject: string; totalMarks: number; marksObtained: number; percentage: number; grade: string; testsCount: number; remarks: string }[];
  const attendance = rc.attendance as { totalDays: number; presentDays: number; percentage: number };
  const coScholastic = rc.coScholastic as { activity: string; grade: string }[];
  const strengths = rc.strengths as string[];
  const areasToImprove = rc.areasToImprove as string[];
  const recommendations = rc.recommendations as string[];

  const subjectRows = subjectGrades.map((s) => `
    <tr>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:500;">${escapeHtml(s.subject)}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;">${s.totalMarks}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-weight:600;">${s.marksObtained}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;">${s.percentage.toFixed(1)}%</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;"><span style="background:${gradeColor(s.grade)};color:white;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:700;">${s.grade}</span></td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:11px;color:#64748b;">${escapeHtml(s.remarks)}</td>
    </tr>`).join("");

  const coRows = coScholastic.map((c) => `
    <tr>
      <td style="padding:6px 12px;border:1px solid #e2e8f0;">${escapeHtml(c.activity)}</td>
      <td style="padding:6px 12px;border:1px solid #e2e8f0;text-align:center;font-weight:600;">${c.grade}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;font-size:12px;line-height:1.6;color:#1e293b;padding:30px;}
  .header{text-align:center;border-bottom:3px solid #0d9488;padding-bottom:16px;margin-bottom:16px;}
  .school{font-size:22px;font-weight:800;color:#0f172a;} .school-sub{font-size:11px;color:#64748b;margin-top:2px;}
  .title{background:linear-gradient(135deg,#0d9488,#10b981);color:white;text-align:center;padding:10px;font-size:15px;font-weight:700;border-radius:6px;margin:12px 0;}
  .info-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;font-size:11px;}
  .info-item{background:#f8fafc;padding:6px 12px;border-radius:4px;border:1px solid #e2e8f0;}
  .info-item label{color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;}
  .info-item span{display:block;font-weight:600;color:#0f172a;}
  table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11.5px;}
  th{background:#f0fdfa;color:#0d9488;padding:8px 12px;border:1px solid #e2e8f0;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;}
  .section-title{font-size:13px;font-weight:700;color:#0d9488;margin:16px 0 8px;padding:4px 10px;border-left:3px solid #0d9488;}
  .remarks{background:#f0fdfa;border:1px solid #99f6e4;padding:12px;border-radius:6px;margin-bottom:12px;font-size:11.5px;line-height:1.7;}
  .list{padding-left:18px;margin:6px 0;font-size:11.5px;} .list li{margin-bottom:3px;}
  .score-box{text-align:center;padding:16px;background:linear-gradient(135deg,#0d9488,#10b981);color:white;border-radius:8px;margin:12px 0;}
  .score-big{font-size:32px;font-weight:800;} .score-label{font-size:11px;opacity:0.85;margin-top:2px;}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .sign-area{margin-top:30px;display:flex;justify-content:space-between;font-size:11px;color:#64748b;}
  .sign-area div{text-align:center;width:160px;border-top:1px solid #cbd5e1;padding-top:6px;}
  .footer{margin-top:20px;text-align:center;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:8px;}
  @media print{body{padding:15px;}}
</style></head><body>
  <div class="header">
    <div class="school">${escapeHtml(schoolName)}</div>
    <div class="school-sub">Empowering Education Through Technology</div>
  </div>
  <div class="title">REPORT CARD — ${escapeHtml(rc.term as string)} (${escapeHtml(rc.academicYear as string)})</div>
  <div class="info-grid">
    <div class="info-item"><label>Student Name</label><span>${escapeHtml(rc.studentName as string)}</span></div>
    <div class="info-item"><label>Class &amp; Section</label><span>${rc.classNum}${rc.studentSection ? `-${escapeHtml(rc.studentSection as string)}` : ""}</span></div>
    <div class="info-item"><label>Date</label><span>${date}</span></div>
  </div>

  <div class="score-box">
    <div class="score-big">${(rc.overallPercentage as number).toFixed(1)}%</div>
    <div class="score-label">Overall — Grade ${escapeHtml(rc.overallGrade as string)}</div>
  </div>

  <div class="section-title">Scholastic Performance</div>
  <table><thead><tr><th>Subject</th><th style="text-align:center">Total</th><th style="text-align:center">Obtained</th><th style="text-align:center">%</th><th style="text-align:center">Grade</th><th>Remarks</th></tr></thead><tbody>${subjectRows}</tbody></table>

  ${attendance.totalDays > 0 ? `<div class="section-title">Attendance</div>
  <div class="info-grid">
    <div class="info-item"><label>Total Days</label><span>${attendance.totalDays}</span></div>
    <div class="info-item"><label>Present</label><span>${attendance.presentDays}</span></div>
    <div class="info-item"><label>Attendance %</label><span>${attendance.percentage.toFixed(1)}%</span></div>
  </div>` : ""}

  ${coScholastic.length > 0 ? `<div class="section-title">Co-Scholastic Areas</div>
  <table><thead><tr><th>Activity</th><th style="text-align:center;width:100px;">Grade</th></tr></thead><tbody>${coRows}</tbody></table>` : ""}

  <div class="section-title">Teacher's Assessment</div>
  <div class="remarks">${escapeHtml(rc.aiRemarks as string)}</div>

  <div class="two-col">
    <div><div class="section-title">Strengths</div><ul class="list">${strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></div>
    <div><div class="section-title">Areas to Improve</div><ul class="list">${areasToImprove.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul></div>
  </div>

  <div class="section-title">Recommendations for Parents</div>
  <ul class="list">${recommendations.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>

  ${(rc.teacherComments as string) ? `<div class="section-title">Teacher Comments</div><div class="remarks">${escapeHtml(rc.teacherComments as string)}</div>` : ""}
  ${(rc.principalComments as string) ? `<div class="section-title">Principal Comments</div><div class="remarks">${escapeHtml(rc.principalComments as string)}</div>` : ""}

  <div class="sign-area">
    <div>Class Teacher</div>
    <div>Parent/Guardian</div>
    <div>Principal</div>
  </div>
  <div class="footer">Generated by ${escapeHtml(schoolName)} — AI Report Card System | ${date}</div>
</body></html>`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const rc = await ReportCard.findById(id).lean();
    if (!rc) return NextResponse.json({ error: "Report card not found" }, { status: 404 });

    const rcObj = rc as unknown as Record<string, unknown>;

    if (rcObj.pdfPath) {
      try {
        const existing = await fs.readFile(rcObj.pdfPath as string);
        return new NextResponse(new Uint8Array(existing), {
          headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="report-card-${rc.reportCardId}.pdf"` },
        });
      } catch { /* regenerate */ }
    }

    const html = generateReportCardHTML(rcObj);
    const puppeteer = await import("puppeteer-core");
    const executablePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    const browser = await puppeteer.default.launch({ headless: true, executablePath, args: ["--no-sandbox", "--disable-setuid-sandbox"] });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4", margin: { top: "15mm", bottom: "15mm", left: "12mm", right: "12mm" }, printBackground: true });

      const dir = path.join(process.cwd(), "generated", "report-cards");
      await fs.mkdir(dir, { recursive: true });
      const filePath = path.join(dir, `${rc.reportCardId}.pdf`);
      await fs.writeFile(filePath, pdfBuffer);
      await ReportCard.findByIdAndUpdate(id, { pdfPath: filePath });

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="report-card-${rc.reportCardId}.pdf"` },
      });
    } finally {
      await browser.close();
    }
  } catch (error: unknown) {
    console.error("Report card PDF error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
