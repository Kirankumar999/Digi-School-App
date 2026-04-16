import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";
import Teacher from "@/lib/models/Teacher";
import Class from "@/lib/models/Class";
import Attendance from "@/lib/models/Attendance";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();

    const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
      Student.countDocuments({ status: "Active" }),
      Teacher.countDocuments({ status: "Active" }),
      Class.countDocuments({ status: "Active" }),
    ]);

    const genderWise = await Student.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);

    const gradeWise = await Student.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: "$grade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthAttendance = await Attendance.find({ date: { $regex: `^${currentMonth}` } }).lean();
    const totalAttDays = monthAttendance.length;
    const avgAttendance = totalAttDays > 0
      ? Math.round(monthAttendance.reduce((s, a) => s + (a.records.length > 0 ? ((a.totalPresent + a.totalLate) / a.records.length) * 100 : 0), 0) / totalAttDays)
      : 0;

    const teacherQualifications = await Teacher.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: "$qualification", count: { $sum: 1 } } },
    ]);

    const studentTeacherRatio = totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0;

    const rteSeats = Math.ceil(totalStudents * 0.25);
    const udiseData = {
      schoolCategory: "Primary with Upper Primary",
      medium: "Marathi",
      totalStudents,
      totalTeachers,
      totalClasses,
      studentTeacherRatio,
      genderWise: Object.fromEntries(genderWise.map((g) => [g._id || "Other", g.count])),
      gradeWise: Object.fromEntries(gradeWise.map((g) => [g._id, g.count])),
      teacherQualifications: Object.fromEntries(teacherQualifications.map((t) => [t._id || "Unknown", t.count])),
    };

    return NextResponse.json({
      udise: udiseData,
      rte: { totalSeats: totalStudents, reservedSeats: rteSeats, filled: Math.min(rteSeats, Math.floor(totalStudents * 0.2)) },
      mdm: { eligibleStudents: totalStudents, avgAttendance, attendanceDays: totalAttDays },
      summary: { totalStudents, totalTeachers, totalClasses, studentTeacherRatio, avgAttendance },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
