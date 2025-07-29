// app/(routes)/chat/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatList from "@/components/ChatList";
import ChatContent from "@/components/ChatContent";
import Loader from "@/components/Loader";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendsLoading, setFriendsLoading] = useState(true);

  // Redirect if no session after loading
  useEffect(() => {
    if (status === "loading") return; // wait for session to load
    if (!session) {
      router.push("/"); // redirect to login if not logged in
    } else {
      setLoading(false); // session present, stop loading
    }
  }, [session, status, router]);

  // Fetch friends when session is available
  useEffect(() => {
    const fetchFriends = async () => {
      if (!session?.user?.email) return;

      setFriendsLoading(true);
      try {
        const response = await fetch("/api/friends");
        if (response.ok) {
          const friendsData = await response.json();
          setFriends(friendsData);

          // Set first friend as selected if available
          if (friendsData.length > 0 && !selectedUser) {
            setSelectedUser(friendsData[0]);
          }
        } else {
          console.error("Failed to fetch friends");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setFriendsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchFriends();
    }
  }, [session?.user?.email, selectedUser]);

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

        {friendsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#fdc500]"></div>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 px-4">
            <p>No friends yet!</p>
            <p className="text-sm mt-2">
              Go to the search section to find and add friends.
            </p>
          </div>
        ) : (
          <ChatList
            users={friends}
            searchTerm={debouncedSearch}
            onSelectUser={(user) => setSelectedUser(user)}
            selectedUserId={selectedUser?.id || null}
          />
        )}
      </div>

      {selectedUser ? (
        <ChatContent user={selectedUser} />
      ) : (
        <div className="col-span-75 flex items-center justify-center">
          <div className="text-center text-gray-400">
            {friends.length === 0 ? (
              <p>Add some friends to start chatting!</p>
            ) : (
              <p>Select a friend to start chatting</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
