import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Class from "@/lib/models/Class";
import Student from "@/lib/models/Student";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const cls = await Class.findById(id).lean();
    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const studentCount = await Student.countDocuments({
      grade: cls.grade,
      section: cls.section,
      status: "Active",
    });

    return NextResponse.json({ class: { ...cls, studentCount } });
  } catch (error: unknown) {
    console.error("Get class error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const allowedFields = [
      "name", "grade", "section", "subject", "teacherId", "teacherName",
      "room", "schedule", "maxStudents", "academicYear", "description", "status",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const cls = await Class.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();

    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const studentCount = await Student.countDocuments({
      grade: cls.grade,
      section: cls.section,
      status: "Active",
    });

    return NextResponse.json({
      message: "Class updated successfully",
      class: { ...cls, studentCount },
    });
  } catch (error: unknown) {
    console.error("Update class error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
