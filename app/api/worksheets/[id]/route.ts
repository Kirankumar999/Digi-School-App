import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Worksheet from "@/lib/models/Worksheet";

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

    const worksheet = await Worksheet.findById(id).lean();
    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    return NextResponse.json({ worksheet });
  } catch (error: unknown) {
    console.error("Get worksheet error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
