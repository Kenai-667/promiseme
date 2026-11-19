import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  ChevronRight,
  Flame,
  MessageCircle,
  Mic2,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import HomeHero from "@/components/home-hero";
import ComicCard from "@/components/comic-card";
import VoicePlayer from "@/components/voice-player";
import { getChatRooms, getComicCards, getSocialLinks, getThreadCards, getVoices } from "@/lib/data";
import { formatCount, formatRating, GENRES, timeAgo } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cards, voiceRows, threadRows, socials, rooms] = await Promise.all([
    getComicCards(),
    getVoices(),
    getThreadCards("hot"),
    getSocialLinks(),
    getChatRooms(),
  ]);

  const featured = cards.filter((comic) => comic.featured).slice(0, 5);
  const trending = [...cards].sort((a, b) => b.views - a.views);
  const fresh = [...cards].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <>
      <HomeHero comics={featured} />

      <section className="border-b border-gray-200 bg-white">
        <div className="pm-container flex flex-wrap items-center gap-2 py-5">
          <span className="mr-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-gray-500"><Sparkles className="h-4 w-4 text-[#00d564]" /> Browse</span>
          {GENRES.slice(1).map((genre) => (
            <Link key={genre} href={`/comics?genre=${encodeURIComponent(genre)}`} className="pm-chip">{genre}</Link>
          ))}
          <Link href="/rankings" className="ml-auto inline-flex items-center gap-1 text-xs font-black text-[#009e4b] hover:underline">Top 10 <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
      </section>

      <section className="pm-container py-14 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">Fresh on PromiseMe</p>
            <h2 className="pm-section-title">New & noteworthy</h2>
          </div>
          <Link href="/comics" className="inline-flex items-center gap-1.5 text-sm font-black text-gray-600 hover:text-[#00a94f]">See all comics <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {fresh.map((comic) => <ComicCard key={comic.id} comic={comic} />)}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-14 sm:py-16">
        <div className="pm-container">
          <div className="mb-7 flex items-center gap-2">
            <Flame className="h-6 w-6 text-[#f97316]" />
            <h2 className="pm-section-title">Today&apos;s lineup</h2>
            <span className="ml-auto hidden text-xs font-bold text-gray-500 sm:inline">Fresh episodes, every single day</span>
          </div>
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
            {days.map((day, index) => (
              <span key={day} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${index === 0 ? "bg-[#0b0c0e] text-white" : "bg-gray-100 text-gray-500"}`}>{day}</span>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
              {trending.slice(0, 4).map((comic) => <ComicCard key={comic.id} comic={comic} />)}
            </div>
            <div className="pm-card flex flex-col justify-between overflow-hidden bg-[#0b0c0e] p-6 text-white">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00d564]/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#72f3a7]"><TrendingUp className="h-3.5 w-3.5" /> Trending now</span>
                <h3 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.05em]">Your story could be next.</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">Upload high-resolution vertical panels and publish an episode in minutes. No approval queue, no verification, no account.</p>
              </div>
              <div className="mt-7 space-y-3">
                <Link href="/upload" className="pm-btn w-full"><Upload className="h-4 w-4" /> Upload your manga</Link>
                <Link href="/comics" className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold hover:bg-white/10">Browse the library</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pm-container py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">Reader favorites</p>
                <h2 className="pm-section-title">Top 10 today</h2>
              </div>
              <Link href="/rankings" className="inline-flex items-center gap-1 text-sm font-black text-gray-600 hover:text-[#00a94f]">Full chart <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="pm-card divide-y divide-gray-100 overflow-hidden">
              {trending.slice(0, 6).map((comic, index) => (
                <Link key={comic.id} href={`/comics/${comic.id}`} className="flex items-center gap-3 p-3 transition hover:bg-gray-50 sm:gap-4 sm:p-4">
                  <span className={`w-7 shrink-0 text-center text-lg font-black ${index < 3 ? "text-[#00a94f]" : "text-gray-400"}`}>{index + 1}</span>
                  <img src={comic.coverUrl} alt="" loading="lazy" className="h-16 w-12 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">{comic.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{comic.genre} · {comic.creator}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] font-bold text-gray-500">
                      <span className="inline-flex items-center gap-1 text-[#e5a00d]"><Star className="h-3 w-3 fill-current" />{formatRating(comic.rating)}</span>
                      <span>{formatCount(comic.views)} reads</span>
                    </div>
                  </div>
                  <span className="hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black text-[#00a94f] sm:inline-flex">▲ {index + 2}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="pm-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <AudioLines className="h-5 w-5 text-[#8b5cf6]" /><h3 className="font-black">Voice Studio</h3>
                <Link href="/voice" className="ml-auto text-xs font-black text-[#00a94f] hover:underline">Open studio →</Link>
              </div>
              <div className="space-y-4 p-5">
                {voiceRows.slice(0, 2).map((voice) => (
                  <div key={voice.id} className="flex gap-3">
                    <img src={voice.coverUrl} alt="" loading="lazy" className="h-20 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-black">{voice.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">by {voice.creator} · {voice.category}</p>
                      <VoicePlayer voice={voice} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/upload" className="pm-shine relative block overflow-hidden rounded-2xl bg-gradient-to-br from-[#00d564] to-[#00a94f] p-6 text-[#06140b] no-underline">
              <ShieldCheck className="h-7 w-7" />
              <h3 className="relative mt-4 text-2xl font-black leading-tight tracking-[-0.04em]">No sign-up.<br />No verification.<br />Just publish.</h3>
              <p className="relative mt-3 text-sm font-bold opacity-75">High-graphics manga uploads stay sharp, exactly as you made them.</p>
              <span className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-[#06140b] px-4 py-2 text-xs font-black text-white">Start uploading <ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-14 sm:py-16">
        <div className="pm-container">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">Reddit-style community</p>
              <h2 className="pm-section-title">Talk about the stories you love</h2>
            </div>
            <Link href="/community" className="inline-flex items-center gap-1.5 text-sm font-black text-gray-600 hover:text-[#00a94f]">All discussions <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {threadRows.slice(0, 3).map((thread) => (
              <Link key={thread.id} href={`/community/${thread.id}`} className="pm-card block p-5 transition hover:-translate-y-1 hover:border-[#00d564]">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                  <span className="rounded-full bg-[#00d564]/12 px-2 py-1 text-[#008c40]">r/{thread.community}</span>
                  <span>· {timeAgo(thread.createdAt)}</span>
                </div>
                <h3 className="mt-3 line-clamp-2 text-base font-black leading-snug">{thread.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{thread.body}</p>
                <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3 text-xs font-bold text-gray-500">
                  <span>▲ {formatCount(thread.score)}</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{thread.commentCount}</span>
                  <span className="ml-auto text-[#00a94f]">Read →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-[#f8faf9] p-4">
            <Radio className="h-5 w-5 text-[#00a94f]" />
            <p className="text-sm font-bold">Prefer real-time? Jump into {rooms.length} live chat rooms — no login, no verification.</p>
            <Link href="/chat" className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#0b0c0e] px-4 py-2 text-xs font-black text-white hover:bg-gray-800">Open live chat <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      <section className="pm-container py-14 sm:py-16">
        <div className="grid gap-8 rounded-3xl bg-[#0b0c0e] p-7 text-white sm:p-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d564]/30 bg-[#00d564]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#72f3a7]"><Users className="h-3.5 w-3.5" /> About PromiseMe</span>
            <h2 className="mt-5 text-[clamp(28px,4vw,46px)] font-black leading-[1.06] tracking-[-0.055em]">Made by story people, for story people.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">Read gorgeous vertical comics, publish your own high-resolution chapters, give characters a voice, and hang out in discussion threads or live chat. The owners keep their socials right here, always up to date.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about" className="pm-btn"><BookOpen className="h-4 w-4" /> Our story</Link>
              <Link href="/voice" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold hover:bg-white/10"><Mic2 className="h-4 w-4" /> Voice Studio</Link>
            </div>
          </div>
          <div className="grid content-center gap-2 sm:grid-cols-2">
            {socials.slice(0, 6).map((social) => (
              <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold transition hover:border-[#00d564] hover:text-[#00d564]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: social.accent }} />
                <span className="truncate">{social.platform}</span>
                <span className="ml-auto truncate text-xs font-medium text-gray-500">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="pm-container flex flex-col items-center py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#00d564]/15 text-[#00a94f]"><Upload className="h-7 w-7" /></span>
          <h2 className="mt-5 text-[clamp(28px,4vw,44px)] font-black leading-tight tracking-[-0.05em]">Got a manga waiting in your folder?</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">Bring it to promiseme.com in full quality. Pick any creator name, upload your panels, and share the link — zero gates in between.</p>
          <Link href="/upload" className="pm-btn mt-7 px-8 py-3.5 text-base">Publish your first episode <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
