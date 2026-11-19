import Link from "next/link";
import { ArrowRight, AudioLines, CheckCircle2, Headphones, Mic2, Radio, ShieldCheck, Sparkles, Upload, Waves } from "lucide-react";
import VoiceUploadForm from "@/components/voice-upload-form";
import VoicePlayer from "@/components/voice-player";
import { getVoices } from "@/lib/data";
import { timeAgo, VOICE_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Query = { category?: string };

export default async function VoicePage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const category = VOICE_CATEGORIES.includes(params.category as (typeof VOICE_CATEGORIES)[number]) ? params.category! : "All";
  const voices = await getVoices();
  const shown = category === "All" ? voices : voices.filter((voice) => voice.category === category);

  return (
    <>
      <section className="relative overflow-hidden bg-[#0b0c0e] py-12 text-white sm:py-16">
        <div className="absolute inset-0 opacity-40">
          <div className="flex h-full items-center justify-center gap-[6px]">
            {[16, 34, 62, 28, 84, 48, 108, 66, 38, 92, 52, 28, 72, 42, 88, 34, 60, 20, 46, 76, 30, 54, 18, 40, 64, 26].map((height, index) => (
              <span key={index} className="w-[5px] rounded-full bg-gradient-to-t from-[#00d564]/20 via-[#00d564] to-[#8b5cf6]/30" style={{ height }} />
            ))}
          </div>
        </div>
        <div className="pm-container relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00d564]/30 bg-[#00d564]/10 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#72f3a7]"><AudioLines className="h-3.5 w-3.5" /> Voice Studio</span>
            <h1 className="mt-5 text-[clamp(38px,6vw,66px)] font-black leading-[0.98] tracking-[-0.065em]">Give every story<br /><span className="text-[#00d564]">a voice.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">Upload the voices you want to make available, or record one right in the browser. Character reads, narration, dubbing, ASMR — you choose what the library offers.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#upload" className="pm-btn"><Mic2 className="h-4 w-4" /> Add a voice</a>
              <a href="#library" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold hover:bg-white/10">Browse library <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="pm-card border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <h2 className="flex items-center gap-2 text-lg font-black"><Waves className="h-5 w-5 text-[#00d564]" /> Your voices, your rules</h2>
            <div className="mt-5 space-y-3 text-sm text-gray-300">
              {[["Upload any audio", "MP3, WAV, M4A, OGG or WEBM up to 30 MB."], ["Record in-browser", "Use your microphone and publish the take instantly."], ["Attach a mood", "Character, narration, dubbing, ASMR or a soundscape."], ["Zero verification", "Just pick a display name — no account, no email."]].map(([title, text]) => (
                <div key={title} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00d564]" /><div><p className="font-bold text-white">{title}</p><p className="mt-0.5 text-xs text-gray-400">{text}</p></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="upload" className="pm-container py-10 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#8b5cf6]">Publish</p>
            <h2 className="pm-section-title">Make a voice available</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d564]/30 bg-[#f0fff6] px-3 py-1.5 text-xs font-black text-[#008c40]"><ShieldCheck className="h-3.5 w-3.5" /> No verification</span>
        </div>
        <VoiceUploadForm />
      </section>

      <section id="library" className="border-y border-gray-200 bg-white py-12 sm:py-14">
        <div className="pm-container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">Listen</p>
              <h2 className="pm-section-title">Voice library ({voices.length})</h2>
            </div>
            <span className="text-xs font-bold text-gray-500">New voices appear here instantly</span>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {["All", ...VOICE_CATEGORIES].map((item) => (
              <Link key={item} href={item === "All" ? "/voice" : `/voice?category=${encodeURIComponent(item)}`} className={`rounded-full px-4 py-2 text-xs font-black transition ${category === item ? "bg-[#0b0c0e] text-white" : "border border-gray-200 text-gray-600 hover:border-[#00d564]"}`}>{item}</Link>
            ))}
          </div>
          {shown.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((voice) => (
                <article key={voice.id} className="pm-card flex gap-4 p-4">
                  <img src={voice.coverUrl} alt="" loading="lazy" className="h-[150px] w-[104px] shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#8b5cf6]/12 px-2 py-1 text-[10px] font-black text-[#7c3aed]">{voice.category}</span>
                      {voice.audioUrl && <span className="rounded-full bg-[#00d564]/12 px-2 py-1 text-[10px] font-black text-[#008c40]">UPLOAD</span>}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-black leading-snug">{voice.title}</h3>
                    <p className="mt-1 text-[11px] text-gray-500">by {voice.creator} · {timeAgo(voice.createdAt)}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{voice.description}</p>
                    <div className="mt-auto"><VoicePlayer voice={voice} /></div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="pm-card p-12 text-center"><Headphones className="mx-auto h-10 w-10 text-gray-400" /><h3 className="mt-3 text-lg font-black">No voices in this category yet</h3><p className="mt-1 text-sm text-gray-500">Be the first to add one above.</p></div>
          )}
        </div>
      </section>

      <section className="pm-container py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="pm-card p-6"><Upload className="h-7 w-7 text-[#00a94f]" /><h3 className="mt-4 text-lg font-black">Upload freely</h3><p className="mt-2 text-sm leading-6 text-gray-500">Any voice you have the rights to share can be made available in seconds.</p></div>
          <div className="pm-card p-6"><Radio className="h-7 w-7 text-[#8b5cf6]" /><h3 className="mt-4 text-lg font-black">Pair it with stories</h3><p className="mt-2 text-sm leading-6 text-gray-500">Use voice packs for characters, trailers, chapter intros or ambient worlds.</p></div>
          <div className="pm-card p-6"><Sparkles className="h-7 w-7 text-[#f59e0b]" /><h3 className="mt-4 text-lg font-black">Discuss & collaborate</h3><p className="mt-2 text-sm leading-6 text-gray-500">Find voice actors and feedback in the community and live studio chat.</p><Link href="/chat?room=voice-studio" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#00a94f] hover:underline">Voice chat room <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        </div>
      </section>
    </>
  );
}
