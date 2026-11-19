import Link from "next/link";
import { Eye, Star } from "lucide-react";
import type { ComicCard as ComicCardType } from "@/lib/data";
import { formatCount, formatRating } from "@/lib/constants";

export default function ComicCard({ comic, rank }: { comic: ComicCardType; rank?: number }) {
  return (
    <Link href={`/comics/${comic.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-[#e9ebef] shadow-[0_8px_24px_rgba(17,24,39,0.08)]">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={comic.coverUrl}
            alt={`${comic.title} cover art`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          {typeof rank === "number" ? (
            <span className="rounded-lg bg-[#0b0c0e]/90 px-2.5 py-1 text-xs font-black text-[#00d564]">#{rank}</span>
          ) : (
            <span className="rounded-lg bg-[#0b0c0e]/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">{comic.updateDay}</span>
          )}
          {comic.featured && (
            <span className="rounded-lg bg-[#00d564] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#06140b]">Original</span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-9 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex rounded-full bg-[#00d564] px-3 py-1.5 text-xs font-black text-[#06140b]">View series →</span>
        </div>
      </div>
      <div className="px-0.5 pt-3">
        <h3 className="line-clamp-1 text-[15px] font-black leading-tight tracking-[-0.02em] transition group-hover:text-[#009e4b]">{comic.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-gray-500">{comic.creator} · {comic.genre}</p>
        <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-gray-500">
          <span className="inline-flex items-center gap-1 text-[#e5a00d]"><Star className="h-3.5 w-3.5 fill-current" />{formatRating(comic.rating)}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatCount(comic.views)}</span>
          <span className="ml-auto">{comic.episodeCount} eps</span>
        </div>
      </div>
    </Link>
  );
}
