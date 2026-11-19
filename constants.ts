export const SITE_NAME = "promiseme.com";

export const GENRES = [
  "All",
  "Romance",
  "Fantasy",
  "Action",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Drama",
  "Comedy",
] as const;

export const FLAIRS = ["Discussion", "Fan Art", "Chapter Talk", "Voice", "Question", "Announcement"] as const;

export const VOICE_CATEGORIES = ["Character", "Narration", "Dubbing", "ASMR", "Soundscape", "Other"] as const;

export const PLATFORMS = [
  { name: "Instagram", prefix: "https://instagram.com/", color: "#e1306c" },
  { name: "YouTube", prefix: "https://youtube.com/", color: "#ff0033" },
  { name: "X / Twitter", prefix: "https://x.com/", color: "#111827" },
  { name: "TikTok", prefix: "https://tiktok.com/@", color: "#00d564" },
  { name: "Discord", prefix: "https://discord.gg/", color: "#5865f2" },
  { name: "Twitch", prefix: "https://twitch.tv/", color: "#9146ff" },
  { name: "Patreon", prefix: "https://patreon.com/", color: "#ff424d" },
  { name: "Website", prefix: "https://", color: "#0f766e" },
] as const;

export const COMMUNITIES = [
  { slug: "promiseme", label: "r/PromiseMe", members: "128K", accent: "#00d564" },
  { slug: "manga-makers", label: "r/MangaMakers", members: "42.8K", accent: "#8b5cf6" },
  { slug: "chapter-talk", label: "r/ChapterTalk", members: "31.2K", accent: "#f97316" },
  { slug: "voice-studio", label: "r/VoiceStudio", members: "18.6K", accent: "#38bdf8" },
  { slug: "fan-art", label: "r/FanArt", members: "57.1K", accent: "#ec4899" },
] as const;

export function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return String(value);
}

export function formatRating(value: number): string {
  return (value / 10).toFixed(1);
}

export function timeAgo(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function avatarColor(name: string): string {
  const colors = ["#00d564", "#8b5cf6", "#f97316", "#38bdf8", "#ec4899", "#facc15", "#2dd4bf", "#fb7185"];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

export function initials(name: string): string {
  return name.trim().slice(0, 2).toUpperCase() || "PM";
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70) || "untitled";
}

export function cleanText(value: FormDataEntryValue | null, max = 5000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function displayName(value: string, fallback = "Guest Creator"): string {
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, 40);
  return cleaned || fallback;
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed.slice(0, 500);
  return `https://${trimmed.replace(/^@/, "")}`.slice(0, 500);
}
