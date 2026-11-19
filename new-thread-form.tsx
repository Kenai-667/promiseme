"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PenLine, ShieldCheck } from "lucide-react";
import { COMMUNITIES, FLAIRS } from "@/lib/constants";

export default function NewThreadForm({ defaultCommunity = "promiseme" }: { defaultCommunity?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          community: form.get("community"),
          title: form.get("title"),
          body: form.get("body"),
          author: form.get("author"),
          flair: form.get("flair"),
        }),
      });
      const data = (await response.json()) as { error?: string; id?: number };
      if (!response.ok || !data.id) throw new Error(data.error || "Could not create the post.");
      window.localStorage.setItem("promiseme-name", String(form.get("author") || "").trim());
      setOpen(false);
      router.push(`/community/${data.id}`);
      router.refresh();
    } catch (postError) {
      setError(postError instanceof Error ? postError.message : "Could not create the post.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pm-card flex w-full items-center gap-3 px-4 py-3 text-left transition hover:border-[#00d564]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#00d564]/15 font-black text-[#008c40]">P</span>
        <span className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500">Create a post — just pick a nickname...</span>
        <PenLine className="h-4 w-4 shrink-0 text-gray-400" />
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="pm-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-lg font-black">Create a post</h2>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#f0fff6] px-3 py-1.5 text-[11px] font-black text-[#008c40]"><ShieldCheck className="h-3.5 w-3.5" /> No verification</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="pm-label" htmlFor="thread-community">Community</label>
          <select id="thread-community" name="community" className="pm-input" defaultValue={defaultCommunity}>
            {COMMUNITIES.map((community) => <option key={community.slug} value={community.slug}>{community.label}</option>)}
          </select>
        </div>
        <div>
          <label className="pm-label" htmlFor="thread-flair">Flair</label>
          <select id="thread-flair" name="flair" className="pm-input" defaultValue="Discussion">
            {FLAIRS.map((flair) => <option key={flair} value={flair}>{flair}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="pm-label" htmlFor="thread-author">Display name</label>
        <input id="thread-author" name="author" className="pm-input" placeholder="Any nickname — no account needed" maxLength={40} required />
      </div>
      <div className="mt-4">
        <label className="pm-label" htmlFor="thread-title">Title *</label>
        <input id="thread-title" name="title" className="pm-input" placeholder="An interesting title" maxLength={180} required />
      </div>
      <div className="mt-4">
        <label className="pm-label" htmlFor="thread-body">Text</label>
        <textarea id="thread-body" name="body" className="pm-input min-h-[110px]" placeholder="Share your thoughts, theories, artwork notes or questions..." maxLength={5000} />
      </div>
      {error && <p className="mt-3 text-xs font-bold text-red-500">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={busy} className="pm-btn">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</> : "Post instantly"}</button>
      </div>
    </form>
  );
}
