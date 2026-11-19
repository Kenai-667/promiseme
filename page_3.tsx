import Link from "next/link";
import { ArrowRight, Hash, MessageCircle, Radio, ShieldCheck, Sparkles, Users } from "lucide-react";
import LiveChat from "@/components/live-chat";
import { getChatRooms, getMessages } from "@/lib/data";
import { COMMUNITIES, formatCount } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Query = { room?: string };

export default async function ChatPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const rooms = await getChatRooms();
  const selected = rooms.find((room) => room.slug === params.room) || rooms[0];
  if (!selected) return null;
  const messages = await getMessages(selected.id);

  return (
    <>
      <section className="border-b border-gray-200 bg-[#0b0c0e] py-8 text-white">
        <div className="pm-container flex flex-wrap items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#00d564]/15 text-[#00d564]"><Radio className="h-6 w-6" /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#72f3a7]">PromiseMe Live</p>
            <h1 className="mt-1 text-[clamp(30px,5vw,48px)] font-black leading-none tracking-[-0.06em]">Community chat</h1>
            <p className="mt-2 text-sm text-gray-400">Reddit-style rooms, real-time messages, and absolutely no verification.</p>
          </div>
          <Link href="/community" className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold hover:bg-white/20"><MessageCircle className="h-4 w-4 text-[#00d564]" /> Discussion threads</Link>
        </div>
      </section>

      <section className="pm-container grid gap-5 py-7 xl:grid-cols-[210px_minmax(0,1fr)_270px] lg:grid-cols-[190px_minmax(0,1fr)]">
        <aside className="hidden space-y-4 lg:block">
          <div className="pm-card sticky top-[115px] overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">Chat rooms</div>
            <div className="p-2">
              {rooms.map((room) => (
                <Link key={room.id} href={`/chat?room=${room.slug}`} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${room.id === selected.id ? "bg-[#00d564]/12 text-[#008c40]" : "text-gray-600 hover:bg-gray-50"}`}>
                  <Hash className="h-3.5 w-3.5" style={{ color: room.accent }} />
                  <span className="truncate">{room.name}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Communities</p>
              {COMMUNITIES.slice(0, 4).map((community) => (
                <Link key={community.slug} href={`/community?community=${community.slug}`} className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-xs font-bold text-gray-500 hover:text-[#00a94f]"><span className="h-2 w-2 rounded-full" style={{ background: community.accent }} />{community.label}</Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#00d564]/25 bg-[#f0fff6] p-4">
            <ShieldCheck className="h-5 w-5 text-[#008c40]" />
            <p className="mt-2 text-xs font-black text-[#007a35]">Guest mode is always on</p>
            <p className="mt-1 text-[11px] leading-4 text-[#297c4c]">Pick a nickname and start chatting. No sign-up, email or OTP.</p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2 lg:hidden">
            {rooms.map((room) => (
              <Link key={room.id} href={`/chat?room=${room.slug}`} className={`rounded-full px-3 py-1.5 text-xs font-black ${room.id === selected.id ? "bg-[#00d564] text-[#06140b]" : "border border-gray-200 bg-white text-gray-600"}`}>#{room.slug}</Link>
            ))}
          </div>
          <LiveChat room={selected} initialMessages={messages} />
        </div>

        <aside className="hidden space-y-4 xl:block">
          <div className="pm-card sticky top-[115px] overflow-hidden">
            <div className="bg-[#0b0c0e] px-5 py-4 text-sm font-black text-white">About #{selected.slug}</div>
            <div className="p-5">
              <p className="text-sm leading-6 text-gray-600">{selected.description}</p>
              <div className="mt-5 flex items-center gap-2 border-y border-gray-100 py-4">
                <Users className="h-5 w-5 text-[#00a94f]" />
                <div><p className="text-lg font-black">{formatCount(selected.members)}</p><p className="text-[11px] font-bold text-gray-500">Community members</p></div>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#00d564]/12 px-2 py-1 text-[10px] font-black text-[#008c40]"><span className="h-1.5 w-1.5 rounded-full bg-[#00d564]" /> ONLINE</span>
              </div>
              <h3 className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-gray-500">Room guidelines</h3>
              <ol className="mt-3 space-y-2 text-xs leading-5 text-gray-600">
                <li>1. Keep it friendly and welcoming.</li>
                <li>2. No spoilers without a warning.</li>
                <li>3. Share your work, ask for feedback.</li>
                <li>4. No spam or personal information.</li>
              </ol>
              <Link href="/community" className="mt-5 flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2.5 text-xs font-black hover:border-[#00d564]">Longer discussions <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
          <div className="pm-card p-5">
            <Sparkles className="h-5 w-5 text-[#8b5cf6]" />
            <h3 className="mt-3 text-sm font-black">More ways to connect</h3>
            <div className="mt-3 space-y-2 text-xs font-bold text-gray-600">
              <Link href="/voice?category=Character" className="block rounded-lg bg-gray-50 p-2 hover:text-[#00a94f]">🎙️ Share a character voice</Link>
              <Link href="/upload" className="block rounded-lg bg-gray-50 p-2 hover:text-[#00a94f]">🎨 Publish your manga</Link>
              <Link href="/community" className="block rounded-lg bg-gray-50 p-2 hover:text-[#00a94f]">💬 Start a discussion</Link>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
