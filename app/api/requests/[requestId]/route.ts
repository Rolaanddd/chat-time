// app/api/requests/[requestId]/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import { PrismaClient } from "../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// PATCH - Accept or reject friend request
export async function PATCH(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json(); // "accept" or "reject"
    const { requestId } = params;

    if (!action || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the request and verify user is the receiver
    const friendRequest = await prisma.request.findFirst({
      where: {
        id: requestId,
        receiverId: currentUser.id,
        status: "pending",
      },
    });

    if (!friendRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update request status
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { status: action === "accept" ? "accepted" : "rejected" },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Request PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
