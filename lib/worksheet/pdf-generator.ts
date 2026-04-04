import type { WorksheetAIResponse, Question } from "./schema";

interface PDFOptions {
  schoolName?: string;
  schoolLogo?: string;
  classNum: number;
  subject: string;
  chapter: string;
  difficulty: string;
  includeAnswerKey: boolean;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderQuestion(q: Question, idx: number): string {
  const qText = escapeHtml(q.question);
  let html = `<div class="question"><span class="q-num">Q${idx + 1}.</span> <span class="q-text">${qText}</span> <span class="marks">[${q.marks} mark${q.marks > 1 ? "s" : ""}]</span>`;

  if (q.type === "mcq") {
    html += '<div class="options">';
    q.options.forEach((opt, i) => {
      html += `<div class="option">(${String.fromCharCode(97 + i)}) ${escapeHtml(opt)}</div>`;
    });
    html += "</div>";
  }

  if (q.type === "match_the_following") {
    html += '<table class="match-table"><thead><tr><th>Column A</th><th>Column B</th></tr></thead><tbody>';
    const shuffledRight = [...q.pairs].sort(() => Math.random() - 0.5);
    q.pairs.forEach((pair, i) => {
      html += `<tr><td>${i + 1}. ${escapeHtml(pair.left)}</td><td>${String.fromCharCode(97 + i)}. ${escapeHtml(shuffledRight[i].right)}</td></tr>`;
    });
    html += "</tbody></table>";
  }

  if (q.type === "fill_in_the_blank") {
    // Already has ___ in the question
  }

  if (q.type === "true_false") {
    html += '<div class="tf-options">(a) True &nbsp;&nbsp;&nbsp; (b) False</div>';
  }

  html += "</div>";
  return html;
}

function renderAnswerKey(questions: Question[]): string {
  let html = '<div class="answer-key"><h2>Answer Key</h2><div class="answer-grid">';
  questions.forEach((q, idx) => {
    let ans: string;
    if (q.type === "true_false") {
      ans = q.answer ? "True" : "False";
    } else if (q.type === "match_the_following") {
      ans = q.pairs.map((p) => `${p.left} → ${p.right}`).join("; ");
    } else {
      ans = String(q.answer);
    }
    html += `<div class="answer-item"><strong>Q${idx + 1}:</strong> ${escapeHtml(ans)}`;
    if (q.explanation) {
      html += `<div class="explanation"><em>${escapeHtml(q.explanation)}</em></div>`;
    }
    html += "</div>";
  });
  html += "</div></div>";
  return html;
}

export function generateWorksheetHTML(worksheet: WorksheetAIResponse, options: PDFOptions): string {
  const groupedQuestions: Record<string, { questions: Question[]; label: string }> = {};
  const typeLabels: Record<string, string> = {
    mcq: "Multiple Choice Questions",
    short_answer: "Short Answer Questions",
    long_answer: "Long Answer Questions",
    fill_in_the_blank: "Fill in the Blanks",
    true_false: "True or False",
    match_the_following: "Match the Following",
  };

  worksheet.questions.forEach((q) => {
    if (!groupedQuestions[q.type]) {
      groupedQuestions[q.type] = { questions: [], label: typeLabels[q.type] || q.type };
    }
    groupedQuestions[q.type].questions.push(q);
  });

  let questionsHTML = "";
  let globalIdx = 0;
  for (const [, group] of Object.entries(groupedQuestions)) {
    questionsHTML += `<div class="section-header">${group.label}</div>`;
    for (const q of group.questions) {
      questionsHTML += renderQuestion(q, globalIdx);
      globalIdx++;
    }
  }

  const schoolName = options.schoolName || "DigiSchool";
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #1e293b; padding: 40px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 16px; margin-bottom: 20px; }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .school-logo { width: 48px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, #0d9488, #10b981); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; }
  .school-name { font-size: 18px; font-weight: 700; color: #0f172a; }
  .header-right { text-align: right; font-size: 11px; color: #64748b; }
  .title { text-align: center; font-size: 16px; font-weight: 700; color: #0f172a; margin: 16px 0 8px; }
  .meta { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 16px; padding: 8px 12px; background: #f8fafc; border-radius: 6px; }
  .instructions { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 6px; padding: 10px 14px; font-size: 11px; color: #115e59; margin-bottom: 20px; }
  .instructions strong { color: #0d9488; }
  .student-info { display: flex; gap: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; }
  .student-info div { flex: 1; }
  .student-info label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  .student-info .line { border-bottom: 1px dotted #cbd5e1; min-height: 18px; }
  .section-header { font-size: 13px; font-weight: 700; color: #0d9488; margin: 18px 0 10px; padding: 6px 12px; background: #f0fdfa; border-left: 3px solid #0d9488; border-radius: 0 4px 4px 0; }
  .question { margin-bottom: 14px; padding-left: 4px; }
  .q-num { font-weight: 700; color: #0d9488; }
  .q-text { color: #1e293b; }
  .marks { font-size: 10px; color: #94a3b8; float: right; }
  .options { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; margin: 6px 0 0 24px; }
  .option { font-size: 11.5px; color: #334155; }
  .tf-options { margin: 6px 0 0 24px; font-size: 11.5px; color: #334155; }
  .match-table { margin: 8px 0 0 24px; border-collapse: collapse; font-size: 11.5px; width: 80%; }
  .match-table th { background: #f0fdfa; color: #0d9488; padding: 4px 10px; text-align: left; border: 1px solid #e2e8f0; }
  .match-table td { padding: 4px 10px; border: 1px solid #e2e8f0; }
  .footer { margin-top: 30px; padding-top: 10px; border-top: 2px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
  .answer-key { page-break-before: always; }
  .answer-key h2 { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 2px solid #0d9488; }
  .answer-grid { display: grid; gap: 10px; }
  .answer-item { padding: 8px 12px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #0d9488; font-size: 11.5px; }
  .explanation { margin-top: 4px; font-size: 10.5px; color: #64748b; }
  @media print { body { padding: 20px; } .answer-key { page-break-before: always; } }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="school-logo">${schoolName[0]}</div>
      <div class="school-name">${escapeHtml(schoolName)}</div>
    </div>
    <div class="header-right">
      <div>Date: ${date}</div>
      <div>MSCERT Aligned</div>
    </div>
  </div>

  <div class="title">${escapeHtml(worksheet.title)}</div>

  <div class="meta">
    <span>Class: ${options.classNum} | Subject: ${escapeHtml(options.subject)} | Chapter: ${escapeHtml(options.chapter)}</span>
    <span>Total Marks: ${worksheet.totalMarks} | Time: ${escapeHtml(worksheet.estimatedTime)} | Difficulty: ${options.difficulty}</span>
  </div>

  <div class="student-info">
    <div><label>Student Name</label><div class="line"></div></div>
    <div><label>Roll Number</label><div class="line"></div></div>
    <div><label>Section</label><div class="line"></div></div>
  </div>

  <div class="instructions"><strong>Instructions:</strong> ${escapeHtml(worksheet.instructions)}</div>

  ${questionsHTML}

  <div class="footer">
    <span>Generated by ${escapeHtml(schoolName)} — Smart Worksheet Generator</span>
    <span>MSCERT Class ${options.classNum} ${escapeHtml(options.subject)}</span>
  </div>

  ${options.includeAnswerKey ? renderAnswerKey(worksheet.questions) : ""}
</body>
</html>`;
}

export async function generatePDF(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");

  const executablePath =
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

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
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
      printBackground: true,
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
