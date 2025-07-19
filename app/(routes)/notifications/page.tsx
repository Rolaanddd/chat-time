// app/(routes)/notifications/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface RequestNotification {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

const NotificationsComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<RequestNotification[]>([]);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    } else {
      setLoading(false);
      loadNotifications();
    }
  }, [session, status, router]);

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/requests");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error("Failed to load notifications");
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleAccept = async (requestId: string) => {
    setProcessingRequest(requestId);

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "accept" }),
      });

      if (response.ok) {
        // Update local state to show accepted status
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === requestId
              ? { ...notification, status: "accepted" }
              : notification
          )
        );
      } else {
        console.error("Failed to accept request");
        alert("Failed to accept friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingRequest(requestId);

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reject" }),
      });

      if (response.ok) {
        // Update local state to show rejected status
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === requestId
              ? { ...notification, status: "rejected" }
              : notification
          )
        );
      } else {
        console.error("Failed to reject request");
        alert("Failed to reject friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject friend request. Please try again.");
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  };

  const renderRequestNotification = (notification: RequestNotification) => {
    const isProcessing = processingRequest === notification.id;

    // Different styling based on status
    const getCardStyle = () => {
      if (notification.status === "accepted") {
        return "bg-green-50 border-green-200";
      } else if (notification.status === "rejected") {
        return "bg-red-50 border-red-200";
      }
      return "bg-[#fdc500]/10 border-black/25";
    };

    const getMessageText = () => {
      if (notification.status === "accepted") {
        return `You accepted ${notification.sender.name}'s friend request. You are now friends!`;
      } else if (notification.status === "rejected") {
        return `You rejected ${notification.sender.name}'s friend request.`;
      }
      return `${notification.sender.name} (${notification.sender.email}) has requested to send messages to you.`;
    };

    return (
      <div
        key={notification.id}
        className={`flex items-center w-fit justify-between py-4 px-6 rounded-[7px] border min-w-0 ${getCardStyle()}`}
      >
        <div className="flex-1 min-w-0 pr-4">
          <span className="text-gray-700 text-base">
            <span className="font-semibold">{getMessageText()}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {notification.status === "accepted" ? (
            <button
              className="bg-[#5CBA47] text-white px-4 py-2 rounded text-sm flex items-center cursor-default"
              disabled
            >
              <Check size={16} className="mr-1" />
              Accepted
            </button>
          ) : notification.status === "rejected" ? (
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
                disabled={isProcessing}
                className={`px-4 py-2 rounded text-sm flex items-center ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5CBA47] hover:bg-green-600"
                } text-white`}
              >
                <Check size={16} className="mr-1" />
                {isProcessing ? "..." : "Accept"}
              </button>
              <button
                onClick={() => handleReject(notification.id)}
                disabled={isProcessing}
                className={`px-4 py-2 rounded text-sm flex items-center ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#BA181B] hover:bg-red-600"
                } text-white`}
              >
                <span className="mr-1">✕</span>
                {isProcessing ? "..." : "Reject"}
              </button>
            </>
          )}
          <div className="text-gray-400 text-sm ml-2 whitespace-nowrap">
            {formatTime(notification.createdAt)}
          </div>
        </div>
      </div>
    );
  };

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

      <div className="px-3 py-5">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No notifications at the moment
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {notifications.map(renderRequestNotification)}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsComponent;
