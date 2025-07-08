"use client";

import { useState } from "react";
import Image from "next/image";

const users = [
  {
    id: 6,
    name: "Sherwin",
    email: "sherwin@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 7,
    name: "Alex",
    email: "alex@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 8,
    name: "Maria",
    email: "maria@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 9,
    name: "John",
    email: "john@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 10,
    name: "Lisa",
    email: "lisa@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 11,
    name: "David",
    email: "david@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 12,
    name: "Emma",
    email: "emma@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 13,
    name: "Noah",
    email: "noah@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 14,
    name: "Olivia",
    email: "olivia@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
  {
    id: 15,
    name: "Liam",
    email: "liam@gmail.com",
    avatar: "/assets/avatar.png",
    unreadCount: 0,
  },
];

interface ChatListProps {
  searchTerm: string;
}

export default function ChatList({ searchTerm }: ChatListProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="mt-4 overflow-y-auto [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar]:p-7
      [&::-webkit-scrollbar-track]:bg-transparent]
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-[#fdc500]/20
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb:hover]:bg-[#fdc500]/60"
    >
      <div className="mr-2 h-[82vh]">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No users found.</div>
        ) : (
          filteredUsers.map((user, idx) => (
            <div key={user.id}>
              <div
                onClick={() => setActiveId(user.id)}
                className={`flex items-center justify-between p-2 px-5 rounded-[7px] cursor-pointer transition-colors ${
                  activeId === user.id
                    ? "bg-[#FDC500]"
                    : "hover:bg-[#fdc500]/10"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        activeId === user.id ? "text-white" : "text-black"
                      }`}
                    >
                      {user.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        activeId === user.id ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.unreadCount > 0 && (
                  <span className="text-[13px] text-white font-medium bg-[#FDC500] -mt-8 w-[26px] h-[26px] flex items-center justify-center rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </div>
              {idx !== filteredUsers.length - 1 && (
                <div className="h-px bg-[#000]/15 my-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
