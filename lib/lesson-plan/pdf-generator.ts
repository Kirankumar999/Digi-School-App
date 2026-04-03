import type { LessonPlanAIResponse } from "./schema";

interface LessonPlanPDFOptions {
  schoolName?: string;
  classNum: number;
  subject: string;
  chapter: string;
  topic?: string;
  duration: string;
  teachingMethod: string;
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "<br/>");
}

const PHASE_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  Introduction: { bg: "#fef3c7", border: "#f59e0b", icon: "🌟" },
  "Warm-up": { bg: "#fef3c7", border: "#f59e0b", icon: "🌟" },
  Explanation: { bg: "#dbeafe", border: "#3b82f6", icon: "📖" },
  Teaching: { bg: "#dbeafe", border: "#3b82f6", icon: "📖" },
  Practice: { bg: "#d1fae5", border: "#10b981", icon: "✏️" },
  Activity: { bg: "#d1fae5", border: "#10b981", icon: "🎯" },
  Assessment: { bg: "#ede9fe", border: "#8b5cf6", icon: "📋" },
  Closure: { bg: "#ede9fe", border: "#8b5cf6", icon: "📋" },
  Research: { bg: "#fce7f3", border: "#ec4899", icon: "🔍" },
  Presentation: { bg: "#fff7ed", border: "#f97316", icon: "🎤" },
  Reflection: { bg: "#f0fdf4", border: "#22c55e", icon: "💭" },
};

function getPhaseStyle(phaseName: string) {
  for (const [key, val] of Object.entries(PHASE_COLORS)) {
    if (phaseName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: "#f1f5f9", border: "#64748b", icon: "📌" };
}

export function generateLessonPlanHTML(plan: LessonPlanAIResponse, opts: LessonPlanPDFOptions): string {
  const schoolName = opts.schoolName || "DigiSchool";
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const phasesHTML = plan.lessonFlow
    .map((p, i) => {
      const style = getPhaseStyle(p.phase);
      return `
      <div class="phase" style="border-left: 4px solid ${style.border}; background: ${style.bg}20;">
        <div class="phase-header">
          <span class="phase-icon">${style.icon}</span>
          <div>
            <span class="phase-name" style="color: ${style.border};">Phase ${i + 1}: ${esc(p.phase)}</span>
            <span class="phase-dur">${esc(p.duration)}</span>
          </div>
        </div>
        <p class="phase-activity">${esc(p.activity)}</p>
        <div class="phase-roles">
          <div class="role"><strong>👨‍🏫 Teacher:</strong> ${esc(p.teacherActions)}</div>
          <div class="role"><strong>👩‍🎓 Students:</strong> ${esc(p.studentActions)}</div>
          ${p.tips ? `<div class="role tip"><strong>💡 Tip:</strong> ${esc(p.tips)}</div>` : ""}
        </div>
      </div>`;
    })
    .join("");

  const objectivesHTML = plan.learningObjectives.map((o, i) => `<li><span class="obj-num">${i + 1}</span> ${esc(o)}</li>`).join("");
  const prereqHTML = plan.prerequisites.map((p) => `<span class="tag prereq-tag">${esc(p)}</span>`).join("");
  const materialsHTML = plan.materialsNeeded.map((m) => `<span class="tag mat-tag">${esc(m)}</span>`).join("");
  const criteriaHTML = plan.assessmentCriteria.map((c) => `<li>☑ ${esc(c)}</li>`).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 11.5px; line-height: 1.6; color: #1e293b; padding: 36px; }

  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #7c3aed; padding-bottom: 14px; margin-bottom: 18px; }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .school-logo { width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #a855f7); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 800; }
  .school-name { font-size: 17px; font-weight: 800; color: #0f172a; }
  .header-right { text-align: right; font-size: 10px; color: #64748b; line-height: 1.8; }

  .title { text-align: center; font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
  .meta-bar { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; font-size: 10.5px; color: #64748b; margin-bottom: 16px; padding: 8px 16px; background: #faf5ff; border-radius: 8px; border: 1px solid #ede9fe; }
  .meta-bar span { display: flex; align-items: center; gap: 4px; }

  .section { margin-bottom: 16px; }
  .section-title { font-size: 12px; font-weight: 700; color: #7c3aed; margin-bottom: 8px; padding: 5px 12px; background: #faf5ff; border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0; display: flex; align-items: center; gap: 6px; }

  .objectives { list-style: none; padding: 0; }
  .objectives li { padding: 4px 0 4px 8px; font-size: 11px; display: flex; align-items: flex-start; gap: 8px; }
  .obj-num { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #7c3aed; color: white; font-size: 9px; font-weight: 700; flex-shrink: 0; }

  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .prereq-tag { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
  .mat-tag { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }

  .phase { padding: 12px 14px; border-radius: 8px; margin-bottom: 10px; }
  .phase-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .phase-icon { font-size: 18px; }
  .phase-name { font-size: 12px; font-weight: 700; }
  .phase-dur { font-size: 10px; color: #64748b; margin-left: 8px; background: white; padding: 2px 8px; border-radius: 10px; }
  .phase-activity { font-size: 11px; color: #334155; margin-bottom: 8px; padding: 6px 0; }
  .phase-roles { display: grid; gap: 4px; }
  .role { font-size: 10.5px; color: #475569; padding: 4px 8px; background: rgba(255,255,255,0.7); border-radius: 4px; }
  .tip { background: #fffbeb; border: 1px dashed #fbbf24; }

  .diff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .diff-card { padding: 10px 12px; border-radius: 8px; font-size: 10.5px; }
  .diff-card strong { display: block; font-size: 11px; margin-bottom: 4px; }
  .diff-slow { background: #fff7ed; border: 1px solid #fed7aa; }
  .diff-slow strong { color: #c2410c; }
  .diff-advanced { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .diff-advanced strong { color: #15803d; }
  .diff-visual { background: #eff6ff; border: 1px solid #bfdbfe; }
  .diff-visual strong { color: #1d4ed8; }
  .diff-kinesthetic { background: #fdf4ff; border: 1px solid #e9d5ff; }
  .diff-kinesthetic strong { color: #7e22ce; }

  .board-box { background: #1e293b; color: #e2e8f0; padding: 14px 16px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 11px; white-space: pre-wrap; line-height: 1.7; }

  .criteria-list { list-style: none; padding: 0; columns: 2; column-gap: 16px; }
  .criteria-list li { font-size: 10.5px; padding: 3px 0; break-inside: avoid; }

  .hw-box { background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #78350f; }
  .cross-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #14532d; }
  .reflect-box { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #581c87; font-style: italic; }

  .footer { margin-top: 24px; padding-top: 10px; border-top: 2px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8; }

  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="school-logo">${schoolName[0]}</div>
      <div class="school-name">${esc(schoolName)}</div>
    </div>
    <div class="header-right">
      <div>Date: ${date}</div>
      <div>NCERT Aligned Lesson Plan</div>
      <div>Method: ${esc(opts.teachingMethod)}</div>
    </div>
  </div>

  <div class="title">${esc(plan.title)}</div>
  <div class="meta-bar">
    <span>📚 Class ${opts.classNum}</span>
    <span>📖 ${esc(opts.subject)}</span>
    <span>📑 ${esc(opts.chapter)}</span>
    ${opts.topic ? `<span>🎯 ${esc(opts.topic)}</span>` : ""}
    <span>⏱ ${esc(opts.duration)}</span>
    <span>📋 ${esc(opts.teachingMethod)}</span>
  </div>

  <div class="section">
    <div class="section-title">🎯 Learning Objectives</div>
    <ul class="objectives">${objectivesHTML}</ul>
  </div>

  <div class="section">
    <div class="section-title">📌 Prerequisites</div>
    <div class="tags">${prereqHTML}</div>
  </div>

  <div class="section">
    <div class="section-title">🧰 Materials Needed</div>
    <div class="tags">${materialsHTML}</div>
  </div>

  <div class="section">
    <div class="section-title">📋 Lesson Flow</div>
    ${phasesHTML}
  </div>

  <div class="section">
    <div class="section-title">🔀 Differentiated Instruction</div>
    <div class="diff-grid">
      <div class="diff-card diff-slow"><strong>🐢 Slow Learners</strong>${esc(plan.differentiatedInstruction.slowLearners)}</div>
      <div class="diff-card diff-advanced"><strong>🚀 Advanced Learners</strong>${esc(plan.differentiatedInstruction.advancedLearners)}</div>
      ${plan.differentiatedInstruction.visualLearners ? `<div class="diff-card diff-visual"><strong>👁 Visual Learners</strong>${esc(plan.differentiatedInstruction.visualLearners)}</div>` : ""}
      ${plan.differentiatedInstruction.kinestheticLearners ? `<div class="diff-card diff-kinesthetic"><strong>🤲 Kinesthetic Learners</strong>${esc(plan.differentiatedInstruction.kinestheticLearners)}</div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">🖊 Board Work</div>
    <div class="board-box">${esc(plan.boardWork)}</div>
  </div>

  <div class="section">
    <div class="section-title">✅ Assessment Criteria</div>
    <ul class="criteria-list">${criteriaHTML}</ul>
  </div>

  <div class="section">
    <div class="section-title">📝 Homework</div>
    <div class="hw-box">${esc(plan.homework)}</div>
  </div>

  ${plan.crossCurricularLinks ? `
  <div class="section">
    <div class="section-title">🔗 Cross-Curricular Links</div>
    <div class="cross-box">${esc(plan.crossCurricularLinks)}</div>
  </div>` : ""}

  ${plan.teacherReflection ? `
  <div class="section">
    <div class="section-title">💭 Teacher's Reflection</div>
    <div class="reflect-box">${esc(plan.teacherReflection)}</div>
  </div>` : ""}

  <div class="footer">
    <span>Generated by ${esc(schoolName)} — AI Lesson Plan Generator</span>
    <span>NCERT Class ${opts.classNum} ${esc(opts.subject)}</span>
  </div>
</body>
</html>`;
}

export async function generateLessonPlanPDF(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const executablePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  const browser = await puppeteer.default.launch({
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
      printBackground: true,
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
