import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";
import TestResult from "@/lib/models/TestResult";
import ReportCard from "@/lib/models/ReportCard";
import { GenerateReportCardRequestSchema, ReportCardAIResponseSchema } from "@/lib/report-card/schema";
import { buildReportCardPrompt, buildReportCardRetryPrompt } from "@/lib/report-card/prompt-engine";

function extractJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
}

function calcGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });

    const body = await req.json();
    const parsed = GenerateReportCardRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });

    const genReq = parsed.data;
    await connectDB();

    const student = await Student.findById(genReq.studentId).lean();
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const classNum = parseInt(student.grade) || 1;
    console.log("classNum", classNum);
    console.log("student", student);

    const subjectAgg = await TestResult.aggregate([
      { $match: { studentId: student._id } },
      {
        $group: {
          _id: "$subject",
          totalMarks: { $sum: "$totalMarks" },
          marksObtained: { $sum: "$marksObtained" },
          testsCount: { $sum: 1 },
        },
      },
    ]);

    if (subjectAgg.length === 0) {
      return NextResponse.json({ error: "No test results found for this student. Evaluate at least one test first." }, { status: 400 });
    }

    const subjects = subjectAgg.map((s: { _id: string; totalMarks: number; marksObtained: number; testsCount: number }) => ({
      subject: s._id,
      totalMarks: s.totalMarks,
      marksObtained: s.marksObtained,
      percentage: s.totalMarks > 0 ? Math.round((s.marksObtained / s.totalMarks) * 1000) / 10 : 0,
      grade: calcGrade(s.totalMarks > 0 ? (s.marksObtained / s.totalMarks) * 100 : 0),
      testsCount: s.testsCount,
    }));

    const grandTotal = subjects.reduce((s, x) => s + x.totalMarks, 0);
    const grandObtained = subjects.reduce((s, x) => s + x.marksObtained, 0);
    const overallPercentage = grandTotal > 0 ? Math.round((grandObtained / grandTotal) * 1000) / 10 : 0;
    const overallGrade = calcGrade(overallPercentage);

    const prompt = buildReportCardPrompt({
      studentName: `${student.firstName} ${student.lastName}`,
      classNum,
      section: student.section || "",
      term: genReq.term,
      academicYear: genReq.academicYear,
      subjects,
      overallPercentage,
      overallGrade,
    });

    const anthropic = new Anthropic({ apiKey });
    let aiData;
    let attempts = 0;
    let lastError = "";

    while (attempts < 2) {
      attempts++;
      const currentPrompt = attempts === 1 ? prompt : buildReportCardRetryPrompt(prompt, lastError);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{ role: "user", content: currentPrompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") { lastError = "Non-text response"; continue; }

      try {
        const raw = JSON.parse(extractJSON(content.text));
        const validated = ReportCardAIResponseSchema.safeParse(raw);
        if (!validated.success) {
          lastError = validated.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
          if (attempts < 2) continue;
          return NextResponse.json({ error: "AI validation failed", details: lastError }, { status: 422 });
        }
        aiData = validated.data;
        break;
      } catch (e) {
        lastError = e instanceof Error ? e.message : "JSON parse error";
        if (attempts < 2) continue;
        return NextResponse.json({ error: "Failed to parse AI response", details: lastError }, { status: 422 });
      }
    }

    if (!aiData) return NextResponse.json({ error: "AI generation failed" }, { status: 500 });

    const remarksMap = new Map(aiData.subjectRemarks.map((r) => [r.subject, r.remarks]));
    const subjectGrades = subjects.map((s) => ({
      ...s,
      remarks: remarksMap.get(s.subject) || "",
    }));

    const att = genReq.attendance || { totalDays: 0, presentDays: 0 };
    const attPct = att.totalDays > 0 ? Math.round((att.presentDays / att.totalDays) * 1000) / 10 : 0;

    const reportCardId = `RC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const saved = await ReportCard.create({
      reportCardId,
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentGrade: student.grade,
      studentSection: student.section || "",
      classNum,
      term: genReq.term,
      academicYear: genReq.academicYear,
      subjectGrades,
      overallPercentage,
      overallGrade,
      attendance: { totalDays: att.totalDays, presentDays: att.presentDays, percentage: attPct },
      aiRemarks: aiData.aiRemarks,
      strengths: aiData.strengths,
      areasToImprove: aiData.areasToImprove,
      recommendations: aiData.recommendations,
      teacherComments: genReq.teacherComments || "",
      principalComments: genReq.principalComments || "",
      coScholastic: aiData.coScholastic,
      generatedBy: user._id?.toString() || "",
    });

    return NextResponse.json({
      message: "Report card generated successfully",
      reportCard: saved.toObject(),
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Generate report card error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
