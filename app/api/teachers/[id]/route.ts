import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/lib/models/Teacher";

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

    const teacher = await Teacher.findById(id).lean();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ teacher });
  } catch (error: unknown) {
    console.error("Get teacher error:", error);
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
      "firstName", "lastName", "email", "phone", "dateOfBirth",
      "gender", "subject", "department", "qualification", "experience",
      "address", "salary", "status",
    ];

    const updateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const teacher = await Teacher.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Teacher updated successfully", teacher });
  } catch (error: unknown) {
    console.error("Update teacher error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
