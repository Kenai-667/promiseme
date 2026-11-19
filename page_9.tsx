import Link from "next/link";
import { BookOpen, Search, ShieldCheck, SlidersHorizontal, Upload } from "lucide-react";
import ComicCard from "@/components/comic-card";
import { getComicCards } from "@/lib/data";
import { GENRES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Query = { q?: string; genre?: string; sort?: string };

export default async function ComicsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const query = (params.q || "").trim().slice(0, 100);
  const genre = GENRES.includes(params.genre as (typeof GENRES)[number]) ? params.genre! : "All";
  const sort = ["popular", "new", "rating", "az"].includes(params.sort || "") ? params.sort! : "popular";
  const all = await getComicCards();

  const filtered = all.filter((comic) => {
    const haystack = `${comic.title} ${comic.creator} ${comic.genre} ${comic.tags} ${comic.description}`.toLowerCase();
    return (genre === "All" || comic.genre === genre) && (!query || haystack.includes(query.toLowerCase()));
  });

  filtered.sort((a, b) => {
    if (sort === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "az") return a.title.localeCompare(b.title);
    return b.views - a.views;
  });

  function buildHref(next: { genre?: string; sort?: string }) {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    const nextGenre = next.genre ?? genre;
    const nextSort = next.sort ?? sort;
    if (nextGenre !== "All") search.set("genre", nextGenre);
    if (nextSort !== "popular") search.set("sort", nextSort);
    const string = search.toString();
    return string ? `/comics?${string}` : "/comics";
  }

  return (
    <>
      <section className="border-b border-gray-200 bg-white py-10 sm:py-12">
        <div className="pm-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#00a94f]">The library</p>
              <h1 className="text-[clamp(32px,5vw,52px)] font-black leading-none tracking-[-0.06em]">Comics & manga</h1>
              <p className="mt-3 text-sm text-gray-500">{all.length} series · reader favorites and independent uploads, all in one place.</p>
            </div>
            <Link href="/upload" className="pm-btn"><Upload className="h-4 w-4" /> Upload your own</Link>
          </div>
          <form action="/comics" className="mt-7 flex flex-col gap-3 sm:flex-row">
            {genre !== "All" && <input type="hidden" name="genre" value={genre} />}
            {sort !== "popular" && <input type="hidden" name="sort" value={sort} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input name="q" defaultValue={query} placeholder="Search titles, creators, genres or tags..." className="pm-input h-12 pl-11" />
            </div>
            <button type="submit" className="h-12 rounded-xl bg-[#0b0c0e] px-7 text-sm font-black text-white hover:bg-gray-800">Search</button>
          </form>
        </div>
      </section>

      <section className="pm-container py-8 sm:py-10">
        <div className="mb-5 flex flex-wrap gap-2">
          {GENRES.map((item) => (
            <Link key={item} href={buildHref({ genre: item })} className={`rounded-full px-4 py-2 text-xs font-black transition ${item === genre ? "bg-[#00d564] text-[#06140b]" : "border border-gray-200 bg-white text-gray-600 hover:border-[#00d564]"}`}>{item}</Link>
          ))}
        </div>

        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
          <div className="inline-flex items-center gap-2 text-xs font-black text-gray-500"><SlidersHorizontal className="h-4 w-4" /> Sort by</div>
          <div className="flex flex-wrap gap-1.5">
            {[{ id: "popular", label: "Popular" }, { id: "new", label: "Newest" }, { id: "rating", label: "Top rated" }, { id: "az", label: "A–Z" }].map((item) => (
              <Link key={item.id} href={buildHref({ sort: item.id })} className={`rounded-full px-3 py-1.5 text-xs font-bold ${sort === item.id ? "bg-[#0b0c0e] text-white" : "text-gray-500 hover:bg-gray-100"}`}>{item.label}</Link>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008c40]"><ShieldCheck className="h-3.5 w-3.5" /> No verification to upload</div>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#00a94f]" />
          <h2 className="text-lg font-black">{filtered.length} {filtered.length === 1 ? "series" : "series"} found</h2>
          {query && <span className="text-sm text-gray-500">for “{query}”</span>}
        </div>

        {filtered.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map((comic) => <ComicCard key={comic.id} comic={comic} />)}
          </div>
        ) : (
          <div className="pm-card p-12 text-center">
            <h3 className="text-xl font-black">No comics matched that search</h3>
            <p className="mt-2 text-sm text-gray-500">Try another genre or keyword — or add the story yourself.</p>
            <Link href="/upload" className="pm-btn mt-5">Upload a comic</Link>
          </div>
        )}
      </section>
    </>
  );
}
