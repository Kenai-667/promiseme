import { db } from "@/db";
import { comics, episodes, pages } from "@/db/schema";
import { cleanText, displayName, GENRES, slugify } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { getUploads, isUpload, saveAsset } from "@/lib/storage";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 60;

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const form = await request.formData();
    const mode = cleanText(form.get("mode"), 20);
    const pageFiles = getUploads(form, "pages").slice(0, 20);
    if (!pageFiles.length) return errorResponse("Add at least one episode panel image.");
    if (pageFiles.length > 20) return errorResponse("A single episode can contain up to 20 panels.");

    // Original bytes are stored in PostgreSQL; the reader references the saved asset URLs.
    const pageUrls: string[] = [];
    for (const file of pageFiles) {
      const saved = await saveAsset(file, "image");
      pageUrls.push(saved.url);
    }

    const episodeTitle = displayName(cleanText(form.get("episodeTitle"), 120), "Untitled Episode");

    if (mode === "episode") {
      const comicId = Number(cleanText(form.get("comicId"), 20));
      if (!Number.isInteger(comicId) || comicId < 1) return errorResponse("Choose a valid series.");
      const [comic] = await db.select().from(comics).where(eq(comics.id, comicId)).limit(1);
      if (!comic) return errorResponse("That series no longer exists.", 404);

      const latest = await db
        .select({ number: episodes.episodeNumber })
        .from(episodes)
        .where(eq(episodes.comicId, comicId))
        .orderBy(desc(episodes.episodeNumber))
        .limit(1);

      const result = await db.transaction(async (tx) => {
        const [createdEpisode] = await tx.insert(episodes).values({
          comicId,
          episodeNumber: (latest[0]?.number ?? 0) + 1,
          title: episodeTitle,
          thumbnailUrl: comic.coverUrl,
        }).returning({ id: episodes.id });
        await tx.insert(pages).values(pageUrls.map((url, index) => ({ episodeId: createdEpisode.id, position: index + 1, imageUrl: url })));
        return { comicId, episodeId: createdEpisode.id };
      });
      return Response.json({ ok: true, ...result });
    }

    const coverFile = isUpload(form.get("cover")) ? (form.get("cover") as File) : null;
    if (!coverFile) return errorResponse("A cover image is required for a new series.");
    const coverUrl = (await saveAsset(coverFile, "image")).url;
    const bannerFile = isUpload(form.get("banner")) ? (form.get("banner") as File) : null;
    const bannerUrl = bannerFile ? (await saveAsset(bannerFile, "image")).url : coverUrl;

    const title = displayName(cleanText(form.get("title"), 100), "Untitled Story");
    const creator = displayName(cleanText(form.get("creator"), 60), "Guest Creator");
    const description = cleanText(form.get("description"), 2000) || "A new independent story on PromiseMe.";
    const genreInput = cleanText(form.get("genre"), 40);
    const genre = GENRES.includes(genreInput as (typeof GENRES)[number]) ? genreInput : "Other";
    const tags = cleanText(form.get("tags"), 160);
    const accentInput = cleanText(form.get("accent"), 10);
    const accent = /^#[0-9a-fA-F]{6}$/.test(accentInput) ? accentInput : "#00d564";

    const result = await db.transaction(async (tx) => {
      const [createdComic] = await tx.insert(comics).values({
        slug: `${slugify(title)}-${Date.now().toString(36)}`,
        title,
        creator,
        genre,
        tags,
        description,
        coverUrl,
        bannerUrl,
        accent,
        status: "Ongoing",
        updateDay: "NEW",
        views: 0,
        likes: 0,
        rating: 98,
        featured: false,
      }).returning({ id: comics.id });

      const [createdEpisode] = await tx.insert(episodes).values({
        comicId: createdComic.id,
        episodeNumber: 1,
        title: episodeTitle,
        thumbnailUrl: coverUrl,
      }).returning({ id: episodes.id });

      await tx.insert(pages).values(pageUrls.map((url, index) => ({ episodeId: createdEpisode.id, position: index + 1, imageUrl: url })));
      return { comicId: createdComic.id, episodeId: createdEpisode.id };
    });

    return Response.json({ ok: true, ...result });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Upload failed. Please try again.");
  }
}
