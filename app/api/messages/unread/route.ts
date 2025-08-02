// app/api/messages/unread/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all friends
    const friendRequests = await prisma.request.findMany({
      where: {
        AND: [
          { status: "accepted" },
          {
            OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
          },
        ],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    const friends = friendRequests.map((request) => {
      return request.senderId === currentUser.id
        ? request.receiver
        : request.sender;
    });

    // Get unread message counts for each friend
    const unreadCounts = await Promise.all(
      friends.map(async (friend) => {
        const count = await prisma.message.count({
          where: {
            senderId: friend.id,
            receiverId: currentUser.id,
            isRead: false, // Only count unread messages
          },
        });

        return {
          userId: friend.id,
          count: count,
        };
      })
    );

    return NextResponse.json(unreadCounts);
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
