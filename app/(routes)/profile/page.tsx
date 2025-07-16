// app/(routes)/profile/page.tsx

"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  avatar: string | null;
}

interface Friend {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("/assets/avatar.png");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
      return;
    }

    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setAvatarUrl(userData.avatar || "/assets/avatar.png");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    // Fetch friends (accepted requests)
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/friends");
        if (res.ok) {
          const friendsData = await res.json();
          setFriends(friendsData);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchUserData();
    fetchFriends();
  }, [session, status, router]);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { avatarUrl: newAvatarUrl } = await res.json();
        setAvatarUrl(newAvatarUrl);

        // Update the session with new avatar
        await update();

        // Update local user state
        setUser((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  if (status === "loading" || !user) {
    return <Loader />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">No session found...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <h1 className="text-[27px] font-bold text-black border-b border-black/25 px-6 py-4">
        Your Profile
      </h1>

      {/* Main Content */}
      <div className="flex h-full overflow-hidden">
        {/* Left: Profile Info */}
        <div className="w-[55%] h-full overflow-y-auto border-r border-black/25">
          {/* Avatar Section */}
          <div className="flex items-center justify-center p-6 relative border-b border-black/25">
            <Image
              src={avatarUrl}
              alt="Profile"
              width={208}
              height={208}
              className="rounded-full object-cover w-[190px] h-[190px] border border-black/20 shadow-sm"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <button
              onClick={handleEditPhoto}
              disabled={isUploading}
              className="absolute top-6 right-6 flex items-center gap-2 text-white text-sm bg-[#fdc500] hover:brightness-110 active:brightness-95 transition px-4 py-2 rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SquarePen size={18} />
              {isUploading ? "Uploading..." : "Edit Photo"}
            </button>
          </div>

          {/* Info Section */}
          <div className="px-6 py-6 border-b border-black/25 space-y-3">
            <div>
              <p className="text-[14px] text-black/60">Name</p>
              <h2 className="text-[22px] font-semibold text-black">
                {user.name}
              </h2>
            </div>
            <div>
              <p className="text-[14px] text-black/60">Email</p>
              <p className="text-[18px] text-black">{user.email}</p>
            </div>
            <div>
              <p className="text-[14px] text-black/60">City</p>
              <p className="text-[18px] text-black">{user.city}</p>
            </div>
          </div>

          {/* Circle Count */}
          <div className="px-6 py-4">
            <h2 className="text-[22px] font-bold text-black">
              In your Circle: {friends.length}
            </h2>
          </div>
        </div>

        {/* Right: Friends List */}
        <div className="w-[45%] h-full overflow-y-auto">
          <h1 className="sticky top-0 z-10 bg-[#FFFBED] text-[24px] font-bold text-black px-6 py-4 border-b border-black/25">
            Your Friends
          </h1>

          <div className="px-6 py-4 space-y-4">
            {friends.length === 0 ? (
              <p className="text-black/60 text-[16px]">
                You have no friends yet
              </p>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="border-b border-black/10 pb-3 last:border-b-0"
                >
                  <p className="font-semibold text-[18px] text-black">
                    {friend.name}
                  </p>
                  <p className="text-black/60 text-[15px]">{friend.email}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
