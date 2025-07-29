// components/SessionProviderWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "../contexts/SocketContext";
import { ReactNode } from "react";

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <SocketProvider>{children}</SocketProvider>
    </SessionProvider>
  );
}
