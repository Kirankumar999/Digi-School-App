import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Exam from "@/lib/models/Exam";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (grade) filter.grade = grade;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const total = await Exam.countDocuments(filter);
    const exams = await Exam.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();

    return NextResponse.json({ exams, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    const examId = `EXM-${Date.now().toString(36).toUpperCase()}`;
    const exam = await Exam.create({
      ...body,
      examId,
      createdBy: user.name || "",
    });

    return NextResponse.json({ message: "Exam created", exam }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { ids } = await req.json();
    if (!ids?.length) return NextResponse.json({ error: "IDs required" }, { status: 400 });

    await connectDB();
    const result = await Exam.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: `${result.deletedCount} exam(s) deleted` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
