import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, city, email, password } = await req.json();

  if (!email || !password || !name || !city) {
    return new Response("Missing required fields", { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      city,
      email,
      password: hashedPassword,
    },
  });

  return Response.json({ message: "User created", user: newUser });
}
