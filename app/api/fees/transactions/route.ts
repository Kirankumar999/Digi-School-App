import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import FeeTransaction from "@/lib/models/FeeTransaction";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId") || "";
    const grade = searchParams.get("grade") || "";
    const status = searchParams.get("status") || "";
    const academicYear = searchParams.get("academicYear") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (studentId) filter.studentId = studentId;
    if (grade) filter.grade = grade;
    if (status) filter.status = status;
    if (academicYear) filter.academicYear = academicYear;

    const total = await FeeTransaction.countDocuments(filter);
    const transactions = await FeeTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const allForYear = await FeeTransaction.find(academicYear ? { academicYear } : {}).lean();
    const totalCollected = allForYear.reduce((s, t) => s + t.amountPaid, 0);
    const totalPending = allForYear.filter((t) => t.status === "Pending").reduce((s, t) => s + (t.totalFee - t.amountPaid), 0);

    return NextResponse.json({
      transactions,
      summary: { totalCollected, totalPending, totalTransactions: total },
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
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

    const transactionId = `FEE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const receiptNumber = `RCP-${Date.now().toString().slice(-8)}`;

    const transaction = await FeeTransaction.create({
      ...body,
      transactionId,
      receiptNumber,
      collectedBy: user.name || "",
    });

    return NextResponse.json({ message: "Payment recorded", transaction }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
