import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";

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
    const { profilePicture } = await req.json();

    if (profilePicture && profilePicture.length > 500 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Please use an image under 400KB." },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findByIdAndUpdate(
      id,
      { $set: { profilePicture: profilePicture || "" } },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Photo updated successfully",
      student: {
        _id: student._id,
        profilePicture: student.profilePicture,
      },
    });
  } catch (error: unknown) {
    console.error("Student photo update error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
