// app/api/requests/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Fetch friend requests for current user
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

    // Get pending requests received by current user
    const receivedRequests = await prisma.request.findMany({
      where: {
        receiverId: currentUser.id,
        status: "pending",
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(receivedRequests);
  } catch (error) {
    console.error("Requests GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Send friend request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID required" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if request already exists
    const existingRequest = await prisma.request.findFirst({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: receiverId },
          { senderId: receiverId, receiverId: currentUser.id },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Request already exists" },
        { status: 409 }
      );
    }

    // Create new friend request
    const newRequest = await prisma.request.create({
      data: {
        senderId: currentUser.id,
        receiverId: receiverId,
        status: "pending",
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

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Requests POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
