"use client";

import { useEffect, useState } from "react";
import ChatContent from "@/app/components/ChatContent";
import ChatList from "@/app/components/ChatList";

const users = [
  {
    id: 6,
    name: "Sherwin",
    email: "sherwin@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 7,
    name: "Alex",
    email: "alex@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 8,
    name: "Emma",
    email: "emma.johnson@example.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 9,
    name: "Liam",
    email: "liam.smith@example.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 10,
    name: "Olivia",
    email: "olivia.brown@example.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 11,
    name: "Noah",
    email: "noah.james@example.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 12,
    name: "Sophia",
    email: "sophia.miller@example.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 13,
    name: "Mason",
    email: "mason.wilson@example.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 14,
    name: "Ava",
    email: "ava.moore@example.com",
    avatar: "/assets/avatar.png",
  },
];

export default function Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="grid md:grid-cols-100">
      <div className="col-span-25 py-2 sticky top-0 pt-3 px-3 border-r-[1px] bg-[#fdc500]/3 border-black/35 h-screen">
        <h1 className="text-[27px] ml-1 font-bold">Your Messages</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for your Friends.."
          className="text-[16px] mt-3 border-[1px] bg-[#fdc500]/10 text-black rounded-[5px] border-[#000]/25 py-2 px-3 w-full focus:outline-none"
        />
        <ChatList
          users={users}
          searchTerm={debouncedSearch}
          onSelectUser={(user) => setSelectedUser(user)}
          selectedUserId={selectedUser?.id}
        />
      </div>
      <ChatContent user={selectedUser} />
    </div>
  );
}
