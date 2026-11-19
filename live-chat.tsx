"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Hash, Loader2, Radio, Send, Smile, Users } from "lucide-react";
import { avatarColor, displayName, initials, timeAgo } from "@/lib/constants";

export type ChatItem = {
  id: number;
  roomId: number;
  author: string;
  body: string;
  createdAt: string | Date;
};

type RoomItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  topic: string;
  members: number;
  accent: string;
};

export default function LiveChat({ room, initialMessages }: { room: RoomItem; initialMessages: ChatItem[] }) {
  const [messages, setMessages] = useState<ChatItem[]>(initialMessages);
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const messagesRef = useRef(messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setNickname(window.localStorage.getItem("promiseme-name") || "");
  }, []);

  useEffect(() => {
    setMessages(initialMessages);
  }, [room.id, initialMessages]);

  useEffect(() => {
    let active = true;
    async function poll() {
      const lastId = messagesRef.current.length ? messagesRef.current[messagesRef.current.length - 1].id : 0;
      try {
        const response = await fetch(`/api/chat?room=${encodeURIComponent(room.slug)}&after=${lastId}`, { cache: "no-store" });
        const data = (await response.json()) as { messages?: ChatItem[] };
        if (!active || !data.messages?.length) return;
        setMessages((current) => {
          const existing = new Set(current.map((message) => message.id));
          return [...current, ...data.messages!.filter((message) => !existing.has(message.id))];
        });
      } catch {
        // Silent retry on the next poll.
      }
    }
    const interval = window.setInterval(() => void poll(), 2500);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [room.slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = text.trim().slice(0, 1000);
    if (!clean) return;
    const author = displayName(nickname, "Guest Reader");
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: room.slug, author, body: clean }),
      });
      const data = (await response.json()) as { error?: string; message?: ChatItem };
      if (!response.ok || !data.message) throw new Error(data.error || "Message not sent.");
      setMessages((current) => current.some((message) => message.id === data.message!.id) ? current : [...current, data.message!]);
      setText("");
      window.localStorage.setItem("promiseme-name", author);
      window.setTimeout(() => scrollBoxRef.current?.scrollTo({ top: scrollBoxRef.current.scrollHeight, behavior: "smooth" }), 50);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Message not sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="pm-card flex h-[680px] min-h-[540px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${room.accent}22`, color: room.accent }}><Hash className="h-5 w-5" /></span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-black">{room.name}</h2>
          <p className="truncate text-xs text-gray-500">{room.description}</p>
        </div>
        <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-[#00d564]/30 bg-[#f0fff6] px-3 py-1.5 text-[11px] font-black text-[#008c40] sm:inline-flex">
          <Radio className="h-3.5 w-3.5" /> LIVE
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/70 px-4 py-2 text-[11px] font-bold text-gray-500 sm:px-5">
        <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {room.members.toLocaleString()} members</span>
        <span>Topic: {room.topic}</span>
      </div>

      <div ref={scrollBoxRef} className="flex-1 overflow-y-auto bg-[#fbfcfd] px-3 py-4 sm:px-5">
        <div className="mb-5 rounded-xl border border-[#00d564]/20 bg-[#f0fff6] p-3 text-center text-xs font-bold text-[#008c40]">
          Welcome to #{room.slug}. Be kind, no verification needed — just pick a name and chat.
        </div>
        <div className="space-y-4">
          {messages.map((message) => {
            const own = message.author === nickname.trim();
            return (
              <div key={message.id} className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-black text-[#06140b]" style={{ background: avatarColor(message.author) }}>{initials(message.author)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-xs">
                    <span className={`font-black ${own ? "text-[#008c40]" : "text-gray-900"}`}>{message.author}</span>
                    <span className="text-gray-400">{timeAgo(message.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-gray-700 shadow-sm">{message.body}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={send} className="border-t border-gray-200 bg-white p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Your nickname" maxLength={40} className="h-8 w-[150px] rounded-lg border border-gray-200 px-3 text-xs font-bold outline-none focus:border-[#00d564]" />
          <div className="flex gap-1">
            {["🔥", "😭", "✨", "☕", "👀"].map((emoji) => (
              <button key={emoji} type="button" onClick={() => setText((current) => `${current}${emoji}`)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm hover:border-[#00d564]" aria-label={`Add ${emoji}`}>{emoji}</button>
            ))}
          </div>
          <span className="ml-auto hidden text-[10px] font-bold text-gray-400 sm:inline-flex"><Smile className="mr-1 h-3 w-3" /> Auto-updates every 2.5s</span>
        </div>
        {error && <p className="mb-2 text-xs font-bold text-red-500">{error}</p>}
        <div className="flex gap-2">
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Message the room..." maxLength={1000} className="pm-input py-2.5" />
          <button type="submit" disabled={busy} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#00d564] text-[#06140b] transition hover:bg-[#00ef70]" aria-label="Send message">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </section>
  );
}
