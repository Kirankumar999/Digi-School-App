import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/lib/models/Attendance";
import Student from "@/lib/models/Student";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "";
    const classGrade = searchParams.get("classGrade") || "";
    const section = searchParams.get("section") || "";
    const month = searchParams.get("month") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "31", 10);

    const filter: Record<string, unknown> = {};
    if (date) filter.date = date;
    if (classGrade) filter.classGrade = classGrade;
    if (section) filter.section = section;
    if (month) {
      filter.date = { $regex: `^${month}` };
    }

    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      attendance: records,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    console.error("Get attendance error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { date, classGrade, section, records } = body;

    if (!date || !classGrade || !section) {
      return NextResponse.json({ error: "Date, class, and section are required" }, { status: 400 });
    }

    await connectDB();

    let studentRecords = records;
    if (!studentRecords || studentRecords.length === 0) {
      const students = await Student.find({ grade: classGrade, section, status: "Active" })
        .sort({ firstName: 1, lastName: 1 })
        .lean();
      studentRecords = students.map((s) => ({
        studentId: (s._id as string).toString(),
        studentName: `${s.firstName} ${s.lastName}`,
        status: "present",
      }));
    }

    const totals = {
      totalPresent: studentRecords.filter((r: { status: string }) => r.status === "present").length,
      totalAbsent: studentRecords.filter((r: { status: string }) => r.status === "absent").length,
      totalLate: studentRecords.filter((r: { status: string }) => r.status === "late").length,
      totalLeave: studentRecords.filter((r: { status: string }) => r.status === "leave").length,
    };

    const attendance = await Attendance.findOneAndUpdate(
      { date, classGrade, section },
      {
        date,
        classGrade,
        section,
        records: studentRecords,
        markedBy: user.name || user._id?.toString() || "",
        ...totals,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Attendance saved", attendance }, { status: 201 });
  } catch (error: unknown) {
    console.error("Save attendance error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
