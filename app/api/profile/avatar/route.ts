// app/api/profile/avatar/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

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

    // Create unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `avatar_${timestamp}${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      await writeFile(path.join(uploadsDir, "test.txt"), "test");
    } catch (error) {
      // Directory doesn't exist, create it
      const fs = require("fs");
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Update user avatar in database
    const avatarUrl = `/uploads/${filename}`;
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
