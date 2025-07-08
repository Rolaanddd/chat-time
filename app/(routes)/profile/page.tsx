import Image from "next/image";
import { SquarePen } from "lucide-react";

const user = {
  name: "Agnes Patricia",
  email: "agnespatricia@gmail.com",
  city: "Bangalore",
  avatar: "/assets/avatar.png",
  friends: [
    {
      name: "Isabella Thomas",
      email: "isabellathomas@example.com",
    },
    {
      name: "Noah Harris",
      email: "noahharris@example.com",
    },
    {
      name: "Mia Clark",
      email: "miaclark@example.com",
    },
    {
      name: "Lucas Walker",
      email: "lucaswalker@example.com",
    },
    {
      name: "Charlotte Young",
      email: "charlotteyoung@example.com",
    },
    {
      name: "Ethan Martinez",
      email: "ethanmartinez@example.com",
    },
    {
      name: "Amelia Robinson",
      email: "ameliarobinson@example.com",
    },
    {
      name: "Benjamin Lee",
      email: "benjaminlee@example.com",
    },
    {
      name: "Emily King",
      email: "emilyking@example.com",
    },
    {
      name: "Henry Scott",
      email: "henryscott@example.com",
    },
    {
      name: "Sofia Adams",
      email: "sofiaadams@example.com",
    },
    {
      name: "Jack Turner",
      email: "jackturner@example.com",
    },
    {
      name: "Grace Hill",
      email: "gracehill@example.com",
    },
    {
      name: "William Baker",
      email: "williambaker@example.com",
    },
    {
      name: "Ava Nelson",
      email: "avanelson@example.com",
    },
  ],
};

export default function ProfilePage() {
  return (
    <div className="w-full grid grid-cols-1 grid-rows-100 h-screen overflow-hidden">
      <h1 className="text-[27px] row-span-10 px-4 py-4 border-b-[1px] border-black/25 font-bold text-black">
        Your Profile
      </h1>
      <div className="flex justify-start row-span-90">
        <div className="w-55/100 h-fit overflow-hidden border-b-[1px] border-black/25">
          <div className="flex border-b-[1px] border-black/25 py-7 relative items-center justify-center">
            <Image
              src={user.avatar}
              alt="Profile"
              width={128}
              height={128}
              className="w-[208px] h-[208px] rounded-full object-cover"
            />
            <button className="absolute flex items-center right-6 cursor-pointer hover:shadow-md active:shadow-none transition justify-center py-2 rounded-md px-4 top-5 text-white bg-[#fdc500]">
              <span>
                <SquarePen />
              </span>
              Edit Photo
            </button>
          </div>
          <div className="flex flex-col border-b-[1px] border-black/25 w-full items-start px-7 justify-center space-y-2 text-center py-4">
            <h1 className="font-bold w-3/6 text-left text-[24px]">
              Name : {user.name}
            </h1>
            <h1 className="text-[18px] w-3/6 font-light text-left text-black/60">
              Email : {user.email}
            </h1>
            <h1 className="text-[18px] w-3/6 font-light text-left text-black/60">
              City : {user.city}
            </h1>
          </div>
          <h1 className="px-7 text-[24px] py-3 font-bold">
            In your Circle : {user.friends.length}
          </h1>
        </div>
        <div
          className="w-45/100 relative overflow-y-auto border-l-[1px] border-black/25 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar]:p-7
  [&::-webkit-scrollbar-track]:bg-transparent]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-[#fdc500]/0
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb:hover]:bg-[#fdc500]/0"
        >
          <h1 className="py-4 sticky top-0 bg-[#FFFBED] text-[24px] border-b-[1px] border-black/25 font-bold px-4">
            Your Friends
          </h1>
          <div className="px-4 py-2 space-y-4">
            {user.friends.length === 0 ? (
              <div className="text-black/60 text-[16px]">
                You have no friends
              </div>
            ) : (
              user.friends.map((friend, idx) => (
                <div
                  key={idx}
                  className="flex flex-col  border-b border-black/10 pb-3 last:border-b-0"
                >
                  <span className="font-semibold text-[18px] text-black">
                    {friend.name}
                  </span>
                  <span className="text-black/60 text-[15px]">
                    {friend.email}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
