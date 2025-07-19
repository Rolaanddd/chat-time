// app/(routes)/search/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

type Status = "none" | "requested" | "in-circle" | "pending-received";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: Status;
}

export default function SearchPeople() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loadingRequest, setLoadingRequest] = useState<string | null>(null);

  // 🔒 Redirect unauthenticated users
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
  }, [session, status, router]);

  // ⏳ Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // 🌐 Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [usersRes, statusRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/users/status"),
        ]);

        const usersData = await usersRes.json();
        const statusData = statusRes.ok ? await statusRes.json() : {};

        if (usersRes.ok) {
          const withStatus = usersData
            .filter((user: any) => user.email !== session?.user?.email) // Exclude current user
            .map((user: any) => ({
              ...user,
              avatar: user.avatar !== null ? user.avatar : "/assets/avatar.png",
              status: statusData[user.id] || "none",
            }));

          setUsers(withStatus);
        } else {
          console.error("API Error:", usersData.error);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (status === "authenticated") {
      loadUsers();
    }
  }, [status, session]);

  const handleRequest = async (userId: string) => {
    setLoadingRequest(userId);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (response.ok) {
        // Update UI to show request sent
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, status: "requested" } : user
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Failed to send request:", errorData.error);

        // Show error message to user
        alert(errorData.error || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send friend request. Please try again.");
    } finally {
      setLoadingRequest(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  if (status === "loading" || !session) {
    return <Loader />;
  }

  const getButtonContent = (user: User) => {
    if (loadingRequest === user.id) {
      return (
        <button
          disabled
          className="w-full px-4 py-2 rounded-md bg-gray-400 text-white text-sm font-medium cursor-not-allowed"
        >
          Sending...
        </button>
      );
    }

    switch (user.status) {
      case "none":
        return (
          <button
            onClick={() => handleRequest(user.id)}
            className="w-full px-4 py-2 rounded-md bg-[#52B2CF] text-white text-sm font-medium transition hover:brightness-110"
          >
            Request to chat
          </button>
        );

      case "requested":
        return (
          <button
            disabled
            className="w-full px-4 py-2 rounded-md bg-[#52B2CF] text-white text-sm font-medium flex items-center justify-center gap-1 cursor-default"
          >
            Requested <Check size={16} />
          </button>
        );

      case "pending-received":
        return (
          <button
            disabled
            className="w-full px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium cursor-default"
          >
            Pending Response
          </button>
        );

      case "in-circle":
        return (
          <div className="w-full px-4 py-2 rounded-md bg-[#5CBA47] text-white text-sm font-medium text-center">
            In your Circle
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="border-b-[1px] p-2 px-5 flex items-center border-black/25">
        <h3 className="font-bold text-[27px]">Search for People</h3>
      </div>

      {/* Search Box */}
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
                  <div className="relative w-24 h-24">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover border border-black/10"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="w-full">{getButtonContent(user)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
