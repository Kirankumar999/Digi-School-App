import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import FeeStructure from "@/lib/models/FeeStructure";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get("grade") || "";
    const academicYear = searchParams.get("academicYear") || "";

    const filter: Record<string, unknown> = { status: "Active" };
    if (grade) filter.grade = grade;
    if (academicYear) filter.academicYear = academicYear;

    const structures = await FeeStructure.find(filter).sort({ grade: 1 }).lean();
    return NextResponse.json({ structures });
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

    const totalAmount = (body.components || []).reduce((s: number, c: { amount: number }) => s + c.amount, 0);

    const structure = await FeeStructure.findOneAndUpdate(
      { grade: body.grade, academicYear: body.academicYear },
      { ...body, totalAmount },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Fee structure saved", structure }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
