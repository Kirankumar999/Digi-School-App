import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
        phone: user.phone || "",
        bio: user.bio || "",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
