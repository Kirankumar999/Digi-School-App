import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/lib/models/Student";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const grade = searchParams.get("grade") || "";
    const section = searchParams.get("section") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (status) filter.status = status;

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Get students error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const student = await Student.create(body);

    return NextResponse.json(
      { message: "Student added successfully", student },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create student error:", error);
    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        { error: "A student with this ID already exists" },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Student IDs are required" }, { status: 400 });
    }

    await connectDB();
    const result = await Student.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: `${result.deletedCount} student(s) deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("Delete students error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
