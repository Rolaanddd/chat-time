"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, MessageCircle, LogOut, User } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current route is homepage
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body className="flex bg-white tracking-[0.5px]">
        {/* Show the sidebar only if NOT on the homepage */}
        {!isHome && (
          <div className="w-49/1000 sticky top-0 py-3 flex flex-col justify-between h-screen bg-[#fdc500]">
            <div className="flex justify-center  pb-3 items-end">
              <Link
                href="/profile"
                className={`rounded-[100%]  transition p-4 ${
                  pathname === "/profile" ? "bg-white/30" : "hover:bg-white/30"
                }`}
                aria-label="profile"
              >
                <User className="w-[27px] h-[27px] text-white hover:text-white transition-colors" />
              </Link>
            </div>
            <div>
              <div className="flex -mt-20 border-y-[1px] py-3 border-white/50 flex-col items-center space-y-5 ">
                <Link
                  href="/search"
                  className={`rounded-[5px] p-4 transition ${
                    pathname === "/search" ? "bg-white/30" : "hover:bg-white/30"
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-[27px] h-[27px] text-white hover:text-white transition-colors" />
                </Link>
                <Link
                  href="/notifications"
                  className={`rounded-[5px] transition p-4 ${
                    pathname === "/notifications"
                      ? "bg-white/30"
                      : "hover:bg-white/30"
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className="w-[27px] h-[27px] text-white hover:text-white transition-colors" />
                </Link>
                <Link
                  href="/chat"
                  className={`rounded-[5px] transition p-4 ${
                    pathname === "/chat" ? "bg-white/30" : "hover:bg-white/30"
                  }`}
                  aria-label="Chat"
                >
                  <MessageCircle className="w-[27px] h-[27px] text-white transition-colors" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-end">
              <Link
                href="/logout"
                className="hover:bg-white/30 transittion rounded-[5px] p-4"
                aria-label="logout"
              >
                <LogOut className="w-[27px] h-[27px] text-white hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 bg-[#fdc500]/7">{children}</div>
      </body>
    </html>
  );
}
