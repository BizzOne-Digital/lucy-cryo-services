import "server-only";
import { connectDB, isDbConfigured } from "./mongodb";
import {
  defaultHomeContent,
  defaultPagesContent,
  defaultSettings,
  LEGACY_IMAGE_PREFIX,
  seedBlogs,
  seedPromotions,
  seedServices,
  type HomeContent,
  type PagesContent,
  type SiteSettings,
} from "./defaults";
import { plain } from "./utils";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Promotion from "@/models/Promotion";
import GalleryItem from "@/models/GalleryItem";
import SiteSettingsModel from "@/models/SiteSettings";
import SiteContent from "@/models/SiteContent";

/* ---------------------------------- types --------------------------------- */

export type ServiceItem = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt?: string;
  icon?: string;
  featured: boolean;
  active: boolean;
  order: number;
};

export type BlogItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
  category: string;
  published: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PromotionItem = {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
  active: boolean;
  order: number;
};

export type GalleryEntry = { _id: string; title: string; alt: string; image: string; visible: boolean; order: number };

/* --------------------------------- helpers -------------------------------- */

type AnyObj = Record<string, unknown>;

/** Deep-merges saved values over defaults so new fields always have a value. Arrays are replaced. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base;
  const out: AnyObj = { ...(base as AnyObj) };
  for (const [k, v] of Object.entries(override as AnyObj)) {
    const b = (base as AnyObj)[k];
    if (v === undefined || v === null) continue;
    if (b && typeof b === "object" && !Array.isArray(b) && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge(b, v);
    } else if (typeof b === "string" && typeof v === "string" && v.trim() === "" && !isImageKey(k)) {
      // Empty text keeps the polished default so sections never render blank.
      out[k] = b;
    } else {
      out[k] = v;
    }
  }
  return out as T;
}
const isImageKey = (k: string) => /image|logo/i.test(k);

const g = globalThis as unknown as { __lcSeeded?: Promise<void> };

/** Seeds starter services, blogs and promotions once. A marker prevents re-seeding after the admin deletes items. */
async function ensureSeeded() {
  if (!g.__lcSeeded) {
    g.__lcSeeded = (async () => {
      await connectDB();
      const marker = await SiteContent.findOne({ key: "_seed" }).lean();
      if (marker) {
        if (!(marker.data as { brandImages?: boolean })?.brandImages) await applyBrandImages();
        return;
      }
      const [s, b, p] = await Promise.all([
        Service.countDocuments(),
        BlogPost.countDocuments(),
        Promotion.countDocuments(),
      ]);
      if (!s) await Service.insertMany(seedServices);
      if (!b) await BlogPost.insertMany(seedBlogs);
      if (!p) await Promotion.insertMany(seedPromotions);
      await SiteContent.updateOne(
        { key: "_seed" },
        { $set: { data: { seededAt: new Date().toISOString(), brandImages: true } } },
        { upsert: true },
      );
    })().catch((e) => {
      g.__lcSeeded = undefined;
      throw e;
    });
  }
  return g.__lcSeeded;
}

/**
 * One-time migration: records seeded before the client's brand images existed still point at stock photos.
 * Swap only those stock URLs for the matching brand image – anything the admin uploaded is left untouched.
 */
async function applyBrandImages() {
  const isStock = { $regex: `^${LEGACY_IMAGE_PREFIX.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}` };
  await Promise.all([
    ...seedServices.map((s) =>
      Service.updateOne({ slug: s.slug, image: isStock }, { $set: { image: s.image, imageAlt: s.imageAlt } }),
    ),
    ...seedBlogs.map((b) =>
      BlogPost.updateOne({ slug: b.slug, featuredImage: isStock }, { $set: { featuredImage: b.featuredImage, featuredImageAlt: b.featuredImageAlt } }),
    ),
    ...seedPromotions.map((p) => Promotion.updateOne({ title: p.title, image: isStock }, { $set: { image: p.image } })),
  ]);
  await SiteContent.updateOne({ key: "_seed" }, { $set: { "data.brandImages": true } });
}

/** Runs a DB query; returns fallback content if MongoDB is missing or unreachable so pages never break. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    await ensureSeeded();
    return await fn();
  } catch (err) {
    console.error("[data] falling back to default content:", (err as Error).message);
    return fallback;
  }
}

const fallbackServices: ServiceItem[] = seedServices.map((s) => ({ ...s, _id: s.slug }));
const fallbackBlogs: BlogItem[] = seedBlogs.map((b) => ({ ...b, _id: b.slug, publishedAt: b.publishedAt.toISOString() }));
const fallbackPromos: PromotionItem[] = seedPromotions.map((p, i) => ({ ...p, _id: `promo-${i}` }));

/* --------------------------------- settings ------------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  return safe(async () => {
    const doc = await SiteSettingsModel.findOne({ key: "main" }).lean();
    return deepMerge(defaultSettings, doc?.data);
  }, defaultSettings);
}

export async function getHomeContent(): Promise<HomeContent> {
  return safe(async () => {
    const doc = await SiteContent.findOne({ key: "home" }).lean();
    return deepMerge(defaultHomeContent, doc?.data);
  }, defaultHomeContent);
}

export async function getPagesContent(): Promise<PagesContent> {
  return safe(async () => {
    const doc = await SiteContent.findOne({ key: "pages" }).lean();
    return deepMerge(defaultPagesContent, doc?.data);
  }, defaultPagesContent);
}

/* --------------------------------- services ------------------------------- */

export async function getServices(): Promise<ServiceItem[]> {
  return safe(async () => {
    const docs = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
    return plain<ServiceItem[]>(docs);
  }, fallbackServices);
}

export async function getFeaturedServices(limit = 3): Promise<ServiceItem[]> {
  const all = await getServices();
  const featured = all.filter((s) => s.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

/* ---------------------------------- blogs --------------------------------- */

export async function getBlogs(page = 1, limit = 9): Promise<{ items: BlogItem[]; total: number }> {
  const skip = (Math.max(1, page) - 1) * limit;
  return safe(
    async () => {
      const filter = { published: true };
      const [docs, total] = await Promise.all([
        BlogPost.find(filter, "-content").sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
        BlogPost.countDocuments(filter),
      ]);
      return { items: plain<BlogItem[]>(docs), total };
    },
    { items: fallbackBlogs.slice(skip, skip + limit), total: fallbackBlogs.length },
  );
}

export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return null;
  return safe(
    async () => {
      const doc = await BlogPost.findOne({ slug, published: true }).lean();
      return doc ? plain<BlogItem>(doc) : null;
    },
    fallbackBlogs.find((b) => b.slug === slug) ?? null,
  );
}

export async function getRelatedBlogs(post: BlogItem, limit = 3): Promise<BlogItem[]> {
  return safe(
    async () => {
      const same = await BlogPost.find({ published: true, slug: { $ne: post.slug }, category: post.category }, "-content")
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
      let docs = same;
      if (docs.length < limit) {
        const more = await BlogPost.find(
          { published: true, slug: { $nin: [post.slug, ...docs.map((d) => d.slug)] } },
          "-content",
        )
          .sort({ publishedAt: -1 })
          .limit(limit - docs.length)
          .lean();
        docs = [...docs, ...more];
      }
      return plain<BlogItem[]>(docs);
    },
    fallbackBlogs.filter((b) => b.slug !== post.slug).slice(0, limit),
  );
}

export async function getAllBlogSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  return safe(
    async () => plain(await BlogPost.find({ published: true }, "slug updatedAt").lean()),
    fallbackBlogs.map((b) => ({ slug: b.slug })),
  );
}

/* ------------------------------- promotions ------------------------------- */

export async function getPromotions(): Promise<PromotionItem[]> {
  return safe(async () => {
    const docs = await Promotion.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
    return plain<PromotionItem[]>(docs);
  }, fallbackPromos);
}

/* --------------------------------- gallery -------------------------------- */

export async function getGallery(): Promise<GalleryEntry[]> {
  return safe(async () => {
    const docs = await GalleryItem.find({ visible: true }).sort({ order: 1, createdAt: -1 }).limit(12).lean();
    return plain<GalleryEntry[]>(docs);
  }, []);
}
