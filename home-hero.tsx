"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Play, Star } from "lucide-react";
import type { ComicCard } from "@/lib/data";
import { formatCount, formatRating } from "@/lib/constants";

export default function HomeHero({ comics }: { comics: ComicCard[] }) {
  const [active, setActive] = useState(0);
  const items = comics.length ? comics : [];

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % items.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const comic = items[active % items.length];
  const go = (direction: number) => setActive((index) => (index + direction + items.length) % items.length);

  return (
    <section className="relative h-[520px] overflow-hidden bg-[#080911] text-white sm:h-[570px] lg:h-[610px]">
      {items.map((item, index) => (
        <img
          key={item.id}
          src={item.bannerUrl || item.coverUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="pm-hero-shade absolute inset-0" />

      <div className="pm-container relative z-10 flex h-full items-center">
        <div key={comic.id} className="pm-fade-up max-w-[660px] py-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00d564]/50 bg-[#00d564]/15 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.17em] text-[#8bffb9] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d564]" /> PromiseMe Original
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-300">{comic.genre} · by {comic.creator}</p>
          <h1 className="max-w-[620px] text-[clamp(42px,7vw,78px)] font-black leading-[0.98] tracking-[-0.065em] drop-shadow-[0_8px_35px_rgba(0,0,0,0.45)]">
            {comic.title}
          </h1>
          <p className="mt-5 line-clamp-3 max-w-[570px] text-[15px] leading-7 text-gray-200 sm:text-base">
            {comic.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm font-bold text-gray-200">
            <span className="inline-flex items-center gap-1.5 text-[#ffd34d]"><Star className="h-4 w-4 fill-current" />{formatRating(comic.rating)}</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatCount(comic.views)} reads</span>
            <span>{comic.episodeCount} episodes</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/comics/${comic.id}`} className="inline-flex items-center gap-2 rounded-full bg-[#00d564] px-7 py-3.5 text-sm font-black text-[#06140b] shadow-[0_10px_30px_rgba(0,213,100,0.3)] transition hover:bg-[#00ef70]">
              <Play className="h-4 w-4 fill-current" /> Start reading
            </Link>
            <Link href="/upload" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20">
              Publish your own
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous featured comic"
        className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition hover:bg-black/65 sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next featured comic"
        className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition hover:bg-black/65 sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 backdrop-blur">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${item.title}`}
            className={`h-2 rounded-full transition-all ${index === active ? "w-7 bg-[#00d564]" : "w-2 bg-white/55 hover:bg-white"}`}
          />
        ))}
        <span className="ml-2 text-[11px] font-bold text-white/80">{active + 1} / {items.length}</span>
      </div>
    </section>
  );
}
