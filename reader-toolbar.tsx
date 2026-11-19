"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, List } from "lucide-react";

export default function ReaderToolbar({
  comicId,
  comicTitle,
  episodeTitle,
  episodeNumber,
  episodeId,
  likes,
  prevId,
  nextId,
}: {
  comicId: number;
  comicTitle: string;
  episodeTitle: string;
  episodeNumber: number;
  episodeId: number;
  likes: number;
  prevId: number | null;
  nextId: number | null;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLiked(window.localStorage.getItem(`promiseme-like-${episodeId}`) === "1");
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [episodeId]);

  async function toggleLike() {
    if (liked) return;
    setLiked(true);
    setCount((value) => value + 1);
    window.localStorage.setItem(`promiseme-like-${episodeId}`, "1");
    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId, comicId }),
      });
      const data = (await response.json()) as { likes?: number };
      if (typeof data.likes === "number") setCount(data.likes);
    } catch {
      // Keep the optimistic like.
    }
  }

  return (
    <div className="sticky top-[66px] z-40 border-b border-white/10 bg-[#0b0c0e]/97 text-white backdrop-blur lg:top-[98px]">
      <div className="pm-container flex h-14 items-center gap-3">
        <Link href={`/comics/${comicId}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">{comicTitle}</span><span className="sm:hidden">Back</span>
        </Link>
        <div className="hidden h-5 w-px bg-white/15 sm:block" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black">Ep. {episodeNumber} · {episodeTitle}</p>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          {prevId ? <Link href={`/read/${prevId}`} className="grid h-8 w-8 place-items-center rounded-lg text-gray-300 hover:bg-white/10" aria-label="Previous episode"><ChevronLeft className="h-4 w-4" /></Link> : <span className="grid h-8 w-8 place-items-center rounded-lg text-gray-700"><ChevronLeft className="h-4 w-4" /></span>}
          <Link href={`/comics/${comicId}#episodes`} className="grid h-8 w-8 place-items-center rounded-lg text-gray-300 hover:bg-white/10" aria-label="All episodes"><List className="h-4 w-4" /></Link>
          {nextId ? <Link href={`/read/${nextId}`} className="grid h-8 w-8 place-items-center rounded-lg text-gray-300 hover:bg-white/10" aria-label="Next episode"><ChevronRight className="h-4 w-4" /></Link> : <span className="grid h-8 w-8 place-items-center rounded-lg text-gray-700"><ChevronRight className="h-4 w-4" /></span>}
        </div>
        <button type="button" onClick={toggleLike} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black transition ${liked ? "bg-[#00d564] text-[#06140b]" : "border border-white/20 text-white hover:border-[#00d564] hover:text-[#00d564]"}`}>
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} /> {count.toLocaleString()}
        </button>
      </div>
      <div className="h-[3px] w-full bg-white/10"><div className="h-full bg-[#00d564] transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
