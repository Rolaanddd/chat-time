// app/api/messages/mark-read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json(
        { error: "otherUserId is required" },
        { status: 400 }
      );
    }

    // Mark all messages from otherUserId to current user as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
