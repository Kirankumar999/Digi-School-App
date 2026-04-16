import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const classGrade = searchParams.get("classGrade") || "";
    const section = searchParams.get("section") || "";

    if (!classGrade || !section) {
      return NextResponse.json({ error: "Class and section are required" }, { status: 400 });
    }

    const students = await Student.find({ grade: classGrade, section, status: "Active" })
      .sort({ firstName: 1, lastName: 1 })
      .select("_id firstName lastName studentId profilePicture")
      .lean();

    return NextResponse.json({ students });
  } catch (error: unknown) {
    console.error("Get attendance students error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
