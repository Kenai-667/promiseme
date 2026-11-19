import Link from "next/link";
import { ArrowRight, Flame, MessageCircle, MessageSquare, Radio, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import NewThreadForm from "@/components/new-thread-form";
import VoteControl from "@/components/vote-control";
import { getChatRooms, getCommunityStats, getThreadCards } from "@/lib/data";
import { COMMUNITIES, formatCount, timeAgo } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Query = { sort?: string; community?: string };

export default async function CommunityPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const sort = ["hot", "new", "top"].includes(params.sort || "") ? (params.sort as "hot" | "new" | "top") : "hot";
  const community = COMMUNITIES.some((item) => item.slug === params.community) ? params.community! : "all";
  const [allThreads, stats, rooms] = await Promise.all([getThreadCards(sort), getCommunityStats(), getChatRooms()]);
  const threads = community === "all" ? allThreads : allThreads.filter((thread) => thread.community === community);
  const tabs = [
    { id: "hot", label: "Hot", icon: Flame },
    { id: "new", label: "New", icon: Sparkles },
    { id: "top", label: "Top", icon: Trophy },
  ];

  return (
    <>
      <section className="border-b border-gray-200 bg-[#0b0c0e] py-8 text-white sm:py-10">
        <div className="pm-container flex flex-wrap items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#00d564] text-[#06140b]"><MessageSquare className="h-6 w-6" /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#72f3a7]">PromiseMe Community</p>
            <h1 className="mt-1 text-[clamp(30px,5vw,48px)] font-black leading-none tracking-[-0.06em]">r/PromiseMe</h1>
            <p className="mt-2 text-sm text-gray-400">Threads, theories, fan art and creator talk — Reddit-style, with zero verification.</p>
          </div>
          <Link href="/chat" className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold hover:bg-white/20"><Radio className="h-4 w-4 text-[#00d564]" /> Open live chat</Link>
        </div>
      </section>

      <div className="pm-container grid gap-6 py-7 lg:grid-cols-[220px_minmax(0,1fr)_290px]">
        <aside className="hidden space-y-4 lg:block">
          <div className="pm-card sticky top-[115px] overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">Communities</div>
            <div className="p-2">
              <Link href="/community" className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${community === "all" ? "bg-[#00d564]/12 text-[#008c40]" : "text-gray-600 hover:bg-gray-50"}`}><span className="grid h-6 w-6 place-items-center rounded-full bg-[#00d564] text-[10px] font-black text-[#06140b]">P</span> All posts</Link>
              {COMMUNITIES.map((item) => (
                <Link key={item.slug} href={`/community?community=${item.slug}`} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${community === item.slug ? "bg-[#00d564]/12 text-[#008c40]" : "text-gray-600 hover:bg-gray-50"}`}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent }} />{item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 p-4">
              <Link href="/chat" className="flex items-center gap-2 rounded-xl bg-[#0b0c0e] px-3 py-2.5 text-xs font-black text-white"><Radio className="h-3.5 w-3.5 text-[#00d564]" /> {rooms.length} live chat rooms <ArrowRight className="ml-auto h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <NewThreadForm defaultCommunity={community === "all" ? "promiseme" : community} />

          <div className="pm-card flex flex-wrap items-center gap-1 p-2">
            {tabs.map((tab) => (
              <Link key={tab.id} href={`/community?sort=${tab.id}${community === "all" ? "" : `&community=${community}`}`} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black ${sort === tab.id ? "bg-[#0b0c0e] text-white" : "text-gray-500 hover:bg-gray-100"}`}><tab.icon className="h-4 w-4" />{tab.label}</Link>
            ))}
            <span className="ml-auto pr-2 text-xs font-bold text-gray-500">{threads.length} posts</span>
          </div>

          <div className="space-y-3">
            {threads.map((thread) => (
              <article key={thread.id} className="pm-card flex gap-3 p-3 transition hover:border-gray-300 sm:gap-4 sm:p-4">
                <div className="pt-1"><VoteControl kind="thread" id={thread.id} score={thread.score} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold text-gray-500">
                    <Link href={`/community?community=${thread.community}`} className="text-[#111318] hover:text-[#00a94f]">r/{thread.community}</Link>
                    <span>·</span><span>{timeAgo(thread.createdAt)}</span><span>·</span><span>u/{thread.author}</span>
                    <span className="rounded-full bg-[#00d564]/12 px-2 py-0.5 text-[10px] font-black text-[#008c40]">{thread.flair}</span>
                  </div>
                  <Link href={`/community/${thread.id}`}><h2 className="mt-2 line-clamp-2 text-base font-black leading-snug hover:text-[#009e4b] sm:text-lg">{thread.title}</h2></Link>
                  {thread.body && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">{thread.body}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                    <Link href={`/community/${thread.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-gray-100"><MessageCircle className="h-3.5 w-3.5" />{thread.commentCount} comments</Link>
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{formatCount(thread.views)} views</span>
                    <Link href={`/community/${thread.id}`} className="ml-auto text-[#00a94f] hover:underline">Read thread →</Link>
                  </div>
                </div>
              </article>
            ))}
            {!threads.length && <div className="pm-card p-10 text-center"><h2 className="text-lg font-black">No posts here yet</h2><p className="mt-1 text-sm text-gray-500">Start the first conversation — no account needed.</p></div>}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="pm-card sticky top-[115px] overflow-hidden">
            <div className="bg-[#0b0c0e] px-5 py-4 text-sm font-black text-white">About r/PromiseMe</div>
            <div className="p-5">
              <p className="text-sm leading-6 text-gray-600">A friendly home for comic readers, manga makers, voice artists and fan-art lovers. Post freely — no sign-up or verification.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-gray-100 py-4">
                <div><p className="text-lg font-black">{formatCount(stats.members)}</p><p className="text-[11px] font-bold text-gray-500">Members</p></div>
                <div><p className="text-lg font-black">{stats.rooms}</p><p className="text-[11px] font-bold text-gray-500">Live rooms</p></div>
                <div><p className="text-lg font-black">{stats.threads}</p><p className="text-[11px] font-bold text-gray-500">Threads</p></div>
                <div><p className="text-lg font-black">{stats.comments}</p><p className="text-[11px] font-bold text-gray-500">Comments</p></div>
              </div>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-gray-500">Community rules</h3>
              <ol className="mt-3 space-y-2 text-xs leading-5 text-gray-600">
                <li>1. Be kind to other readers and creators.</li>
                <li>2. Credit artwork and voices you share.</li>
                <li>3. Mark spoilers in thread titles.</li>
                <li>4. No harassment, hate or doxxing.</li>
                <li>5. Share what you love, freely.</li>
              </ol>
              <Link href="/chat" className="pm-btn mt-5 w-full">Join live chat <Radio className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#00d564]/25 bg-[#f0fff6] p-5">
            <ShieldCheck className="h-6 w-6 text-[#008c40]" />
            <h3 className="mt-3 text-sm font-black text-[#007a35]">No verification. Ever.</h3>
            <p className="mt-2 text-xs leading-5 text-[#297c4c]">Use any display name for posts, comments, uploads and chat. We never ask for an email, phone number or ID.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
