// app/components/ChatList.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string; // Changed from number to string
  name: string;
  email: string;
  avatar: string;
}

interface UnreadCount {
  userId: string;
  count: number;
}

interface ChatListProps {
  users: User[];
  searchTerm: string;
  onSelectUser: (user: User) => void;
  selectedUserId: string | null; // Changed from number to string
}

export default function ChatList({
  users,
  searchTerm,
  onSelectUser,
  selectedUserId,
}: ChatListProps) {
  const { data: session } = useSession();
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount[]>([]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch unread message counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!session?.user?.id || users.length === 0) return;

      try {
        const response = await fetch("/api/messages/unread");
        if (response.ok) {
          const counts = await response.json();
          setUnreadCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    };

    fetchUnreadCounts();

    // Refresh unread counts every 30 seconds
    const interval = setInterval(fetchUnreadCounts, 30000);

    return () => clearInterval(interval);
  }, [session?.user?.id, users]);

  const getUnreadCount = (userId: string): number => {
    const unread = unreadCounts.find((item) => item.userId === userId);
    return unread ? unread.count : 0;
  };

  const handleUserSelect = (user: User) => {
    onSelectUser(user);
    // Reset unread count for selected user (optimistic update)
    setUnreadCounts((prev) =>
      prev.map((item) =>
        item.userId === user.id ? { ...item, count: 0 } : item
      )
    );
  };

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
          filteredUsers.map((user, idx) => {
            const unreadCount = getUnreadCount(user.id);
            return (
              <div key={user.id}>
                <div
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center justify-between p-2 px-5 rounded-[7px] cursor-pointer transition-colors relative ${
                    selectedUserId === user.id
                      ? "bg-[#FDC500]"
                      : "hover:bg-[#fdc500]/10"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 relative">
                      <Image
                        src={user.avatar || "/assets/avatar.png"}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          selectedUserId === user.id
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {user.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          selectedUserId === user.id
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Alternative: Floating badge on the right side */}
                  {unreadCount > 0 && selectedUserId !== user.id && (
                    <div className="bg-[#fdc500] top-3 right-3 absolute text-white text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 shadow-lg ml-2">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </div>
                  )}
                </div>
                {idx !== filteredUsers.length - 1 && (
                  <div className="h-px bg-[#000]/15 my-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
