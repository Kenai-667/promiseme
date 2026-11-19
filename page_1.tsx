import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Eye, MessageCircle, Radio, ShieldCheck, Users } from "lucide-react";
import ThreadComments from "@/components/thread-comments";
import VoteControl from "@/components/vote-control";
import { getCommunityStats, getThread, getThreadComments } from "@/lib/data";
import { COMMUNITIES, formatCount, timeAgo } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const threadId = Number(id);
  if (!Number.isInteger(threadId) || threadId < 1) notFound();

  const [thread, comments, stats] = await Promise.all([
    getThread(threadId),
    getThreadComments(threadId),
    getCommunityStats(),
  ]);
  if (!thread) notFound();
  const community = COMMUNITIES.find((item) => item.slug === thread.community);

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        <div className="pm-container flex flex-wrap items-center gap-2 py-4 text-xs font-bold text-gray-500">
          <Link href="/community" className="inline-flex items-center gap-1 hover:text-[#00a94f]"><ArrowLeft className="h-3.5 w-3.5" /> Community</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/community?community=${thread.community}`} className="hover:text-[#00a94f]">r/{thread.community}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate">Comments</span>
          <span className="ml-auto hidden items-center gap-1.5 text-[#008c40] sm:inline-flex"><ShieldCheck className="h-3.5 w-3.5" /> No verification required</span>
        </div>
      </div>

      <section className="pm-container grid gap-6 py-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <article className="pm-card p-5 sm:p-7">
            <div className="flex gap-4">
              <div className="hidden pt-1 sm:block"><VoteControl kind="thread" id={thread.id} score={thread.score} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-gray-500">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: community?.accent || "#00d564" }} />r/{thread.community}</span>
                  <span>· {timeAgo(thread.createdAt)}</span><span>· u/{thread.author}</span>
                  <span className="rounded-full bg-[#00d564]/12 px-2 py-0.5 text-[10px] font-black text-[#008c40]">{thread.flair}</span>
                </div>
                <h1 className="mt-3 text-[clamp(24px,3.5vw,38px)] font-black leading-[1.12] tracking-[-0.045em]">{thread.title}</h1>
                {thread.body && <p className="pm-prose mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700 sm:text-base">{thread.body}</p>}
                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-xs font-bold text-gray-500">
                  <div className="sm:hidden"><VoteControl kind="thread" id={thread.id} score={thread.score} compact /></div>
                  <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" />{comments.length} comments</span>
                  <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{formatCount(thread.views)} views</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{formatCount(stats.members)} members</span>
                </div>
              </div>
            </div>
          </article>

          <ThreadComments threadId={thread.id} comments={comments} />
        </div>

        <aside className="space-y-4">
          <div className="pm-card sticky top-[115px] overflow-hidden">
            <div className="bg-[#0b0c0e] px-5 py-4 text-sm font-black text-white">About r/{thread.community}</div>
            <div className="p-5">
              <p className="text-sm leading-6 text-gray-600">Talk chapters, share fan art, find collaborators, and help shape what comes next on promiseme.com.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-gray-100 py-4">
                <div><p className="text-lg font-black">{formatCount(stats.members)}</p><p className="text-[11px] font-bold text-gray-500">Members</p></div>
                <div><p className="text-lg font-black">{stats.threads}</p><p className="text-[11px] font-bold text-gray-500">Threads</p></div>
              </div>
              <Link href="/community" className="pm-btn mt-5 w-full">Back to feed</Link>
              <Link href="/chat" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2.5 text-xs font-black hover:border-[#00d564]"><Radio className="h-3.5 w-3.5" /> Live chat rooms</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#00d564]/25 bg-[#f0fff6] p-5">
            <h3 className="text-sm font-black text-[#007a35]">Post with zero gates</h3>
            <p className="mt-2 text-xs leading-5 text-[#297c4c]">No account, no email, no OTP, no creator verification. A nickname is all you need.</p>
            <Link href="/community" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#007a35] hover:underline">Create another post →</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
