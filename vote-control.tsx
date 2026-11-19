"use client";

import { useEffect, useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

type Direction = "up" | "down" | null;

export default function VoteControl({
  kind,
  id,
  score,
  compact = false,
}: {
  kind: "thread" | "comment";
  id: number;
  score: number;
  compact?: boolean;
}) {
  const [value, setValue] = useState(score);
  const [vote, setVote] = useState<Direction>(null);
  const key = `promiseme-vote-${kind}-${id}`;

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    setVote(stored === "up" || stored === "down" ? stored : null);
  }, [key]);

  async function cast(direction: "up" | "down") {
    let delta = 0;
    let next: Direction = direction;
    if (vote === direction) {
      delta = direction === "up" ? -1 : 1;
      next = null;
    } else if (vote === null) {
      delta = direction === "up" ? 1 : -1;
    } else {
      delta = direction === "up" ? 2 : -2;
    }

    setValue((current) => current + delta);
    setVote(next);
    if (next) window.localStorage.setItem(key, next);
    else window.localStorage.removeItem(key);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, delta }),
      });
      const data = (await response.json()) as { score?: number };
      if (typeof data.score === "number") setValue(data.score);
    } catch {
      // Keep the optimistic score if the network drops.
    }
  }

  const size = compact ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className={`inline-flex shrink-0 items-center ${compact ? "flex-row gap-1" : "flex-col gap-0.5"} rounded-lg ${compact ? "" : "bg-gray-50 px-1 py-1"}`}>
      <button type="button" onClick={() => cast("up")} aria-label="Upvote" className={`rounded p-1 transition ${vote === "up" ? "text-[#00a94f]" : "text-gray-400 hover:bg-[#00d564]/10 hover:text-[#00a94f]"}`}>
        <ArrowBigUp className={`${size} ${vote === "up" ? "fill-current" : ""}`} />
      </button>
      <span className={`min-w-[28px] text-center font-black ${compact ? "text-xs" : "text-sm"} ${vote === "up" ? "text-[#00a94f]" : vote === "down" ? "text-[#6b46c1]" : "text-gray-700"}`}>{value.toLocaleString()}</span>
      <button type="button" onClick={() => cast("down")} aria-label="Downvote" className={`rounded p-1 transition ${vote === "down" ? "text-[#6b46c1]" : "text-gray-400 hover:bg-purple-50 hover:text-[#6b46c1]"}`}>
        <ArrowBigDown className={`${size} ${vote === "down" ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
