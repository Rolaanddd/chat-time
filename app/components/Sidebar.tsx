// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, MessageCircle, LogOut, User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="w-49/1000 sticky top-0 py-3 flex flex-col justify-between h-screen bg-[#fdc500]">
      <div className="flex justify-center pb-3 items-end">
        <Link
          href="/profile"
          className={`rounded-[100%]  transition p-4 ${
            pathname === "/profile" ? "bg-white/30" : "hover:bg-white/30"
          }`}
          aria-label="profile"
        >
          <User className="w-[27px] h-[27px] text-white transition-colors" />
        </Link>
      </div>

      <div>
        <div className="flex -mt-20 border-y-[1px] py-3 border-white/50 flex-col items-center space-y-5">
          {[
            { href: "/search", icon: Search },
            { href: "/notifications", icon: Bell },
            { href: "/chat", icon: MessageCircle },
          ].map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-[5px] p-4 transition ${
                pathname === href ? "bg-white/30" : "hover:bg-white/30"
              }`}
            >
              <Icon className="w-[27px] h-[27px] text-white" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-end">
        <Link
          href="/logout"
          className="hover:bg-white/30 transittion rounded-[5px] p-4"
          aria-label="logout"
        >
          <LogOut className="w-[27px] h-[27px] text-white" />
        </Link>
      </div>
    </div>
  );
}
