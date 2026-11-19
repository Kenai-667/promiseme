import {
  boolean,
  customType,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const appMeta = pgTable("app_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const comics = pgTable("comics", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  creator: text("creator").notNull(),
  genre: text("genre").notNull(),
  tags: text("tags").notNull().default(""),
  description: text("description").notNull(),
  coverUrl: text("cover_url").notNull(),
  bannerUrl: text("banner_url").notNull().default(""),
  accent: text("accent").notNull().default("#00d564"),
  status: text("status").notNull().default("Ongoing"),
  updateDay: text("update_day").notNull().default("NEW"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  rating: integer("rating").notNull().default(98),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  comicId: integer("comic_id").notNull().references(() => comics.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const voices = pgTable("voices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  creator: text("creator").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("Character"),
  audioUrl: text("audio_url"),
  sampleScript: text("sample_script"),
  coverUrl: text("cover_url").notNull().default("/images/cover-moonlit.jpg"),
  durationLabel: text("duration_label").notNull().default("Sample"),
  plays: integer("plays").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  url: text("url").notNull(),
  accent: text("accent").notNull().default("#00d564"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteProfile = pgTable("site_profile", {
  id: integer("id").primaryKey().default(1),
  ownerName: text("owner_name").notNull().default("The PromiseMe Team"),
  tagline: text("tagline").notNull().default("Stories worth promising your time to."),
  aboutText: text("about_text").notNull().default("PromiseMe is an open home for manga makers, voice artists and readers. Upload your own high-resolution chapters, share character voices, and talk with the community — no account, no email, no verification."),
  contactEmail: text("contact_email").notNull().default("hello@promiseme.com"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  topic: text("topic").notNull().default("General"),
  members: integer("members").notNull().default(0),
  accent: text("accent").notNull().default("#00d564"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => chatRooms.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  community: text("community").notNull().default("promiseme"),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  author: text("author").notNull(),
  flair: text("flair").notNull().default("Discussion"),
  score: integer("score").notNull().default(1),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const threadComments = pgTable("thread_comments", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull().references(() => threads.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"),
  author: text("author").notNull(),
  body: text("body").notNull(),
  score: integer("score").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Comic = typeof comics.$inferSelect;
export type Episode = typeof episodes.$inferSelect;
export type PageImage = typeof pages.$inferSelect;
export type Voice = typeof voices.$inferSelect;
export type SocialLink = typeof socialLinks.$inferSelect;
export type SiteProfile = typeof siteProfile.$inferSelect;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Thread = typeof threads.$inferSelect;
export type ThreadComment = typeof threadComments.$inferSelect;
