import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Radio, Sparkles } from "lucide-react";
import ReaderToolbar from "@/components/reader-toolbar";
import { getComic, getComicEpisodes, getEpisode, getEpisodePages } from "@/lib/data";
import { formatCount } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ReadPage({ params }: { params: Promise<{ episodeId: string }> }) {
  const { episodeId } = await params;
  const id = Number(episodeId);
  if (!Number.isInteger(id) || id < 1) notFound();

  const episode = await getEpisode(id);
  if (!episode) notFound();
  const [comic, allEpisodes, pageList] = await Promise.all([
    getComic(episode.comicId),
    getComicEpisodes(episode.comicId),
    getEpisodePages(id),
  ]);
  if (!comic) notFound();

  const index = allEpisodes.findIndex((item) => item.id === id);
  const previous = index > 0 ? allEpisodes[index - 1] : null;
  const next = index >= 0 && index < allEpisodes.length - 1 ? allEpisodes[index + 1] : null;

  return (
    <>
      <ReaderToolbar
        comicId={comic.id}
        comicTitle={comic.title}
        episodeTitle={episode.title}
        episodeNumber={episode.episodeNumber}
        episodeId={episode.id}
        likes={episode.likes}
        prevId={previous?.id ?? null}
        nextId={next?.id ?? null}
      />

      <section className="min-h-screen bg-[#101114] py-8 text-white sm:py-10">
        <div className="mx-auto w-[min(860px,calc(100%-24px))]">
          <div className="mb-7 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#00d564]">{comic.title}</p>
            <h1 className="mt-2 text-[clamp(26px,4vw,42px)] font-black tracking-[-0.05em]">Episode {episode.episodeNumber} · {episode.title}</h1>
            <p className="mt-2 text-xs text-gray-500">{formatCount(episode.views)} views · {formatCount(episode.likes)} likes · scroll to read in full quality</p>
          </div>

          <div className="mx-auto max-w-[760px] overflow-hidden rounded-xl bg-black shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            {pageList.map((page, pageIndex) => (
              <img
                key={page.id}
                src={page.imageUrl}
                alt={`${comic.title} episode ${episode.episodeNumber}, panel ${pageIndex + 1}`}
                loading={pageIndex === 0 ? "eager" : "lazy"}
                className="reader-image"
              />
            ))}
            {!pageList.length && <div className="p-16 text-center text-gray-400">No panels have been added to this episode yet.</div>}
          </div>

          <div className="mx-auto mt-8 max-w-[760px] rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-center sm:p-10">
            <Sparkles className="mx-auto h-8 w-8 text-[#00d564]" />
            <h2 className="mt-4 text-2xl font-black">End of Episode {episode.episodeNumber}</h2>
            <p className="mt-2 text-sm text-gray-400">Loved it? Send some love and keep the promise going.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-gray-300"><Heart className="h-4 w-4 text-[#00d564]" />{formatCount(episode.likes)} likes</div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {previous && <Link href={`/read/${previous.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold hover:bg-white/10"><ArrowLeft className="h-4 w-4" /> Previous</Link>}
              {next && <Link href={`/read/${next.id}`} className="pm-btn">Next episode <ArrowRight className="h-4 w-4" /></Link>}
              <Link href={`/comics/${comic.id}#episodes`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold hover:bg-white/10">All episodes</Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 border-t border-white/10 pt-6">
              <Link href="/community" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00d564]"><MessageCircle className="h-4 w-4" /> Discuss this episode</Link>
              <Link href="/chat" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00d564]"><Radio className="h-4 w-4" /> Live chapter chat</Link>
              <Link href="/voice" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00d564]"><Sparkles className="h-4 w-4" /> Hear the voice pack</Link>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[760px] rounded-2xl bg-gradient-to-r from-[#00d564]/15 to-[#8b5cf6]/15 p-6 text-center">
            <h3 className="text-lg font-black">Have a story of your own?</h3>
            <p className="mt-2 text-sm text-gray-400">Publish high-resolution panels instantly — no account, no approval, no verification.</p>
            <Link href="/upload" className="pm-btn mt-4">Upload your manga <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
