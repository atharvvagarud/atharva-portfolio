"use client";

import { useEffect, useState } from "react";

const londonTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function LondonTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => setTime(londonTimeFormatter.format(new Date()));

    updateTime();
    const timer = window.setInterval(updateTime, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <time dateTime={new Date().toISOString()} suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
