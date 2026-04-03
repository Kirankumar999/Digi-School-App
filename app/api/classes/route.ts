import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Class from "@/lib/models/Class";
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
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { classId: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { teacherName: { $regex: search, $options: "i" } },
      ];
    }
    if (grade) filter.grade = grade;
    if (status) filter.status = status;

    const total = await Class.countDocuments(filter);
    const classes = await Class.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const enriched = await Promise.all(
      classes.map(async (cls) => {
        const studentCount = await Student.countDocuments({
          grade: cls.grade,
          section: cls.section,
          status: "Active",
        });
        return { ...cls, studentCount };
      })
    );

    return NextResponse.json({
      classes: enriched,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    console.error("Get classes error:", error);
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

    const cls = await Class.create(body);

    return NextResponse.json(
      { message: "Class added successfully", class: cls },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create class error:", error);
    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        { error: "A class with this ID already exists" },
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
      return NextResponse.json({ error: "Class IDs are required" }, { status: 400 });
    }

    await connectDB();
    const result = await Class.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: `${result.deletedCount} class(es) deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("Delete classes error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
