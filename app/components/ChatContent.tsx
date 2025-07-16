import { useMemo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import TimeDisplay from "./TimeDisplay";

type Message = {
  text: string;
  sender: "me" | "other";
  timestamp: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

const initialMessages: Record<number, Message[]> = {};

export default function ChatContent({ user }: { user: User }) {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [messagesMap, setMessagesMap] = useState(initialMessages);
  const [input, setInput] = useState("");

  const messages = useMemo(() => {
    return messagesMap[user.id] || [];
  }, [messagesMap, user.id]);

  useEffect(() => {
    // do something with messages
  }, [messages]);

  useEffect(() => {
    setMessagesMap((prev) => {
      if (!prev[user.id]) {
        const simulatedMessages: Message[] = [
          {
            text: "Hey there!",
            sender: "other",
            timestamp: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            text: "Hi! How are you?",
            sender: "me",
            timestamp: new Date(
              Date.now() - 6 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            text: "Did you finish the project?",
            sender: "other",
            timestamp: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000
            ).toISOString(),
          },
          {
            text: "Yes, I sent it yesterday.",
            sender: "me",
            timestamp: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];
        return { ...prev, [user.id]: simulatedMessages };
      }
      return prev; // no change if already exists
    });
  }, [user.id]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      text: input,
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [user.id]: [...(prev[user.id] || []), newMsg],
    }));
    setInput("");
  };

  function getRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return "A month ago";
    if (diffDays < 365) return "A few months ago";
    return "A year ago";
  }

  return (
    <div className="flex col-span-75 flex-col h-full">
      {/* Header */}
      <div className="border-b-[1px] sticky top-0 p-2 px-5 flex bg-[#FFFBED] items-center border-[#000]/35 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-[74px] h-[74px] relative">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="-mt-2">
            <h3 className="font-bold text-[24px]">{user.name}</h3>
            <p className="text-[14px] text-black/50">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto w-full p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">
            Start the conversation — don&apos;t be shy!
          </p>
        ) : (
          (() => {
            const grouped: Record<string, Message[]> = {};
            for (const msg of messages) {
              const group = getRelativeDate(msg.timestamp);
              if (!grouped[group]) grouped[group] = [];
              grouped[group].push(msg);
            }

            const groupLabels = Object.keys(grouped).sort((a, b) => {
              const dateA = new Date(grouped[a][0].timestamp).getTime();
              const dateB = new Date(grouped[b][0].timestamp).getTime();
              return dateA - dateB;
            });

            return groupLabels.map((label) => (
              <div key={label}>
                <div className="text-center text-xs text-gray-500 my-4">
                  {label}
                </div>
                {grouped[label].map((msg, i) => (
                  <div
                    key={label + i}
                    ref={
                      label === groupLabels.at(-1) &&
                      i === grouped[label].length - 1
                        ? lastMessageRef
                        : null
                    }
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-3 my-1 py-1 border-[1px] text-black/85 whitespace-pre-wrap leading-6 ${
                        msg.sender === "me"
                          ? "bg-[#fdc500]/35 border-[#000]/35 rounded-b-lg rounded-l-lg text-right"
                          : "bg-[#52B2CF]/30 border-[#000]/35 rounded-b-lg rounded-r-lg text-left"
                      }`}
                    >
                      <div className="flex gap-6">
                        <p>{msg.text}</p>
                        <p className="text-[10px] text-black/50 mt-1">
                          <TimeDisplay iso={msg.timestamp} />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex p-3 sticky bottom-0 bg-[#FFFBED] mt-3 border-t-[1px] border-[#000]/35 items-center justify-between gap-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={2}
          placeholder="Type your message..."
          className="flex-1 resize-none text-[16px] py-3 px-3 border-[#000]/35 border-[1px] focus:outline-none rounded-[5px]
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#fdc500]/20
            [&::-webkit-scrollbar-thumb:hover]:bg-[#fdc500]/60]"
        />
        <button
          type="submit"
          className="bg-[#fdc500] px-5 h-3/4 text-white rounded-[7px] text-[18px]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
