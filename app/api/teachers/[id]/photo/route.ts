import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/lib/models/Teacher";

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

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: { profilePicture: profilePicture || "" } },
      { new: true }
    );

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Photo updated successfully",
      teacher: {
        _id: teacher._id,
        profilePicture: teacher.profilePicture,
      },
    });
  } catch (error: unknown) {
    console.error("Teacher photo update error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
