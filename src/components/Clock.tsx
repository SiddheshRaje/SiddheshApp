"use client";

import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const firstTick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 30_000);

    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(interval);
    };
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }).format(now)
    : "--:--";

  const date = now
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(now)
    : "Mumbai time";

  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-panel-muted py-1 pl-1 pr-2">
      <span className="flex items-center gap-1 rounded-full border border-line bg-panel px-2 py-0.5 text-xs font-medium text-text-soft">
        <MoonStar aria-hidden="true" className="h-3 w-3" />
        {time}
      </span>
      <span className="whitespace-nowrap text-xs font-medium text-muted">{date}</span>
    </div>
  );
}
