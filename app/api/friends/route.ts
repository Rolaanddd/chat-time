// app/api/friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../app/generated/prisma"; // Ensure correct import path
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all accepted friend requests where current user is either sender or receiver
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

    // Extract friends (the other user in each request)
    const friends = friendRequests.map((request) => {
      return request.senderId === currentUser.id
        ? request.receiver
        : request.sender;
    });

    // Remove duplicates based on user ID
    const uniqueFriends = friends.filter(
      (friend, index, self) =>
        index === self.findIndex((f) => f.id === friend.id)
    );

    return NextResponse.json(uniqueFriends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
