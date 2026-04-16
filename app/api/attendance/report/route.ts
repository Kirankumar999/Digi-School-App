import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/lib/models/Attendance";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
    const classGrade = searchParams.get("classGrade") || "";
    const section = searchParams.get("section") || "";
    const studentId = searchParams.get("studentId") || "";

    const filter: Record<string, unknown> = {
      date: { $regex: `^${month}` },
    };
    if (classGrade) filter.classGrade = classGrade;
    if (section) filter.section = section;

    const records = await Attendance.find(filter).sort({ date: 1 }).lean();

    if (studentId) {
      let present = 0, absent = 0, late = 0, leave = 0, total = 0;
      for (const rec of records) {
        const sr = rec.records.find((r) => r.studentId === studentId);
        if (sr) {
          total++;
          if (sr.status === "present") present++;
          else if (sr.status === "absent") absent++;
          else if (sr.status === "late") late++;
          else if (sr.status === "leave") leave++;
        }
      }
      const percentage = total > 0 ? Math.round((present + late) / total * 100) : 0;
      return NextResponse.json({ studentId, month, present, absent, late, leave, total, percentage });
    }

    const summary = records.map((r) => ({
      date: r.date,
      classGrade: r.classGrade,
      section: r.section,
      totalPresent: r.totalPresent,
      totalAbsent: r.totalAbsent,
      totalLate: r.totalLate,
      totalLeave: r.totalLeave,
      totalStudents: r.records.length,
      percentage: r.records.length > 0
        ? Math.round((r.totalPresent + r.totalLate) / r.records.length * 100)
        : 0,
    }));

    const overallPresent = summary.reduce((a, b) => a + b.totalPresent, 0);
    const overallTotal = summary.reduce((a, b) => a + b.totalStudents, 0);

    return NextResponse.json({
      month,
      days: summary,
      overallPercentage: overallTotal > 0 ? Math.round(overallPresent / overallTotal * 100) : 0,
      totalDays: summary.length,
    });
  } catch (error: unknown) {
    console.error("Attendance report error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
