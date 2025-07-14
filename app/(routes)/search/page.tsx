"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Status = "none" | "requested" | "in-circle";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: Status;
}

const totalUsers: User[] = [
  {
    id: 13,
    name: "Mona Lisa",
    email: "mona.lisa@gmail.com",
    avatar: "/assets/avatar.png",
    status: "none",
  },
  {
    id: 14,
    name: "Leonardo Da Vinci",
    email: "leonardo.davinci@gmail.com",
    avatar: "/assets/avatar.png",
    status: "requested",
  },
  {
    id: 15,
    name: "Ada Lovelace",
    email: "ada.lovelace@gmail.com",
    avatar: "/assets/avatar.png",
    status: "in-circle",
  },
  {
    id: 18,
    name: "Alan Turing",
    email: "alan.turing@gmail.com",
    avatar: "/assets/avatar.png",
    status: "in-circle",
  },
  {
    id: 19,
    name: "Marie Curie",
    email: "marie.curie@gmail.com",
    avatar: "/assets/avatar.png",
    status: "none",
  },
  {
    id: 20,
    name: "Nikola Tesla",
    email: "nikola.tesla@gmail.com",
    avatar: "/assets/avatar.png",
    status: "requested",
  },
  {
    id: 21,
    name: "Albert Einstein",
    email: "albert.einstein@gmail.com",
    avatar: "/assets/avatar.png",
    status: "in-circle",
  },
  {
    id: 22,
    name: "Isaac Newton",
    email: "isaac.newton@gmail.com",
    avatar: "/assets/avatar.png",
    status: "none",
  },
  {
    id: 23,
    name: "Rosalind Franklin",
    email: "rosalind.franklin@gmail.com",
    avatar: "/assets/avatar.png",
    status: "requested",
  },
  {
    id: 24,
    name: "Charles Darwin",
    email: "charles.darwin@gmail.com",
    avatar: "/assets/avatar.png",
    status: "in-circle",
  },
  {
    id: 25,
    name: "Katherine Johnson",
    email: "katherine.johnson@gmail.com",
    avatar: "/assets/avatar.png",
    status: "none",
  },
  {
    id: 26,
    name: "Steve Jobs",
    email: "steve.jobs@gmail.com",
    avatar: "/assets/avatar.png",
    status: "requested",
  },
  {
    id: 27,
    name: "Bill Gates",
    email: "bill.gates@gmail.com",
    avatar: "/assets/avatar.png",
    status: "in-circle",
  },
  {
    id: 28,
    name: "Tim Berners-Lee",
    email: "tim.bernerslee@gmail.com",
    avatar: "/assets/avatar.png",
    status: "none",
  },
];

export default function SearchPeople() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState(totalUsers);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return; // wait for loading
    if (!session) router.push("/"); // redirect to login
  }, [session, status, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const handleRequest = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: "requested" } : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="border-b-[1px] p-2 px-5 flex items-center border-black/25">
        <h3 className="font-bold text-[27px]">Search for People</h3>
      </div>

      <div className="p-4">
        <input
          type="text"
          placeholder="Search by entering name or email..."
          className="w-full p-3 py-3 mb-6 rounded-md border bg-[#fdc500]/10 border-black/25 focus:outline-none placeholder:text-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No users found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 tracking-wide text-black/70">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-[#fdc500]/10 p-6 rounded-xl border border-black/20 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  {/* Avatar */}
                  <div className="relative w-24 h-24">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover border border-black/10"
                    />
                  </div>

                  {/* Name & Email */}
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  {/* Status Button */}
                  <div className="w-full">
                    {user.status === "none" && (
                      <button
                        onClick={() => handleRequest(user.id)}
                        className="w-full px-4 py-2 rounded-md bg-[#52B2CF] text-white text-sm font-medium transition hover:brightness-110"
                      >
                        Request to chat
                      </button>
                    )}

                    {user.status === "requested" && (
                      <button
                        disabled
                        className="w-full px-4 py-2 rounded-md bg-[#52B2CF] text-white text-sm font-medium flex items-center justify-center gap-1 cursor-default"
                      >
                        Requested <Check size={16} />
                      </button>
                    )}

                    {user.status === "in-circle" && (
                      <div className="w-full px-4 py-2 rounded-md bg-[#5CBA47] text-white text-sm font-medium text-center">
                        In your Circle
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
