// app/api/profile/avatar/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "chat-app/avatars", // Organize uploads in folders
            public_id: `avatar_${session.user.email}_${Date.now()}`, // Unique ID
            transformation: [
              { width: 200, height: 200, crop: "fill", gravity: "face" }, // Auto-resize and crop to face
              { quality: "auto", fetch_format: "auto" }, // Optimize quality and format
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const avatarUrl = (uploadResult as UploadApiResponse).secure_url;

    // Update user avatar in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
