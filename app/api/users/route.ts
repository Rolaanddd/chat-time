// app/api/users/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { PrismaClient } from "../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Add debugging
    console.log("Session:", session);
    console.log("Session user:", session?.user);
    console.log("Session user email:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching users...");
    const users = await prisma.user.findMany({
      where: { NOT: { email: session.user.email } },
      select: { id: true, name: true, email: true, avatar: true },
    });

    console.log("Users found:", users.length);
    return NextResponse.json(users);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
