import Link from "next/link";
import { ArrowRight, Crown, Eye, MessageCircle, Star, TrendingUp, Trophy } from "lucide-react";
import { getChatRooms, getComicCards, getThreadCards } from "@/lib/data";
import { formatCount, formatRating } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Query = { sort?: string };

export default async function RankingsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const sort = ["views", "rating", "likes", "new"].includes(params.sort || "") ? params.sort! : "views";
  const [cards, threads, rooms] = await Promise.all([getComicCards(), getThreadCards("top"), getChatRooms()]);
  const ranked = [...cards].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating || b.views - a.views;
    if (sort === "likes") return b.likes - a.likes;
    if (sort === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.views - a.views;
  });

  const tabs = [
    { id: "views", label: "Most read" },
    { id: "rating", label: "Top rated" },
    { id: "likes", label: "Most liked" },
    { id: "new", label: "New arrivals" },
  ];

  return (
    <>
      <section className="border-b border-gray-200 bg-[#0b0c0e] py-10 text-white sm:py-12">
        <div className="pm-container flex flex-wrap items-center gap-5">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#00d564]/15 text-[#00d564]"><Trophy className="h-7 w-7" /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#72f3a7]">Weekly chart</p>
            <h1 className="mt-1 text-[clamp(34px,5vw,52px)] font-black leading-none tracking-[-0.06em]">PromiseMe Rankings</h1>
            <p className="mt-2 text-sm text-gray-400">The stories readers keep coming back to.</p>
          </div>
          <Link href="/comics" className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold hover:bg-white/10">Browse library <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="pm-container grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Link key={tab.id} href={`/rankings?sort=${tab.id}`} className={`rounded-full px-4 py-2 text-xs font-black transition ${sort === tab.id ? "bg-[#0b0c0e] text-white" : "border border-gray-200 bg-white text-gray-600 hover:border-[#00d564]"}`}>{tab.label}</Link>
            ))}
          </div>
          <div className="pm-card divide-y divide-gray-100 overflow-hidden">
            {ranked.map((comic, index) => (
              <Link key={comic.id} href={`/comics/${comic.id}`} className="group flex items-center gap-3 p-4 transition hover:bg-[#f8fffa] sm:gap-5 sm:p-5">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black ${index === 0 ? "bg-[#ffd75e] text-[#4a3300]" : index === 1 ? "bg-[#d9dee6] text-[#39404b]" : index === 2 ? "bg-[#f0b584] text-[#543018]" : "bg-gray-100 text-gray-500"}`}>
                  {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                </div>
                <img src={comic.coverUrl} alt="" loading="lazy" className="h-20 w-16 shrink-0 rounded-xl object-cover shadow-sm transition group-hover:scale-[1.04]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-black">{comic.title}</h2>
                    {index < 3 && <span className="hidden rounded-full bg-[#00d564]/12 px-2 py-0.5 text-[10px] font-black text-[#008c40] sm:inline">HOT</span>}
                  </div>
                  <p className="mt-1 truncate text-xs text-gray-500">{comic.creator} · {comic.genre} · {comic.episodeCount} episodes</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-500">
                    <span className="inline-flex items-center gap-1 text-[#e5a00d]"><Star className="h-3 w-3 fill-current" />{formatRating(comic.rating)}</span>
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{formatCount(comic.views)}</span>
                    <span>{formatCount(comic.likes)} likes</span>
                  </div>
                </div>
                <span className="hidden shrink-0 items-center gap-1 text-xs font-black text-[#00a94f] sm:inline-flex"><TrendingUp className="h-3.5 w-3.5" /> +{index + 3}%</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="pm-card overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 text-sm font-black">Top community posts</div>
            <div className="divide-y divide-gray-100">
              {threads.slice(0, 4).map((thread, index) => (
                <Link key={thread.id} href={`/community/${thread.id}`} className="block px-5 py-4 hover:bg-gray-50">
                  <div className="flex gap-3">
                    <span className="text-lg font-black text-[#00a94f]">{index + 1}</span>
                    <div>
                      <p className="line-clamp-2 text-xs font-bold leading-5">{thread.title}</p>
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-gray-500"><MessageCircle className="h-3 w-3" />{thread.commentCount} comments · {formatCount(thread.score)} votes</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="pm-card bg-[#0b0c0e] p-6 text-white">
            <h3 className="text-lg font-black">Want to see your name here?</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">Upload your high-res manga, share it with the community, and climb the chart. No creator verification needed.</p>
            <Link href="/upload" className="pm-btn mt-5 w-full">Publish a series</Link>
            <Link href="/chat" className="mt-3 flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold hover:bg-white/10">{rooms.length} live rooms waiting <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </aside>
      </section>
    </>
  );
}
