import Image from "next/image";
export default function ChatContent() {
  return (
    <div className="flex col-span-75 flex-col h-full">
      <div className="border-b-[1px] p-2 px-5 flex items-center border-[#000]/35">
        <div className="flex items-center space-x-4">
          <div className="w-[74px] h-[74px] relative">
            <Image
              src="/assets/avatar.png"
              alt="sherwin"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="-mt-2">
            <h3 className={`font-bold text-[24px]`}>Sherwin</h3>
            <p className={`text-[14px] text-black/50`}>sherwin@gmai.com</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat messages will go here */}
        <p className="text-gray-500">Chat messages will be displayed here.</p>
      </div>

      <form className="flex p-3 border-t-[1px] border-[#000]/35  items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-86/100 text-[16px] py-3 px-3 border-[#000]/35 border-[1px] focus:outline-none rounded-[5px]"
        />
        <button
          type="submit"
          className="w-14/100 bg-[#fdc500] h-full text-white rounded-[7px] text-[20px]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
