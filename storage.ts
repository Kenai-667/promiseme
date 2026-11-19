import { db } from "@/db";
import { assets } from "@/db/schema";

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_AUDIO_BYTES = 30 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export function isUpload(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value !== "string" &&
      typeof (value as File).arrayBuffer === "function" &&
      (value as File).size > 0,
  );
}

export function getUploads(form: FormData, key: string): File[] {
  return form.getAll(key).filter((value): value is File => isUpload(value));
}

function typeFromName(name: string, fallback: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    webm: "audio/webm",
  };
  return map[ext ?? ""] ?? fallback;
}

export async function saveAsset(file: File, kind: "image" | "audio") {
  const max = kind === "image" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  if (file.size > max) {
    throw new Error(`${kind === "image" ? "Image" : "Audio"} must be under ${Math.round(max / 1024 / 1024)} MB.`);
  }

  const contentType = (file.type || typeFromName(file.name, kind === "image" ? "image/jpeg" : "audio/webm")).toLowerCase();
  const accepted = kind === "image" ? IMAGE_TYPES.has(contentType) : contentType.startsWith("audio/") || contentType === "application/ogg";
  if (!accepted) {
    throw new Error(`Unsupported ${kind} file type: ${contentType || "unknown"}.`);
  }

  const data = Buffer.from(await file.arrayBuffer());
  const [created] = await db
    .insert(assets)
    .values({
      name: (file.name || `upload.${kind}`).slice(0, 255),
      contentType,
      size: data.byteLength,
      data,
    })
    .returning({ id: assets.id });

  if (!created) throw new Error("Could not save the uploaded file.");
  return { id: created.id, url: `/api/assets/${created.id}` };
}
