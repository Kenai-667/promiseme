import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import SocialForm from "@/components/social-form";
import { getComicCards, getProfile, getSocialLinks, getVoices } from "@/lib/data";
import { formatCount } from "@/lib/constants";
import { ownerLockEnabled } from "@/lib/owner";

export const dynamic = "force-dynamic";

const ownerProtected = ownerLockEnabled();

export default async function AboutPage() {
  const [profile, socials, comics, voices] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getComicCards(),
    getVoices(),
  ]);

  const values = [
    { icon: ShieldCheck, title: "No verification, ever", text: "Readers and creators can post, publish, chat and comment with just a display name. No email, phone, OTP or ID." },
    { icon: ImageIcon, title: "High-graphics first", text: "Vertical manga panels are stored at their original resolution so detailed art stays crisp in the reader." },
    { icon: AudioLines, title: "Voices by choice", text: "The owner and community decide which voices are available — upload audio or record directly in the browser." },
    { icon: MessageCircle, title: "A real community", text: "Reddit-style discussion threads and live chat rooms give every chapter a place to be talked about." },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#0b0c0e] py-14 text-white sm:py-20">
        <div className="absolute right-[-120px] top-[-100px] h-96 w-96 rounded-full bg-[#00d564]/15 blur-[110px]" />
        <div className="pm-container relative grid gap-9 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00d564]/30 bg-[#00d564]/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#72f3a7]"><Sparkles className="h-3.5 w-3.5" /> About promiseme.com</span>
            <h1 className="mt-5 text-[clamp(40px,6vw,72px)] font-black leading-[0.96] tracking-[-0.07em]">Every story starts<br /><span className="text-[#00d564]">with a promise.</span></h1>
            <p className="mt-5 text-lg font-bold text-gray-300">{profile.tagline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">{profile.aboutText}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/comics" className="pm-btn"><ImageIcon className="h-4 w-4" /> Explore comics</Link>
              <a href="#owner-tools" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold hover:bg-white/10">Owner tools <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="pm-card border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#00d564] text-2xl font-black text-[#06140b]">P</span>
              <div><p className="text-xs font-black uppercase tracking-[0.15em] text-[#72f3a7]">Owned by</p><h2 className="mt-1 text-xl font-black">{profile.ownerName}</h2></div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-white/10 py-5 text-center">
              <div><p className="text-2xl font-black text-[#00d564]">{comics.length}</p><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Series</p></div>
              <div><p className="text-2xl font-black text-[#00d564]">{voices.length}</p><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Voices</p></div>
              <div><p className="text-2xl font-black text-[#00d564]">{formatCount(comics.reduce((sum, comic) => sum + comic.views, 0))}</p><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Reads</p></div>
            </div>
            <p className="mt-5 text-sm leading-6 text-gray-400">This is an open platform owned and shaped by its creators. The team&apos;s social handles live right here and can be updated any time.</p>
            <a href={`mailto:${profile.contactEmail}`} className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#00d564] hover:underline">{profile.contactEmail} <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>
      </section>

      <section className="pm-container py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">What we believe</p>
          <h2 className="pm-section-title mt-2">Built open, built for creators</h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">PromiseMe takes the familiar webtoon experience and removes every gate around publishing, talking and sharing.</p>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="pm-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#00d564]/12 text-[#008c40]"><value.icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-base font-black">{value.title}</h3>
              <p className="mt-2 text-xs leading-6 text-gray-500">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-14">
        <div className="pm-container grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">Owner social handles</p>
            <h2 className="pm-section-title mt-2">Find the people behind the site</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">Instagram, YouTube, Discord, X, TikTok — every official handle the owners want to make available is listed here. Owners can add, edit and remove handles below without signing in.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/chat" className="pm-btn"><Radio className="h-4 w-4" /> Chat with the community</Link>
              <Link href="/voice" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold hover:border-[#00d564]"><AudioLines className="h-4 w-4" /> Voice Studio</Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {socials.map((social) => (
              <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="pm-card group flex items-center gap-3 p-4 transition hover:-translate-y-1 hover:border-[#00d564]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: social.accent }}><Users className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><p className="text-sm font-black">{social.platform}</p><p className="truncate text-xs text-gray-500">{social.handle}</p></div>
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-[#00a94f]" />
              </a>
            ))}
            {!socials.length && <div className="pm-card p-6 text-sm text-gray-500">No handles yet. Add one below.</div>}
          </div>
        </div>
      </section>

      <section id="owner-tools" className="pm-container scroll-mt-28 py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b5cf6]">Owner tools</p>
            <h2 className="pm-section-title mt-2">Upload & manage social handles</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">This project is yours to copy, modify and deploy. Update the owner profile and publish the handles you want visitors to find. Permanent live ownership comes from your own hosting, database and domain accounts.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d564]/30 bg-[#f0fff6] px-3 py-1.5 text-xs font-black text-[#008c40]"><ShieldCheck className="h-3.5 w-3.5" /> {ownerProtected ? "Owner key protected" : "User verification: zero"}</span>
        </div>
        <SocialForm profile={profile} socials={socials} requiresOwnerKey={ownerProtected} />
      </section>

      <section className="border-t border-gray-200 bg-white py-14">
        <div className="pm-container">
          <h2 className="text-center text-2xl font-black tracking-[-0.04em]">Frequently asked questions</h2>
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
            {[
              ["Do I need an account to upload manga?", "No. Pick any creator name, add a cover and panels, and publish instantly. There is no sign-up, email, phone or ID verification."],
              ["Will my high-resolution art be compressed?", "Uploaded panel bytes are stored in the database and served back at their original resolution. Files can be up to 20 MB each."],
              ["Can I add more episodes later?", "Yes. Choose 'Add episode' in the upload studio, select your series, and the next episode number is assigned automatically."],
              ["How do I make voices available?", "Open Voice Studio, upload an audio file or record with your microphone, choose a category, and publish. It appears in the library immediately."],
              ["Is the chat really anonymous?", "You choose the display name shown beside your messages. No account or verification is ever requested."],
              ["Can owners change their social handles?", "Yes. The About page has live owner tools for adding handles, updating the profile text, and removing links. On a public site, set a private OWNER_EDIT_KEY to reserve these controls for the owner."],
              ["Is this website mine?", "The code and project files are yours to use, modify and deploy. You own the content you upload. The real promiseme.com domain, hosting account and DNS must be registered in your own name for permanent public ownership; the sandbox preview is temporary."],
            ].map(([question, answer]) => (
              <div key={question} className="pm-card p-5"><h3 className="text-sm font-black">{question}</h3><p className="mt-2 text-xs leading-6 text-gray-500">{answer}</p></div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center rounded-3xl bg-[#0b0c0e] p-8 text-center text-white sm:p-10">
            <Heart className="h-8 w-8 text-[#00d564]" />
            <h2 className="mt-4 text-2xl font-black">Make yourself at home.</h2>
            <p className="mt-2 max-w-lg text-sm text-gray-400">Read a chapter, post a theory, share a voice, or publish the manga you have been working on.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/upload" className="pm-btn">Upload manga</Link>
              <Link href="/community" className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold hover:bg-white/10">Join community</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
