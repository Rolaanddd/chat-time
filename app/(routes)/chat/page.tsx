// app/chat/page.tsx

"use client";

import { useEffect, useState } from "react";
import ChatContent from "@/app/components/ChatContent";
import ChatList from "@/app/components/ChatList";

export default function Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic (delay 300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="grid md:grid-cols-100">
      <div className="col-span-25 py-2 pt-3 px-3 border-r-[1px] bg-[#fdc500]/3 border-black/35 h-screen">
        <h1 className="text-[27px] ml-1 font-bold">Your Messages</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for your Friends.."
          className="text-[16px] mt-3 border-[1px] bg-[#fdc500]/10 text-black rounded-[5px] border-[#000]/25 py-2 px-3 w-full focus:outline-none"
        />
        <ChatList searchTerm={debouncedSearch} />
      </div>
      <ChatContent />
    </div>
  );
}
