import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Eye,
  Heart,
  List,
  MessageCircle,
  Mic2,
  Play,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import { getComic, getComicEpisodes, getVoices } from "@/lib/data";
import { formatCount, formatRating, timeAgo } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ComicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comicId = Number(id);
  if (!Number.isInteger(comicId) || comicId < 1) notFound();

  const comic = await getComic(comicId);
  if (!comic) notFound();
  const [episodeList, voiceRows] = await Promise.all([getComicEpisodes(comicId), getVoices()]);
  const firstEpisode = episodeList[0];

  return (
    <>
      <section className="relative overflow-hidden bg-[#080911] text-white">
        <img src={comic.bannerUrl || comic.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080911] via-[#080911]/90 to-[#080911]/45" />
        <div className="pm-container relative py-10 sm:py-14">
          <div className="mb-7 flex items-center gap-2 text-xs font-bold text-gray-400">
            <Link href="/comics" className="hover:text-[#00d564]">Comics</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-gray-300">{comic.title}</span>
          </div>
          <div className="grid gap-8 sm:grid-cols-[220px_1fr] lg:gap-12">
            <img src={comic.coverUrl} alt={`${comic.title} cover`} className="aspect-[3/4] w-full rounded-2xl object-cover shadow-[0_25px_60px_rgba(0,0,0,0.45)]" />
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#00d564] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#06140b]">PromiseMe Series</span>
                <span className="rounded-full border border-white/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]">{comic.genre}</span>
                <span className="rounded-full border border-white/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]">{comic.status}</span>
              </div>
              <h1 className="mt-5 text-[clamp(36px,6vw,64px)] font-black leading-[0.98] tracking-[-0.065em]">{comic.title}</h1>
              <p className="mt-3 text-sm font-bold text-gray-300">by <span className="text-[#00d564]">{comic.creator}</span> · updates {comic.updateDay}</p>
              <p className="mt-5 max-w-2xl line-clamp-4 text-sm leading-7 text-gray-300 sm:text-base">{comic.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-gray-200">
                <span className="inline-flex items-center gap-1.5 text-[#ffd34d]"><Star className="h-4 w-4 fill-current" />{formatRating(comic.rating)}</span>
                <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatCount(comic.views)}</span>
                <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4" />{formatCount(comic.likes)}</span>
                <span className="inline-flex items-center gap-1.5"><List className="h-4 w-4" />{episodeList.length} episodes</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {firstEpisode && <Link href={`/read/${firstEpisode.id}`} className="pm-btn px-7 py-3.5 text-base"><Play className="h-4 w-4 fill-current" /> Read Episode 1</Link>}
                <Link href={`/upload?mode=episode&comicId=${comic.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur hover:bg-white/20"><Plus className="h-4 w-4" /> Add episode</Link>
                <Link href="/community" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-black hover:bg-white/10"><MessageCircle className="h-4 w-4" /> Discuss</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-gray-200 bg-white">
        <div className="pm-container flex gap-6 overflow-x-auto text-sm font-black text-gray-500">
          <a href="#episodes" className="border-b-2 border-[#00d564] py-4 text-[#111318]">Episodes</a>
          <a href="#about" className="py-4 hover:text-[#00a94f]">About</a>
          <a href="#voice" className="py-4 hover:text-[#00a94f]">Voices</a>
          <span className="ml-auto hidden items-center gap-1.5 py-4 text-xs font-bold text-[#008c40] sm:inline-flex"><ShieldCheck className="h-4 w-4" /> No verification to publish more</span>
        </div>
      </div>

      <section className="pm-container grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <div id="episodes">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black tracking-[-0.04em]">All episodes</h2>
            <span className="text-xs font-bold text-gray-500">Newest first</span>
          </div>
          <div className="pm-card divide-y divide-gray-100 overflow-hidden">
            {[...episodeList].reverse().map((episode) => (
              <Link key={episode.id} href={`/read/${episode.id}`} className="group flex items-center gap-4 p-4 transition hover:bg-[#f8fffa]">
                <img src={episode.thumbnailUrl || comic.coverUrl} alt="" loading="lazy" className="h-[76px] w-[60px] shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#00a94f]">Episode {episode.episodeNumber}</p>
                  <h3 className="mt-1 truncate text-sm font-black sm:text-base">{episode.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-500">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{timeAgo(episode.createdAt)}</span>
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{formatCount(episode.views)}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{formatCount(episode.likes)}</span>
                  </div>
                </div>
                <span className="hidden shrink-0 rounded-full bg-[#00d564] px-4 py-2 text-xs font-black text-[#06140b] opacity-0 transition group-hover:opacity-100 sm:inline-flex">Read →</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 sm:hidden" />
              </Link>
            ))}
            {!episodeList.length && <p className="p-8 text-center text-sm text-gray-500">No episodes yet. Add the first one!</p>}
          </div>
        </div>

        <aside className="space-y-5">
          <div id="about" className="pm-card p-6">
            <h3 className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-5 w-5 text-[#00a94f]" /> About this series</h3>
            <div className="pm-prose mt-4 text-sm"><p>{comic.description}</p></div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[comic.genre, ...comic.tags.split(",").map((tag) => tag.trim()).filter(Boolean)].map((tag) => (
                <Link key={tag} href={`/comics?q=${encodeURIComponent(tag)}`} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-[#00d564]/15 hover:text-[#008c40]">{tag}</Link>
              ))}
            </div>
          </div>
          <div id="voice" className="pm-card p-6">
            <h3 className="flex items-center gap-2 text-lg font-black"><Mic2 className="h-5 w-5 text-[#8b5cf6]" /> Bring it to life</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">Record a character voice or upload an audio pack for this universe in Voice Studio.</p>
            <p className="mt-3 text-xs font-bold text-gray-500">{voiceRows.length} voice clips available</p>
            <Link href="/voice" className="pm-btn mt-4 w-full">Open Voice Studio <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-2xl border border-[#00d564]/25 bg-[#f0fff6] p-5">
            <h4 className="text-sm font-black text-[#007a35]">This is your series too</h4>
            <p className="mt-2 text-xs leading-5 text-[#297c4c]">Want to continue it? Add another episode without any account, email or creator verification.</p>
            <Link href={`/upload?mode=episode&comicId=${comic.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#007a35] hover:underline">Add an episode <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </aside>
      </section>
    </>
  );
}
