"use client";

import { useEffect, useState } from "react";

export default function TimeDisplay({ iso }: { iso: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [iso]);

  return <>{time}</>;
}
