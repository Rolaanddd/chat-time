// app/api/users/status/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { PrismaClient } from "../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Get relationship status with other users
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

    // Get all requests involving current user
    const requests = await prisma.request.findMany({
      where: {
        OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
      },
      select: {
        senderId: true,
        receiverId: true,
        status: true,
      },
    });

    // Create status map
    const statusMap: { [key: string]: string } = {};

    requests.forEach((request) => {
      const otherUserId =
        request.senderId === currentUser.id
          ? request.receiverId
          : request.senderId;

      if (request.status === "accepted") {
        statusMap[otherUserId] = "in-circle";
      } else if (request.status === "pending") {
        if (request.senderId === currentUser.id) {
          statusMap[otherUserId] = "requested";
        } else {
          statusMap[otherUserId] = "pending-received";
        }
      }
    });

    return NextResponse.json(statusMap);
  } catch (error) {
    console.error("User Status Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
