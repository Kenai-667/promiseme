"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { CheckCircle2, CloudUpload, ImagePlus, Loader2, ShieldCheck, Trash2, X } from "lucide-react";
import { GENRES } from "@/lib/constants";

type SeriesOption = { id: number; title: string };

export default function UploadComicForm({
  comics,
  initialMode = "series",
  initialComicId = 0,
}: {
  comics: SeriesOption[];
  initialMode?: string;
  initialComicId?: number;
}) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode === "episode" && comics.length ? "episode" : "series");
  const [comicId, setComicId] = useState(String(initialComicId || comics[0]?.id || ""));
  const [pages, setPages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ comicId: number; episodeId: number } | null>(null);
  const pageInput = useRef<HTMLInputElement>(null);

  function addPages(files: FileList | null) {
    if (!files) return;
    const room = 20 - pages.length;
    const selected = Array.from(files).filter((file) => file.type.startsWith("image/")).slice(0, room);
    if (!selected.length) return;
    setPages((current) => [...current, ...selected]);
    setPreviews((current) => [...current, ...selected.map((file) => URL.createObjectURL(file))]);
  }

  function removePage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setPages((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function chooseCover(file: File | null) {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCover(file);
    setCoverPreview(file ? URL.createObjectURL(file) : "");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!pages.length) {
      setError("Add at least one high-resolution episode panel.");
      return;
    }
    if (mode === "series" && !cover) {
      setError("Add a cover image for your new series.");
      return;
    }
    if (mode === "episode" && !comicId) {
      setError("Choose the series for this episode.");
      return;
    }

    const form = new FormData(event.currentTarget);
    form.set("mode", mode);
    form.delete("pages");
    pages.forEach((file) => form.append("pages", file));
    form.delete("cover");
    if (cover) form.append("cover", cover);
    if (mode === "episode") form.set("comicId", comicId);

    setBusy(true);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await response.json()) as { error?: string; comicId?: number; episodeId?: number };
      if (!response.ok || !data.comicId || !data.episodeId) throw new Error(data.error || "Upload failed. Please try again.");
      setResult({ comicId: data.comicId, episodeId: data.episodeId });
      setPages([]);
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
      setCover(null);
      setCoverPreview("");
      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="pm-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[#00d564]" />
        <h2 className="mt-4 text-2xl font-black">Your manga is live!</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">No review queue, no email confirmation, no verification. Your high-resolution panels are published instantly.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/read/${result.episodeId}`} className="pm-btn">Read the episode</Link>
          <Link href={`/comics/${result.comicId}`} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold hover:border-[#00d564]">View series</Link>
          <button type="button" onClick={() => setResult(null)} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold hover:border-[#00d564]">Upload another</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="pm-card overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-[#f0fff6] to-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("series")}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${mode === "series" ? "bg-[#0b0c0e] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            New series
          </button>
          <button
            type="button"
            onClick={() => setMode("episode")}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${mode === "episode" ? "bg-[#0b0c0e] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            Add episode
          </button>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#00d564]/30 bg-white px-3 py-1.5 text-xs font-bold text-[#008a3d]">
            <ShieldCheck className="h-3.5 w-3.5" /> No verification
          </span>
        </div>
      </div>

      <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {mode === "episode" && (
            <div>
              <label className="pm-label" htmlFor="comic-select">Choose your series</label>
              <select id="comic-select" value={comicId} onChange={(event) => setComicId(event.target.value)} className="pm-input" required>
                {comics.map((comic) => <option key={comic.id} value={comic.id}>{comic.title}</option>)}
              </select>
            </div>
          )}

          {mode === "series" && (
            <>
              <div>
                <label className="pm-label" htmlFor="title">Series title *</label>
                <input id="title" name="title" className="pm-input" placeholder="e.g. A Promise Under Stars" maxLength={100} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="pm-label" htmlFor="creator">Creator name *</label>
                  <input id="creator" name="creator" className="pm-input" placeholder="Any display name you like" maxLength={60} required />
                </div>
                <div>
                  <label className="pm-label" htmlFor="genre">Genre *</label>
                  <select id="genre" name="genre" className="pm-input" defaultValue="Romance">
                    {GENRES.filter((genre) => genre !== "All").map((genre) => <option key={genre} value={genre}>{genre}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="pm-label" htmlFor="description">Story description *</label>
                <textarea id="description" name="description" className="pm-input min-h-[115px]" placeholder="Tell readers what makes your story special..." maxLength={2000} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <div>
                  <label className="pm-label" htmlFor="tags">Tags</label>
                  <input id="tags" name="tags" className="pm-input" placeholder="Fantasy, Slow Burn, Found Family" maxLength={160} />
                </div>
                <div>
                  <label className="pm-label" htmlFor="accent">Accent</label>
                  <input id="accent" name="accent" type="color" defaultValue="#00d564" className="pm-input w-full" />
                </div>
              </div>
            </>
          )}

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <label className="pm-label" htmlFor="episode-title">Episode title *</label>
            <input id="episode-title" name="episodeTitle" className="pm-input" placeholder="Episode 1 — The Beginning" maxLength={120} required />
            <p className="mt-2 text-xs text-gray-500">New episodes are automatically numbered after the latest one.</p>
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <span className="pm-label mb-0">Episode panels * ({pages.length}/20)</span>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP, GIF or AVIF · up to 20 MB each · original resolution preserved</p>
              </div>
              {pages.length > 0 && (
                <button type="button" onClick={() => { previews.forEach(URL.revokeObjectURL); setPages([]); setPreviews([]); }} className="text-xs font-bold text-red-500 hover:underline">Clear all</button>
              )}
            </div>
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); addPages(event.dataTransfer.files); }}
              className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-7 text-center transition hover:border-[#00d564] hover:bg-[#f7fff9]"
            >
              <CloudUpload className="mx-auto h-10 w-10 text-[#00d564]" />
              <p className="mt-3 text-sm font-bold">Drag & drop your vertical panels here</p>
              <p className="mt-1 text-xs text-gray-500">They will appear in the exact order you select them.</p>
              <button type="button" onClick={() => pageInput.current?.click()} className="mt-4 rounded-full bg-[#0b0c0e] px-5 py-2.5 text-xs font-black text-white hover:bg-gray-800">
                Choose high-res images
              </button>
              <input ref={pageInput} type="file" name="pages" accept="image/*" multiple className="hidden" onChange={(event) => { addPages(event.target.files); event.target.value = ""; }} />
            </div>
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {previews.map((url, index) => (
                  <div key={url} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img src={url} alt={`Panel ${index + 1}`} className="aspect-[3/4] h-full w-full object-cover" />
                    <span className="absolute left-1.5 top-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-black text-white">{index + 1}</span>
                    <button type="button" onClick={() => removePage(index)} aria-label={`Remove panel ${index + 1}`} className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          {mode === "series" && (
            <div className="rounded-2xl border border-gray-200 p-4">
              <span className="pm-label">Series cover *</span>
              <div className="relative overflow-hidden rounded-xl bg-gray-100">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[3/4] place-items-center text-center">
                    <div>
                      <ImagePlus className="mx-auto h-9 w-9 text-gray-400" />
                      <p className="mt-2 px-4 text-xs font-bold text-gray-500">Portrait cover recommended</p>
                    </div>
                  </div>
                )}
                <label className="absolute inset-x-3 bottom-3 cursor-pointer rounded-full bg-[#0b0c0e]/90 py-2.5 text-center text-xs font-black text-white hover:bg-black">
                  {cover ? "Change cover" : "Upload cover"}
                  <input type="file" name="cover" accept="image/*" className="hidden" onChange={(event) => chooseCover(event.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>
          )}
          <div className="rounded-2xl bg-[#0b0c0e] p-5 text-white">
            <h3 className="text-sm font-black text-[#00d564]">Zero gates, full quality</h3>
            <ul className="mt-3 space-y-2.5 text-xs leading-5 text-gray-300">
              <li>✓ No account or sign-up</li>
              <li>✓ No email, phone or OTP</li>
              <li>✓ No creator verification</li>
              <li>✓ Original image bytes stored</li>
              <li>✓ Vertical webtoon reader</li>
              <li>✓ Add unlimited episodes later</li>
            </ul>
          </div>
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}
          <button type="submit" disabled={busy} className="pm-btn w-full py-3.5">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</> : <><CloudUpload className="h-4 w-4" /> Publish instantly</>}
          </button>
          <p className="text-center text-xs text-gray-500">By uploading, you confirm you have the rights to share this work.</p>
        </aside>
      </div>
    </form>
  );
}
