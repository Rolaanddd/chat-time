"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const initialUser = {
  name: "Agnes Patricia",
  email: "agnespatricia@gmail.com",
  city: "Bangalore",
  avatar: "/assets/avatar.png",
  friends: [
    { name: "Isabella Thomas", email: "isabellathomas@example.com" },
    { name: "Noah Harris", email: "noahharris@example.com" },
    { name: "Mia Clark", email: "miaclark@example.com" },
    { name: "Lucas Walker", email: "lucaswalker@example.com" },
    { name: "Charlotte Young", email: "charlotteyoung@example.com" },
    { name: "Ethan Martinez", email: "ethanmartinez@example.com" },
    { name: "Amelia Robinson", email: "ameliarobinson@example.com" },
    { name: "Benjamin Lee", email: "benjaminlee@example.com" },
    { name: "Emily King", email: "emilyking@example.com" },
    { name: "Henry Scott", email: "henryscott@example.com" },
    { name: "Sofia Adams", email: "sofiaadams@example.com" },
    { name: "Jack Turner", email: "jackturner@example.com" },
    { name: "Grace Hill", email: "gracehill@example.com" },
    { name: "William Baker", email: "williambaker@example.com" },
    { name: "Ava Nelson", email: "avanelson@example.com" },
  ],
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (!session) {
      router.push("/"); // redirect to login if not authenticated
    }
  }, [session, status, router]);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
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
            />
            <button
              onClick={handleEditPhoto}
              className="absolute top-6 right-6 flex items-center gap-2 text-white text-sm bg-[#fdc500] hover:brightness-110 active:brightness-95 transition px-4 py-2 rounded-md shadow"
            >
              <SquarePen size={18} />
              Edit Photo
            </button>
          </div>

          {/* Info Section */}
          <div className="px-6 py-6 border-b border-black/25 space-y-3">
            <div>
              <p className="text-[14px] text-black/60">Name</p>
              <h2 className="text-[22px] font-semibold text-black">
                {initialUser.name}
              </h2>
            </div>
            <div>
              <p className="text-[14px] text-black/60">Email</p>
              <p className="text-[18px] text-black">{initialUser.email}</p>
            </div>
            <div>
              <p className="text-[14px] text-black/60">City</p>
              <p className="text-[18px] text-black">{initialUser.city}</p>
            </div>
          </div>

          {/* Circle Count */}
          <div className="px-6 py-4">
            <h2 className="text-[22px] font-bold text-black">
              In your Circle: {initialUser.friends.length}
            </h2>
          </div>
        </div>

        {/* Right: Friends List */}
        <div className="w-[45%] h-full overflow-y-auto">
          <h1 className="sticky top-0 z-10 bg-[#FFFBED] text-[24px] font-bold text-black px-6 py-4 border-b border-black/25">
            Your Friends
          </h1>

          <div className="px-6 py-4 space-y-4">
            {initialUser.friends.length === 0 ? (
              <p className="text-black/60 text-[16px]">You have no friends</p>
            ) : (
              initialUser.friends.map((friend, idx) => (
                <div
                  key={idx}
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
