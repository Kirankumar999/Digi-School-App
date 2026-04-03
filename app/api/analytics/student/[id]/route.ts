import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TestResult from "@/lib/models/TestResult";
import Student from "@/lib/models/Student";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const student = await Student.findById(id).lean();
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const tests = await TestResult.find({ studentId: id })
      .select("-questions -imageData")
      .sort({ createdAt: -1 })
      .lean();

    const subjectPerformance = await TestResult.aggregate([
      { $match: { studentId: student._id } },
      {
        $group: {
          _id: "$subject",
          avgPercentage: { $avg: "$percentage" },
          totalMarks: { $sum: "$totalMarks" },
          marksObtained: { $sum: "$marksObtained" },
          testsCount: { $sum: 1 },
          bestScore: { $max: "$percentage" },
          worstScore: { $min: "$percentage" },
          grades: { $push: "$grade" },
        },
      },
      { $sort: { avgPercentage: -1 } },
    ]);

    const overallStats = tests.length > 0
      ? {
          totalTests: tests.length,
          avgPercentage: Math.round((tests.reduce((s, t) => s + t.percentage, 0) / tests.length) * 10) / 10,
          bestPercentage: Math.max(...tests.map((t) => t.percentage)),
          worstPercentage: Math.min(...tests.map((t) => t.percentage)),
          totalMarks: tests.reduce((s, t) => s + t.totalMarks, 0),
          totalObtained: tests.reduce((s, t) => s + t.marksObtained, 0),
        }
      : { totalTests: 0, avgPercentage: 0, bestPercentage: 0, worstPercentage: 0, totalMarks: 0, totalObtained: 0 };

    const testTimeline = tests.map((t) => ({
      _id: t._id,
      testName: t.testName,
      subject: t.subject,
      percentage: t.percentage,
      grade: t.grade,
      marksObtained: t.marksObtained,
      totalMarks: t.totalMarks,
      createdAt: t.createdAt,
    }));

    const gradeCount: Record<string, number> = {};
    tests.forEach((t) => { gradeCount[t.grade] = (gradeCount[t.grade] || 0) + 1; });

    return NextResponse.json({
      student: { _id: student._id, firstName: student.firstName, lastName: student.lastName, grade: student.grade, section: student.section, profilePicture: student.profilePicture },
      analytics: {
        overallStats,
        subjectPerformance: subjectPerformance.map((s: { _id: string; avgPercentage: number; totalMarks: number; marksObtained: number; testsCount: number; bestScore: number; worstScore: number }) => ({
          subject: s._id,
          avgPercentage: Math.round(s.avgPercentage * 10) / 10,
          totalMarks: s.totalMarks,
          marksObtained: s.marksObtained,
          testsCount: s.testsCount,
          bestScore: s.bestScore,
          worstScore: s.worstScore,
          grade: s.avgPercentage >= 90 ? "A+" : s.avgPercentage >= 80 ? "A" : s.avgPercentage >= 70 ? "B+" : s.avgPercentage >= 60 ? "B" : s.avgPercentage >= 50 ? "C" : s.avgPercentage >= 40 ? "D" : "F",
        })),
        gradeDistribution: Object.entries(gradeCount).map(([grade, count]) => ({ grade, count })),
        testTimeline,
      },
    });
  } catch (error: unknown) {
    console.error("Student analytics error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
