// app/layout.tsx (Server Component — no "use client")
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Chat Time",
  description: "Realtime chat app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex bg-white tracking-[0.5px]">
        <SessionProviderWrapper>
          <Sidebar />
          <main className="flex-1 bg-[#fdc500]/7">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
