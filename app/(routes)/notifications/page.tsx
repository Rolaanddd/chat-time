"use client";
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface MessageNotification {
  id: string;
  type: "message";
  sender: string;
  email: string;
  time: string;
}

interface RequestNotification {
  id: string;
  type: "request";
  sender: string;
  email: string;
  time: string;
  accepted?: boolean;
  rejected?: boolean;
}

type Notification = MessageNotification | RequestNotification;

const NotificationsComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (!session) {
      router.push("/"); // redirect to login
    } else {
      setLoading(false); // session present
    }
  }, [session, status, router]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "request",
      sender: "Sherwin",
      email: "sherwin@gmail.com",
      time: "2:44 PM",
    },
    {
      id: "2",
      type: "message",
      sender: "Sherwin",
      email: "sherwin@gmail.com",
      time: "2:44 PM",
    },
    {
      id: "3",
      type: "request",
      sender: "Alex Johnson",
      email: "alex.johnson@company.com",
      time: "1:30 PM",
    },
    {
      id: "4",
      type: "message",
      sender: "Sarah Wilson",
      email: "sarah.wilson@startup.io",
      time: "Last week",
    },
    {
      id: "5",
      type: "request",
      sender: "Mike Chen",
      email: "mike.chen@tech.com",
      time: "3 weeks ago",
    },
    {
      id: "6",
      type: "message",
      sender: "Emily Carter",
      email: "emily.carter@domain.com",
      time: "1 month ago",
    },
    {
      id: "7",
      type: "request",
      sender: "David Lee",
      email: "david.lee@company.com",
      time: "2 months ago",
    },
    {
      id: "8",
      type: "message",
      sender: "Priya Singh",
      email: "priya.singh@global.org",
      time: "5 months ago",
    },
    {
      id: "9",
      type: "request",
      sender: "Lucas Brown",
      email: "lucas.brown@enterprise.com",
      time: "1 year ago",
    },
    {
      id: "10",
      type: "message",
      sender: "Olivia Martinez",
      email: "olivia.martinez@service.net",
      time: "2 years ago",
    },
    {
      id: "11",
      type: "request",
      sender: "Noah Kim",
      email: "noah.kim@startup.com",
      time: "3 years ago",
    },
  ]);

  const handleAccept = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.type === "request" && n.id === id
          ? { ...n, accepted: true, rejected: false }
          : n
      )
    );
  };

  const handleReject = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.type === "request" && n.id === id
          ? { ...n, rejected: true, accepted: false }
          : n
      )
    );
  };

  const renderMessageNotification = (notification: MessageNotification) => (
    <div
      key={notification.id}
      className="flex items-center w-3/7 border border-black/25 justify-between py-4 px-6 bg-[#fdc500]/10 rounded-[7px]"
    >
      <div className="flex-1">
        <span className="text-gray-700 text-base">
          {notification.sender} ({notification.email}) has sent a message.
        </span>
      </div>
      <div className="text-gray-400 text-sm ml-4">{notification.time}</div>
    </div>
  );

  const renderRequestNotification = (notification: RequestNotification) => (
    <div
      key={notification.id}
      className="flex items-center w-3/5 border border-black/25 justify-between py-4 px-6 bg-[#fdc500]/10 rounded-[7px]"
    >
      <div className="flex-1">
        <span className="text-gray-700 text-base">
          {notification.sender} ({notification.email}) has requested to send
          messages to you.
        </span>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        {notification.accepted ? (
          <button
            className="bg-[#5CBA47] text-white px-4 py-2 rounded text-sm flex items-center cursor-default"
            disabled
          >
            <Check size={16} className="mr-1" />
            Accepted
          </button>
        ) : notification.rejected ? (
          <button
            className="bg-[#BA181B] text-white px-4 py-2 rounded text-sm flex items-center cursor-default"
            disabled
          >
            <span className="mr-1">✕</span>
            Rejected
          </button>
        ) : (
          <>
            <button
              onClick={() => handleAccept(notification.id)}
              className="bg-[#5CBA47] text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center"
            >
              <Check size={16} className="mr-1" />
              Accept
            </button>
            <button
              onClick={() => handleReject(notification.id)}
              className="bg-[#BA181B] text-white px-4 py-2 rounded text-sm hover:bg-red-600 flex items-center"
            >
              <span className="mr-1">✕</span>
              Reject
            </button>
          </>
        )}
        <div className="text-gray-400 text-sm ml-2">{notification.time}</div>
      </div>
    </div>
  );
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="border-b border-black/25">
        <h1 className="text-[27px] font-bold text-black py-3 px-6">
          Notifications
        </h1>
      </div>

      <div className="px-3 py-5 flex flex-col space-y-4">
        {notifications.map((notification) =>
          notification.type === "message"
            ? renderMessageNotification(notification as MessageNotification)
            : renderRequestNotification(notification as RequestNotification)
        )}
      </div>
    </div>
  );
};

export default NotificationsComponent;
