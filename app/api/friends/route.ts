// app/api/friends/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get accepted friend requests (both sent and received)
    const acceptedRequests = await prisma.request.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, status: "accepted" },
          { receiverId: currentUser.id, status: "accepted" },
        ],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Extract friends (exclude current user)
    const friends = acceptedRequests.map((request) => {
      if (request.senderId === currentUser.id) {
        return request.receiver;
      } else {
        return request.sender;
      }
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Friends API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
