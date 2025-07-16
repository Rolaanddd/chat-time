// lib/authOptions.ts

import { PrismaClient } from "../app/generated/prisma"; // Fixed import path
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      city?: string | null;
      avatar?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    city?: string | null;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    city?: string | null;
    avatar?: string | null;
  }
}

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Safely check credentials
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // Compare hashed password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // Success: return user object (can include custom fields too)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          city: user.city,
          avatar: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // Redirect unauthenticated users here
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.city = token.city;
        session.user.avatar = token.avatar;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.city = user.city;
        token.avatar = user.avatar;
      }
      return token;
    },
  },
};
