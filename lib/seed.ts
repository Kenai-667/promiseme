import { db } from "@/db";
import {
  appMeta,
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
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const SEED_KEY = "promiseme_seed_v1";
const LOCK_ID = 728193;

type SeedComic = {
  slug: string;
  title: string;
  creator: string;
  genre: string;
  tags: string;
  description: string;
  coverUrl: string;
  bannerUrl: string;
  accent: string;
  status: string;
  updateDay: string;
  views: number;
  likes: number;
  rating: number;
  featured: boolean;
};

const comicSeeds: SeedComic[] = [
  {
    slug: "moonlit-promise",
    title: "Moonlit Promise",
    creator: "A. R. Vale",
    genre: "Romance",
    tags: "Fantasy, Royalty, Slow Burn",
    description: "A silver-haired heiress makes a promise to the moon — and to the dangerously charming prince who refuses to let her break it. A lush romantic fantasy about fate, court intrigue and the vows that outlive kingdoms.",
    coverUrl: "/images/cover-moonlit.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#8b5cf6",
    status: "Ongoing",
    updateDay: "MON",
    views: 2480000,
    likes: 184300,
    rating: 99,
    featured: true,
  },
  {
    slug: "neon-rebellion",
    title: "Neon Rebellion",
    creator: "KIRA",
    genre: "Sci-Fi",
    tags: "Cyberpunk, Action, Strong Lead",
    description: "In a city where memories are rented and emotions are taxed, one courier discovers the signal that could bring the whole system down. Turn up the color and hold on tight.",
    coverUrl: "/images/cover-neon.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#ec4899",
    status: "Ongoing",
    updateDay: "TUE",
    views: 1920000,
    likes: 141900,
    rating: 97,
    featured: true,
  },
  {
    slug: "the-last-ember",
    title: "The Last Ember",
    creator: "Dawn Seo",
    genre: "Fantasy",
    tags: "Dragons, Epic, Adventure",
    description: "The final dragon chose the one knight who never wanted a crown. Together they must cross a burning continent to relight the last ember before an endless winter arrives.",
    coverUrl: "/images/cover-ember.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#f97316",
    status: "Ongoing",
    updateDay: "WED",
    views: 1680000,
    likes: 126400,
    rating: 98,
    featured: true,
  },
  {
    slug: "cafe-after-midnight",
    title: "Cafe After Midnight",
    creator: "Mimu",
    genre: "Slice of Life",
    tags: "Cozy, Food, Healing",
    description: "Every night at 12:01, the little cafe at the end of the street opens for people who need a second chance. Warm coffee, quiet conversations, and one very judgmental cat.",
    coverUrl: "/images/cover-cafe.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#f59e0b",
    status: "Ongoing",
    updateDay: "THU",
    views: 974000,
    likes: 88200,
    rating: 96,
    featured: false,
  },
  {
    slug: "diamond-heart",
    title: "Diamond Heart",
    creator: "Sora Han",
    genre: "Romance",
    tags: "School, Comedy, Coming of Age",
    description: "The school's most popular girl has a secret: she can see the shape of every promise people make. Then a boy arrives whose promise has no shape at all.",
    coverUrl: "/images/cover-diamond.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#ec4899",
    status: "Ongoing",
    updateDay: "FRI",
    views: 1430000,
    likes: 112800,
    rating: 95,
    featured: true,
  },
  {
    slug: "shadow-academy",
    title: "Shadow Academy",
    creator: "Noct",
    genre: "Supernatural",
    tags: "Magic, Mystery, Dark",
    description: "At Blackthorn Academy, every spell leaves a shadow — and someone has been collecting them. A beautifully eerie supernatural mystery for readers who love secrets.",
    coverUrl: "/images/cover-shadow.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#7c3aed",
    status: "Ongoing",
    updateDay: "SAT",
    views: 1180000,
    likes: 96500,
    rating: 94,
    featured: false,
  },
  {
    slug: "starlight-delivery",
    title: "Starlight Delivery",
    creator: "Pico",
    genre: "Sci-Fi",
    tags: "Space, Whimsical, Found Family",
    description: "A cheerful interplanetary delivery rider, a pocket-sized robot, and a package addressed to a star that no longer exists. A bright little adventure across the cosmos.",
    coverUrl: "/images/cover-starlight.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#06b6d4",
    status: "Ongoing",
    updateDay: "SUN",
    views: 826000,
    likes: 74100,
    rating: 93,
    featured: false,
  },
  {
    slug: "crimson-vow",
    title: "Crimson Vow",
    creator: "Luna R.",
    genre: "Drama",
    tags: "Historical, Romance, Destiny",
    description: "Under a sky of falling blossoms, two rival families sign a vow neither side intends to keep. A sweeping historical romance about the promises we inherit.",
    coverUrl: "/images/hero-promise.jpg",
    bannerUrl: "/images/hero-promise.jpg",
    accent: "#c084fc",
    status: "Completed",
    updateDay: "END",
    views: 2110000,
    likes: 173500,
    rating: 99,
    featured: true,
  },
];

const globalForSeed = globalThis as typeof globalThis & {
  __promiseMeSeedPromise?: Promise<void>;
};

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__promiseMeSeedPromise) {
    globalForSeed.__promiseMeSeedPromise = runSeed().catch((error) => {
      globalForSeed.__promiseMeSeedPromise = undefined;
      throw error;
    });
  }
  return globalForSeed.__promiseMeSeedPromise;
}

async function runSeed(): Promise<void> {
  await db.execute(sql`select pg_advisory_lock(${LOCK_ID})`);
  try {
    const existing = await db.select().from(appMeta).where(eq(appMeta.key, SEED_KEY)).limit(1);
    if (existing.length > 0) return;

    const now = Date.now();
    const ago = (minutes: number) => new Date(now - minutes * 60_000);

    await db.transaction(async (tx) => {
      await tx.insert(siteProfile).values({
        id: 1,
        ownerName: "The PromiseMe Team",
        tagline: "Stories worth promising your time to.",
        aboutText: "PromiseMe.com is an open home for manga makers, voice artists and readers. Upload your own high-resolution chapters, share character voices, and talk with the community — no account, no email, no verification. Every story starts with a promise, and yours belongs here.",
        contactEmail: "hello@promiseme.com",
      }).onConflictDoNothing();

      const insertedComics = await tx.insert(comics).values(comicSeeds).returning({
        id: comics.id,
        slug: comics.slug,
        coverUrl: comics.coverUrl,
        accent: comics.accent,
      });

      const episodeRows = insertedComics.flatMap((comic) =>
        [1, 2, 3].map((number) => ({
          comicId: comic.id,
          episodeNumber: number,
          title: [
            "The Promise Begins",
            "A Dangerous Secret",
            "What the Night Kept",
          ][number - 1],
          thumbnailUrl: comic.coverUrl,
          views: Math.round(180000 / number + comic.id * 4211),
          likes: Math.round(22000 / number + comic.id * 733),
        })),
      );

      const insertedEpisodes = await tx.insert(episodes).values(episodeRows).returning({
        id: episodes.id,
        comicId: episodes.comicId,
        episodeNumber: episodes.episodeNumber,
      });

      const romancePanel = "/images/panel-romance.jpg";
      const actionPanel = "/images/panel-action.jpg";
      const pageRows = insertedEpisodes.flatMap((episode) => {
        const comic = insertedComics.find((item) => item.id === episode.comicId);
        const panel = ["Romance", "Drama", "Slice of Life"].includes(
          comicSeeds.find((item) => item.slug === comic?.slug)?.genre ?? "",
        )
          ? romancePanel
          : actionPanel;
        return [
          { episodeId: episode.id, position: 1, imageUrl: panel },
          { episodeId: episode.id, position: 2, imageUrl: comic?.coverUrl ?? "/images/hero-promise.jpg" },
          { episodeId: episode.id, position: 3, imageUrl: "/images/hero-promise.jpg" },
        ];
      });
      await tx.insert(pages).values(pageRows);

      await tx.insert(voices).values([
        {
          title: "Moonlit Prince — Calm & Commanding",
          creator: "A. R. Vale",
          description: "A soft, low character reading for the prince of Moonlit Promise. Perfect for dramatic late-night chapters.",
          category: "Character",
          audioUrl: null,
          sampleScript: "I made a promise to the moon. I intend to keep it, even if the whole kingdom forgets.",
          coverUrl: "/images/cover-moonlit.jpg",
          durationLabel: "Voice sample",
          plays: 18420,
        },
        {
          title: "Neon City Narration",
          creator: "KIRA",
          description: "Fast, cinematic cyberpunk narration with a bright electric edge.",
          category: "Narration",
          audioUrl: null,
          sampleScript: "The rain remembers every name the city tried to delete. Tonight, one of them came back.",
          coverUrl: "/images/cover-neon.jpg",
          durationLabel: "Voice sample",
          plays: 12980,
        },
        {
          title: "Midnight Cafe — Cozy Host",
          creator: "Mimu",
          description: "Warm, unhurried voice for slice-of-life scenes and gentle chapter intros.",
          category: "ASMR",
          audioUrl: null,
          sampleScript: "Welcome in. The coffee is warm, the rain can wait, and there is always one more seat.",
          coverUrl: "/images/cover-cafe.jpg",
          durationLabel: "Voice sample",
          plays: 9140,
        },
        {
          title: "Dragonfire Battle Call",
          creator: "Dawn Seo",
          description: "Powerful fantasy dubbing sample for action panels and trailers.",
          category: "Dubbing",
          audioUrl: null,
          sampleScript: "Hold the line. The last ember is not finished burning, and neither are we.",
          coverUrl: "/images/cover-ember.jpg",
          durationLabel: "Voice sample",
          plays: 15610,
        },
      ]);

      await tx.insert(socialLinks).values([
        { platform: "Instagram", handle: "@promiseme.com", url: "https://instagram.com/promiseme.com", accent: "#e1306c" },
        { platform: "YouTube", handle: "@promiseme", url: "https://youtube.com/@promiseme", accent: "#ff0033" },
        { platform: "X / Twitter", handle: "@promiseme_com", url: "https://x.com/promiseme_com", accent: "#111827" },
        { platform: "Discord", handle: "promise-me", url: "https://discord.gg/promise-me", accent: "#5865f2" },
        { platform: "TikTok", handle: "@promiseme.com", url: "https://tiktok.com/@promiseme.com", accent: "#00d564" },
      ]);

      const insertedRooms = await tx.insert(chatRooms).values([
        { slug: "general", name: "The Rooftop", description: "Say hello, share what you are reading, and meet other fans.", topic: "General", members: 128400, accent: "#00d564" },
        { slug: "creators", name: "Creator Corner", description: "A friendly room for artists, writers and voice actors.", topic: "Creators", members: 42800, accent: "#8b5cf6" },
        { slug: "chapter-talk", name: "Chapter Talk", description: "Live reactions, theories and episode discussions.", topic: "Episodes", members: 31200, accent: "#f97316" },
        { slug: "voice-studio", name: "Voice Studio", description: "Share voice packs, scripts, casting ideas and feedback.", topic: "Voice", members: 18600, accent: "#38bdf8" },
      ]).returning({ id: chatRooms.id, slug: chatRooms.slug });

      const generalRoom = insertedRooms.find((room) => room.slug === "general");
      const creatorRoom = insertedRooms.find((room) => room.slug === "creators");
      const chapterRoom = insertedRooms.find((room) => room.slug === "chapter-talk");
      if (generalRoom && creatorRoom && chapterRoom) {
        await tx.insert(chatMessages).values([
          { roomId: generalRoom.id, author: "moonlight_99", body: "Just binged Moonlit Promise again. That balcony scene is illegal 😭", createdAt: ago(38) },
          { roomId: generalRoom.id, author: "KiraFan", body: "No verification to post is such a breath of fresh air. Hi everyone!", createdAt: ago(31) },
          { roomId: generalRoom.id, author: "pixelroti", body: "Bro the neon artwork on the home page goes so hard", createdAt: ago(24) },
          { roomId: generalRoom.id, author: "softpanels", body: "Cafe After Midnight is my comfort series ☕🐈", createdAt: ago(16) },
          { roomId: generalRoom.id, author: "Aster", body: "Anyone uploading their own manga today? Would love to read it.", createdAt: ago(7) },
          { roomId: creatorRoom.id, author: "Dawn Seo", body: "Uploaded a fantasy voice sample in Voice Studio — feedback welcome!", createdAt: ago(52) },
          { roomId: creatorRoom.id, author: "Mimu", body: "Working on 4K panels tonight. The uploader kept every detail ✨", createdAt: ago(19) },
          { roomId: chapterRoom.id, author: "theoryfox", body: "Prediction: the moon vow is older than both families.", createdAt: ago(45) },
          { roomId: chapterRoom.id, author: "readersclub", body: "Episode 3 really changed the whole tone, wow.", createdAt: ago(12) },
        ]);
      }

      const insertedThreads = await tx.insert(threads).values([
        { community: "promiseme", title: "Welcome to PromiseMe — introduce yourself, no sign-up needed 👋", body: "This is the official welcome thread. Drop your nickname, your favorite genre, and the story you are currently reading. No account, no email, no OTP — just join the conversation.", author: "promiseme_team", flair: "Announcement", score: 2841, views: 18400, createdAt: ago(1440) },
        { community: "manga-makers", title: "I uploaded my first 4K chapter today and the quality stayed intact!", body: "Usually sites compress the line art, but my high-resolution panels look crisp here. Sharing a few notes on exporting webtoon pages if anyone wants them.", author: "pixelroti", flair: "Chapter Talk", score: 928, views: 6400, createdAt: ago(380) },
        { community: "chapter-talk", title: "Moonlit Promise Ep. 3 — that final panel deserves its own thread", body: "No spoilers in the title, but let's talk about the silver rose and what the prince actually promised. My theory is much sadder than everyone else's.", author: "moonlight_99", flair: "Chapter Talk", score: 1673, views: 11200, createdAt: ago(220) },
        { community: "voice-studio", title: "Made a soft character voice pack for a royal fantasy lead — feedback?", body: "I recorded a calm, low voice for a moonlit prince archetype. Voice Studio now lets you upload audio or record directly in the browser. Would love honest notes.", author: "Dawn Seo", flair: "Voice", score: 612, views: 3900, createdAt: ago(150) },
        { community: "fan-art", title: "Neon Rebellion fan art: rain, magenta lights, and one very determined heroine", body: "Spent the weekend painting this. Cyberpunk reflections are pain but worth it. What palette should I try next?", author: "cyanbrush", flair: "Fan Art", score: 1104, views: 8200, createdAt: ago(96) },
        { community: "promiseme", title: "What section do you want to see next on promiseme.com?", body: "Comics, community, live chat, voice studio and owner links are live. Tell us what would make this place even better for independent creators.", author: "promiseme_team", flair: "Question", score: 447, views: 5100, createdAt: ago(42) },
      ]).returning({ id: threads.id });

      const welcomeThread = insertedThreads[0];
      const moonThread = insertedThreads[2];
      const firstComments = await tx.insert(threadComments).values([
        { threadId: welcomeThread.id, parentId: null, author: "KiraFan", body: "Hi! I'm here for sci-fi, romance, and dramatic panel transitions.", score: 184, createdAt: ago(1300) },
        { threadId: welcomeThread.id, parentId: null, author: "softpanels", body: "Cozy slice-of-life forever. Cafe After Midnight has my whole heart ☕", score: 132, createdAt: ago(900) },
        { threadId: moonThread.id, parentId: null, author: "theoryfox", body: "The rose is silver in every flashback, but gold in the present. That cannot be an accident.", score: 421, createdAt: ago(190) },
        { threadId: moonThread.id, parentId: null, author: "bookishnova", body: "I read it three times and somehow got a different meaning each time.", score: 208, createdAt: ago(120) },
      ]).returning({ id: threadComments.id });

      await tx.insert(threadComments).values([
        { threadId: welcomeThread.id, parentId: firstComments[0].id, author: "promiseme_team", body: "Welcome, KiraFan! Neon Rebellion should be your next stop 🚀", score: 58, createdAt: ago(1250) },
        { threadId: moonThread.id, parentId: firstComments[2].id, author: "moonlight_99", body: "YES. I think the silver one is the original vow and the gold one is a replacement.", score: 176, createdAt: ago(170) },
        { threadId: moonThread.id, parentId: firstComments[2].id, author: "asterreads", body: "Or the color changes when the promise is kept. I'm not ready for either option.", score: 94, createdAt: ago(140) },
      ]);

      await tx.insert(appMeta).values({ key: SEED_KEY, value: new Date().toISOString() });
    });
  } finally {
    await db.execute(sql`select pg_advisory_unlock(${LOCK_ID})`);
  }
}
