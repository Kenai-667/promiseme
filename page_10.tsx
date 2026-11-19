import Link from "next/link";
import { ArrowRight, Check, Image as ImageIcon, Layers3, MessageCircle, Mic2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import UploadComicForm from "@/components/upload-comic-form";
import { getComicCards } from "@/lib/data";

export const dynamic = "force-dynamic";

type Query = { mode?: string; comicId?: string };

export default async function UploadPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const comics = await getComicCards();
  const initialComicId = Number(params.comicId) || 0;

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-[#0b0c0e] py-12 text-white sm:py-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00d564]/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-52 w-52 rounded-full bg-[#8b5cf6]/20 blur-[90px]" />
        <div className="pm-container relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00d564]/30 bg-[#00d564]/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#72f3a7]"><Sparkles className="h-3.5 w-3.5" /> Creator studio</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(38px,6vw,64px)] font-black leading-[0.98] tracking-[-0.065em]">Upload your manga.<br /><span className="text-[#00d564]">Keep every detail.</span></h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">High-resolution vertical panels go straight into our webtoon reader. Start a new series or add another episode to one you already published — completely free and completely open.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><ShieldCheck className="h-4 w-4 text-[#00d564]" /> No verification</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><Zap className="h-4 w-4 text-[#00d564]" /> Instant publishing</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><ImageIcon className="h-4 w-4 text-[#00d564]" /> Up to 20 MB / panel</span>
          </div>
        </div>
      </section>

      <section className="pm-container py-10 sm:py-12">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: ImageIcon, number: "01", title: "Add a cover", text: "One portrait image becomes the face of your series in the library." },
            { icon: Layers3, number: "02", title: "Drop your panels", text: "Select up to 20 high-resolution vertical images in reading order." },
            { icon: Check, number: "03", title: "Publish instantly", text: "Your episode appears in the reader immediately. No review queue." },
          ].map((step) => (
            <div key={step.number} className="pm-card flex gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#00d564]/12 text-[#008c40]"><step.icon className="h-5 w-5" /></span>
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-gray-400">STEP {step.number}</p>
                <h3 className="mt-1 text-sm font-black">{step.title}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <UploadComicForm comics={comics.map((comic) => ({ id: comic.id, title: comic.title }))} initialMode={params.mode} initialComicId={initialComicId} />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="pm-card p-6 lg:col-span-2">
            <h2 className="text-xl font-black">Built for high-graphics manga</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Original image bytes are stored, not flattened into thumbnails",
                "Long vertical strips display edge-to-edge in the reader",
                "PNG, JPG, WEBP, GIF and AVIF panel formats supported",
                "Unlimited later episodes with automatic numbering",
                "Works with original art, fan comics and experimental stories",
                "No emails, creators' IDs, OTPs or approval waiting",
              ].map((item) => (
                <div key={item} className="flex gap-2.5 text-sm text-gray-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00a94f]" />{item}</div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Link href="/voice" className="pm-card group flex items-center gap-4 p-5 transition hover:border-[#8b5cf6]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#8b5cf6]/12 text-[#8b5cf6]"><Mic2 className="h-5 w-5" /></span>
              <div><h3 className="text-sm font-black">Add voices</h3><p className="mt-1 text-xs text-gray-500">Give your characters a sound.</p></div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/community" className="pm-card group flex items-center gap-4 p-5 transition hover:border-[#00d564]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#00d564]/12 text-[#008c40]"><MessageCircle className="h-5 w-5" /></span>
              <div><h3 className="text-sm font-black">Share your launch</h3><p className="mt-1 text-xs text-gray-500">Post it in the community.</p></div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
