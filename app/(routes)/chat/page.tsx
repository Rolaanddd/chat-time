"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatList from "@/components/ChatList";
import ChatContent from "@/components/ChatContent";
import Loader from "@/components/Loader";

const users = [
  // your users array here
  {
    id: 6,
    name: "Sherwin",
    email: "sherwin@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 7,
    name: "Alina",
    email: "alina@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 8,
    name: "Marcus",
    email: "marcus@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 9,
    name: "Jasmine",
    email: "jasmine@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 10,
    name: "Derek",
    email: "derek@gmail.com",
    avatar: "/assets/avatar.png",
  },
  {
    id: 11,
    name: "Nina",
    email: "nina@gmail.com",
    avatar: "/assets/avatar.png",
  },
];

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [loading, setLoading] = useState(true);

  // Redirect if no session after loading
  useEffect(() => {
    if (status === "loading") return; // wait for session to load
    if (!session) {
      router.push("/"); // redirect to login if not logged in
    } else {
      setLoading(false); // session present, stop loading
    }
  }, [session, status, router]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading) {
    return <Loader />;
  }

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
