import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Teacher from "@/lib/models/Teacher";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const subject = searchParams.get("subject") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { teacherId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (department) filter.department = department;
    if (subject) filter.subject = subject;
    if (status) filter.status = status;

    const total = await Teacher.countDocuments(filter);
    const teachers = await Teacher.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      teachers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Get teachers error:", error);
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

    const teacher = await Teacher.create(body);

    return NextResponse.json(
      { message: "Teacher added successfully", teacher },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create teacher error:", error);
    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        { error: "A teacher with this ID already exists" },
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
      return NextResponse.json({ error: "Teacher IDs are required" }, { status: 400 });
    }

    await connectDB();
    const result = await Teacher.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: `${result.deletedCount} teacher(s) deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("Delete teachers error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
