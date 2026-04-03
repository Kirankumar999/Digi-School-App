import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TestResult from "@/lib/models/TestResult";
import Student from "@/lib/models/Student";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();

    const [totalStudents, totalTests, subjectAgg, gradeDistribution, recentTests, trendAgg] =
      await Promise.all([
        Student.countDocuments({ status: "Active" }),
        TestResult.countDocuments(),
        TestResult.aggregate([
          {
            $group: {
              _id: "$subject",
              avgPercentage: { $avg: "$percentage" },
              totalTests: { $sum: 1 },
              avgMarks: { $avg: "$marksObtained" },
            },
          },
          { $sort: { totalTests: -1 } },
          { $limit: 10 },
        ]),
        TestResult.aggregate([
          { $group: { _id: "$grade", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        TestResult.find()
          .select("testName subject studentName percentage grade createdAt")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
        TestResult.aggregate([
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" },
              },
              avgPercentage: { $avg: "$percentage" },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          { $limit: 12 },
        ]),
      ]);

    const avgPercentage =
      totalTests > 0
        ? subjectAgg.reduce((sum: number, s: { avgPercentage: number; totalTests: number }) => sum + s.avgPercentage * s.totalTests, 0) /
          subjectAgg.reduce((sum: number, s: { totalTests: number }) => sum + s.totalTests, 0)
        : 0;

    const topPerformers = await TestResult.aggregate([
      { $group: { _id: "$studentId", studentName: { $first: "$studentName" }, avgPercentage: { $avg: "$percentage" }, testsCount: { $sum: 1 } } },
      { $match: { testsCount: { $gte: 1 } } },
      { $sort: { avgPercentage: -1 } },
      { $limit: 5 },
    ]);

    const needsAttention = await TestResult.aggregate([
      { $group: { _id: "$studentId", studentName: { $first: "$studentName" }, avgPercentage: { $avg: "$percentage" }, testsCount: { $sum: 1 } } },
      { $match: { avgPercentage: { $lt: 50 }, testsCount: { $gte: 1 } } },
      { $sort: { avgPercentage: 1 } },
      { $limit: 5 },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trend = trendAgg.map((t: { _id: { month: number; year: number }; avgPercentage: number; count: number }) => ({
      label: `${months[t._id.month - 1]} ${t._id.year}`,
      avgPercentage: Math.round(t.avgPercentage * 10) / 10,
      count: t.count,
    }));

    return NextResponse.json({
      overview: {
        totalStudents,
        totalTests,
        avgPercentage: Math.round(avgPercentage * 10) / 10,
        subjectPerformance: subjectAgg.map((s: { _id: string; avgPercentage: number; totalTests: number }) => ({
          subject: s._id,
          avgPercentage: Math.round(s.avgPercentage * 10) / 10,
          totalTests: s.totalTests,
        })),
        gradeDistribution: gradeDistribution.map((g: { _id: string; count: number }) => ({
          grade: g._id,
          count: g.count,
        })),
        trend,
        topPerformers: topPerformers.map((p: { _id: string; studentName: string; avgPercentage: number; testsCount: number }) => ({
          studentId: p._id,
          studentName: p.studentName,
          avgPercentage: Math.round(p.avgPercentage * 10) / 10,
          testsCount: p.testsCount,
        })),
        needsAttention: needsAttention.map((p: { _id: string; studentName: string; avgPercentage: number; testsCount: number }) => ({
          studentId: p._id,
          studentName: p.studentName,
          avgPercentage: Math.round(p.avgPercentage * 10) / 10,
          testsCount: p.testsCount,
        })),
        recentTests,
      },
    });
  } catch (error: unknown) {
    console.error("Analytics overview error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
