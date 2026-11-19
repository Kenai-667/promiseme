"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CornerDownRight, Loader2, MessageSquare, Send } from "lucide-react";
import VoteControl from "@/components/vote-control";
import { avatarColor, displayName, initials, timeAgo } from "@/lib/constants";

export type CommentItem = {
  id: number;
  threadId: number;
  parentId: number | null;
  author: string;
  body: string;
  score: number;
  createdAt: string | Date;
};

export default function ThreadComments({ threadId, comments: initialComments }: { threadId: number; comments: CommentItem[] }) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNickname(window.localStorage.getItem("promiseme-name") || "");
  }, []);

  const { roots, children } = useMemo(() => {
    const map = new Map<number, CommentItem[]>();
    comments.forEach((comment) => {
      if (comment.parentId === null) return;
      const list = map.get(comment.parentId) || [];
      list.push(comment);
      map.set(comment.parentId, list);
    });
    return { roots: comments.filter((comment) => comment.parentId === null), children: map };
  }, [comments]);

  async function postComment(text: string, parentId: number | null) {
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    const author = displayName(nickname, "Guest Reader");
    try {
      const response = await fetch(`/api/threads/${threadId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body: text, parentId }),
      });
      const data = (await response.json()) as { error?: string; comment?: CommentItem };
      if (!response.ok || !data.comment) throw new Error(data.error || "Could not post the comment.");
      setComments((current) => [...current, data.comment as CommentItem]);
      window.localStorage.setItem("promiseme-name", author);
      if (parentId === null) setBody("");
      else {
        setReplyBody("");
        setReplyTo(null);
      }
    } catch (commentError) {
      setError(commentError instanceof Error ? commentError.message : "Could not post the comment.");
    } finally {
      setBusy(false);
    }
  }

  function submitTop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void postComment(body, null);
  }

  function renderComment(comment: CommentItem, depth = 0): React.ReactNode {
    const replies = children.get(comment.id) || [];
    return (
      <div key={comment.id} className={depth > 0 ? "ml-4 border-l-2 border-gray-200 pl-4 sm:ml-6 sm:pl-5" : ""}>
        <div className="py-4">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-black text-[#06140b]" style={{ background: avatarColor(comment.author) }}>{initials(comment.author)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="font-black">u/{comment.author}</span>
                <span className="text-gray-400">· {timeAgo(comment.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{comment.body}</p>
              <div className="mt-2 flex items-center gap-4">
                <VoteControl kind="comment" id={comment.id} score={comment.score} compact />
                <button type="button" onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyBody(""); }} className="inline-flex items-center gap-1.5 text-xs font-black text-gray-500 hover:text-[#00a94f]">
                  <CornerDownRight className="h-3.5 w-3.5" /> Reply
                </button>
              </div>
              {replyTo === comment.id && (
                <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); void postComment(replyBody, comment.id); }}>
                  <input value={replyBody} onChange={(event) => setReplyBody(event.target.value)} placeholder={`Reply to u/${comment.author}...`} maxLength={2000} className="pm-input py-2.5" autoFocus />
                  <button type="submit" disabled={busy} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#00d564] text-[#06140b]" aria-label="Send reply"><Send className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </div>
        </div>
        {replies.length > 0 && <div>{replies.map((reply) => renderComment(reply, depth + 1))}</div>}
      </div>
    );
  }

  return (
    <section className="pm-card p-5 sm:p-7">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <MessageSquare className="h-5 w-5 text-[#00a94f]" />
        <h2 className="text-lg font-black">{comments.length} Comments</h2>
        <span className="ml-auto text-xs font-bold text-gray-500">No account required</span>
      </div>

      <form onSubmit={submitTop} className="mt-5">
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Your nickname" maxLength={40} className="pm-input" />
          <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Join the conversation..." maxLength={2000} className="pm-input min-h-[84px]" />
        </div>
        {error && <p className="mt-2 text-xs font-bold text-red-500">{error}</p>}
        <div className="mt-3 flex justify-end">
          <button type="submit" disabled={busy} className="pm-btn">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting...</> : <><Send className="h-4 w-4" /> Comment</>}</button>
        </div>
      </form>

      <div className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
        {roots.length ? roots.map((comment) => renderComment(comment)) : (
          <p className="py-10 text-center text-sm text-gray-500">No comments yet. Be the first to start the conversation.</p>
        )}
      </div>
    </section>
  );
}
