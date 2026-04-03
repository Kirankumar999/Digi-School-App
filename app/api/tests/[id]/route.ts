import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TestResult from "@/lib/models/TestResult";

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

    const result = await TestResult.findById(id).lean();
    if (!result) {
      return NextResponse.json({ error: "Test result not found" }, { status: 404 });
    }

    return NextResponse.json({ testResult: result });
  } catch (error: unknown) {
    console.error("Get test result error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
