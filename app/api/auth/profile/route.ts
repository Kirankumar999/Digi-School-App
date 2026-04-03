import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, phone, bio, profilePicture } = await req.json();

    await connectDB();

    const updateData: Record<string, string> = {};

    if (name !== undefined) {
      if (name.length < 2 || name.length > 50) {
        return NextResponse.json(
          { error: "Name must be between 2 and 50 characters" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 250) {
        return NextResponse.json(
          { error: "Bio must be at most 250 characters" },
          { status: 400 }
        );
      }
      updateData.bio = bio.trim();
    }

    if (profilePicture !== undefined) {
      const maxSize = 500 * 1024; // ~500KB base64
      if (profilePicture.length > maxSize) {
        return NextResponse.json(
          { error: "Profile picture is too large. Please use an image under 400KB." },
          { status: 400 }
        );
      }
      updateData.profilePicture = profilePicture;
    }

    console.log("Updating user:", authUser._id, "fields:", Object.keys(updateData));

    const user = await User.findByIdAndUpdate(
      authUser._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    console.log("Updated user profilePicture length:", user?.profilePicture?.length ?? 0);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
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
    console.error("Profile update error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
