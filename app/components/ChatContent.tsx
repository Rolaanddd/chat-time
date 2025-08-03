// app/components/ChatContent.tsx

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TimeDisplay from "./TimeDisplay";
import { useSocket } from "../contexts/SocketContext";
import { useSession } from "next-auth/react";

type Message = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export default function ChatContent({ user }: { user: User }) {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages when user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !session?.user?.id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/messages?otherUserId=${user.id}`);
        if (response.ok) {
          const fetchedMessages = await response.json();
          setMessages(fetchedMessages);

          // Mark messages as read
          await fetch("/api/messages/mark-read", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ otherUserId: user.id }),
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id, session?.user?.id]);

  // Socket.io event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (messageData: Message) => {
      // Only add message if it's relevant to current conversation
      if (
        (messageData.senderId === user.id ||
          messageData.receiverId === user.id) &&
        (messageData.senderId === session?.user?.id ||
          messageData.receiverId === session?.user?.id)
      ) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some((msg) => msg.id === messageData.id);
          if (exists) return prev;
          return [...prev, messageData];
        });
      }
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === user.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
    };
  }, [socket, user.id, session?.user?.id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !session?.user?.email) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        senderId: session.user.email,
        receiverId: user.id,
        isTyping: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", {
        senderId: session.user.email,
        receiverId: user.id,
        isTyping: false,
      });
    }, 1000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session?.user?.id || !socket) return;

    const messageText = input.trim();
    setInput("");

    // Stop typing indicator
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing", {
      senderId: session.user.id,
      receiverId: user.id,
      isTyping: false,
    });

    try {
      // Send message to API
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: user.id,
          text: messageText,
        }),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        // Emit via socket for real-time delivery
        socket.emit("sendMessage", {
          senderId: session.user.id,
          receiverId: user.id,
          text: messageText,
          messageId: savedMessage.id,
          timestamp: savedMessage.createdAt,
        });
      } else {
        console.error("Failed to send message");
        // Optionally show error to user
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user
    }
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

  const isMyMessage = (messageUserId: string) => {
    return messageUserId === session?.user?.id;
  };

  return (
    <div className="flex col-span-75 flex-col h-full">
      {/* Header */}
      <div className="border-b-[1px] sticky top-0 p-2 px-5 flex bg-[#FFFBED] items-center border-[#000]/35 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-[74px] h-[74px] border-[1px] border-black/20 rounded-full relative">
            <Image
              src={user.avatar || "/assets/avatar.png"}
              alt={user.name}
              fill
              className="rounded-full border object-cover"
            />
          </div>
          <div className="-mt-2">
            <h3 className="font-bold text-[24px]">{user.name}</h3>
            <p className="text-[14px] text-black/50">{user.email}</p>
            {otherUserTyping && (
              <p className="text-[12px] text-blue-500 italic">typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto w-full p-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fdc500]"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">
            Start the conversation — don&apos;t be shy!
          </p>
        ) : (
          (() => {
            const grouped: Record<string, Message[]> = {};
            for (const msg of messages) {
              const group = getRelativeDate(msg.createdAt);
              if (!grouped[group]) grouped[group] = [];
              grouped[group].push(msg);
            }

            const groupLabels = Object.keys(grouped).sort((a, b) => {
              const dateA = new Date(grouped[a][0].createdAt).getTime();
              const dateB = new Date(grouped[b][0].createdAt).getTime();
              return dateA - dateB;
            });

            return groupLabels.map((label) => (
              <div key={label}>
                <div className="text-center text-xs text-gray-500 my-4">
                  {label}
                </div>
                {grouped[label].map((msg, i) => {
                  const isMine = isMyMessage(msg.senderId);
                  return (
                    <div
                      key={msg.id}
                      ref={
                        label === groupLabels.at(-1) &&
                        i === grouped[label].length - 1
                          ? lastMessageRef
                          : null
                      }
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-3 my-1 py-1 border-[1px] text-black/85 whitespace-pre-wrap leading-6 ${
                          isMine
                            ? "bg-[#fdc500]/35 border-[#000]/35 rounded-b-lg rounded-l-lg text-right"
                            : "bg-[#52B2CF]/30 border-[#000]/35 rounded-b-lg rounded-r-lg text-left"
                        }`}
                      >
                        <div className="flex gap-6">
                          <p>{msg.text}</p>
                          <p className="text-[10px] text-black/50 mt-1">
                            <TimeDisplay iso={msg.createdAt} />
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
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
          disabled={!input.trim()}
          className="bg-[#fdc500] px-5 h-3/4 text-white rounded-[7px] text-[18px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
