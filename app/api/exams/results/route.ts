import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ExamResult from "@/lib/models/ExamResult";

function calcGrade(pct: number): string {
  if (pct >= 91) return "A+";
  if (pct >= 81) return "A";
  if (pct >= 71) return "B+";
  if (pct >= 61) return "B";
  if (pct >= 51) return "C";
  if (pct >= 41) return "D";
  return "F";
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId") || "";
    const studentId = searchParams.get("studentId") || "";

    const filter: Record<string, unknown> = {};
    if (examId) filter.examId = examId;
    if (studentId) filter.studentId = studentId;

    const results = await ExamResult.find(filter).sort({ rank: 1 }).lean();
    return NextResponse.json({ results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    if (Array.isArray(body.results)) {
      const processed = body.results.map((r: {
        marks: { obtained: number; maxMarks: number; passingMarks: number; subject: string }[];
        examId: string; examName: string; studentId: string; studentName: string; grade: string; section: string;
      }) => {
        const totalMax = r.marks.reduce((s: number, m: { maxMarks: number }) => s + m.maxMarks, 0);
        const totalObtained = r.marks.reduce((s: number, m: { obtained: number }) => s + m.obtained, 0);
        const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
        const marks = r.marks.map((m: { obtained: number; maxMarks: number; passingMarks: number; subject: string }) => ({
          ...m,
          grade: calcGrade(m.maxMarks > 0 ? (m.obtained / m.maxMarks) * 100 : 0),
          passed: m.obtained >= m.passingMarks,
        }));
        const allPassed = marks.every((m: { passed: boolean }) => m.passed);
        return {
          ...r,
          marks,
          totalMax,
          totalObtained,
          percentage,
          overallGrade: calcGrade(percentage),
          status: allPassed ? "Pass" : "Fail",
        };
      });

      processed.sort((a: { percentage: number }, b: { percentage: number }) => b.percentage - a.percentage);
      processed.forEach((r: { rank: number }, i: number) => { r.rank = i + 1; });

      const ops = processed.map((r: { examId: string; studentId: string }) => ({
        updateOne: {
          filter: { examId: r.examId, studentId: r.studentId },
          update: { $set: r },
          upsert: true,
        },
      }));

      await ExamResult.bulkWrite(ops);
      return NextResponse.json({ message: `${processed.length} results saved` }, { status: 201 });
    }

    return NextResponse.json({ error: "Results array required" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
