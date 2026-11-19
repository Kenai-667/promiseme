import { db } from "@/db";
import {
  chatMessages,
  chatRooms,
  comics,
  episodes,
  pages,
  siteProfile,
  socialLinks,
  threadComments,
  threads,
  voices,
  type ChatMessage,
  type ChatRoom,
  type Comic,
  type Episode,
  type PageImage,
  type SiteProfile,
  type SocialLink,
  type Thread,
  type ThreadComment,
  type Voice,
} from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export type ComicCard = Comic & {
  episodeCount: number;
  latestEpisode: number;
};

export type ThreadCard = Thread & { commentCount: number };

export const fallbackProfile: SiteProfile = {
  id: 1,
  ownerName: "The PromiseMe Team",
  tagline: "Stories worth promising your time to.",
  aboutText: "PromiseMe is an open home for manga makers, voice artists and readers.",
  contactEmail: "hello@promiseme.com",
  updatedAt: new Date(),
};

export async function getComicCards(): Promise<ComicCard[]> {
  await ensureSeeded();
  const [comicRows, episodeRows] = await Promise.all([
    db.select().from(comics).orderBy(desc(comics.createdAt)),
    db.select({ comicId: episodes.comicId, episodeNumber: episodes.episodeNumber }).from(episodes),
  ]);

  return comicRows.map((comic) => {
    const numbers = episodeRows.filter((episode) => episode.comicId === comic.id).map((episode) => episode.episodeNumber);
    return {
      ...comic,
      episodeCount: numbers.length,
      latestEpisode: numbers.length ? Math.max(...numbers) : 0,
    };
  });
}

export async function getComic(id: number): Promise<Comic | null> {
  await ensureSeeded();
  const rows = await db.select().from(comics).where(eq(comics.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getComicEpisodes(comicId: number): Promise<Episode[]> {
  await ensureSeeded();
  return db.select().from(episodes).where(eq(episodes.comicId, comicId)).orderBy(asc(episodes.episodeNumber));
}

export async function getEpisode(id: number): Promise<Episode | null> {
  await ensureSeeded();
  const rows = await db.select().from(episodes).where(eq(episodes.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getEpisodePages(episodeId: number): Promise<PageImage[]> {
  await ensureSeeded();
  return db.select().from(pages).where(eq(pages.episodeId, episodeId)).orderBy(asc(pages.position));
}

export async function getVoices(): Promise<Voice[]> {
  await ensureSeeded();
  return db.select().from(voices).orderBy(desc(voices.createdAt));
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  await ensureSeeded();
  return db.select().from(socialLinks).orderBy(asc(socialLinks.id));
}

export async function getProfile(): Promise<SiteProfile> {
  await ensureSeeded();
  const rows = await db.select().from(siteProfile).where(eq(siteProfile.id, 1)).limit(1);
  return rows[0] ?? fallbackProfile;
}

export async function getChatRooms(): Promise<ChatRoom[]> {
  await ensureSeeded();
  return db.select().from(chatRooms).orderBy(asc(chatRooms.id));
}

export async function getChatRoom(slug: string): Promise<ChatRoom | null> {
  await ensureSeeded();
  const rows = await db.select().from(chatRooms).where(eq(chatRooms.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getMessages(roomId: number, limit = 100): Promise<ChatMessage[]> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.roomId, roomId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
  return rows.reverse();
}

export async function getThreadCards(sort: "hot" | "new" | "top" = "hot"): Promise<ThreadCard[]> {
  await ensureSeeded();
  let threadRows: Thread[];
  if (sort === "new") {
    threadRows = await db.select().from(threads).orderBy(desc(threads.createdAt));
  } else if (sort === "top") {
    threadRows = await db.select().from(threads).orderBy(desc(threads.score));
  } else {
    threadRows = await db
      .select()
      .from(threads)
      .orderBy(desc(sql`${threads.score} + ${threads.views} / 50`));
  }
  const commentRows = await db.select({ threadId: threadComments.threadId }).from(threadComments);
  return threadRows.map((thread) => ({
    ...thread,
    commentCount: commentRows.filter((comment) => comment.threadId === thread.id).length,
  }));
}

export async function getThread(id: number): Promise<Thread | null> {
  await ensureSeeded();
  const rows = await db.select().from(threads).where(eq(threads.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getThreadComments(threadId: number): Promise<ThreadComment[]> {
  await ensureSeeded();
  return db.select().from(threadComments).where(eq(threadComments.threadId, threadId)).orderBy(asc(threadComments.createdAt));
}

export async function getCommunityStats() {
  await ensureSeeded();
  const [roomRows, threadRows, commentRows] = await Promise.all([
    db.select().from(chatRooms),
    db.select().from(threads),
    db.select().from(threadComments),
  ]);
  return {
    rooms: roomRows.length,
    threads: threadRows.length,
    comments: commentRows.length,
    members: roomRows.reduce((sum, room) => sum + room.members, 0),
  };
}
