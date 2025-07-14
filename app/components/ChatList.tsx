"use client";

import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface ChatListProps {
  users: User[];
  searchTerm: string;
  onSelectUser: (user: User) => void;
  selectedUserId: number | null;
}

export default function ChatList({
  users,
  searchTerm,
  onSelectUser,
  selectedUserId,
}: ChatListProps) {
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
                onClick={() => onSelectUser(user)}
                className={`flex items-center justify-between p-2 px-5 rounded-[7px] cursor-pointer transition-colors ${
                  selectedUserId === user.id
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
                        selectedUserId === user.id ? "text-white" : "text-black"
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
