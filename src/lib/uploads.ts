import "server-only";
import { connectDB } from "./mongodb";
import { parseUploadUrl } from "./upload-rules";
import StoredUpload from "@/models/StoredUpload";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Promotion from "@/models/Promotion";
import GalleryItem from "@/models/GalleryItem";
import SiteSettings from "@/models/SiteSettings";
import SiteContent from "@/models/SiteContent";

/** Returns human-readable places where an uploaded image URL is still used. */
export async function findUploadReferences(url: string): Promise<string[]> {
  await connectDB();
  const refs: string[] = [];
  const [services, blogs, promos, gallery, settings, contents] = await Promise.all([
    Service.find({ image: url }, "title").lean(),
    BlogPost.find({ featuredImage: url }, "title").lean(),
    Promotion.find({ image: url }, "title").lean(),
    GalleryItem.find({ image: url }, "title").lean(),
    SiteSettings.find({}).lean(),
    SiteContent.find({}).lean(),
  ]);
  services.forEach((s) => refs.push(`Service: ${s.title}`));
  blogs.forEach((b) => refs.push(`Blog: ${b.title}`));
  promos.forEach((p) => refs.push(`Promotion: ${p.title}`));
  gallery.forEach((g) => refs.push(`Gallery: ${g.title || "Untitled"}`));
  settings.forEach((s) => JSON.stringify(s.data).includes(url) && refs.push("Site settings"));
  contents.forEach((c) => JSON.stringify(c.data).includes(url) && refs.push(`Website content (${c.key})`));
  return refs;
}

/** Deletes a MongoDB-stored upload from its public URL. Ignores external and legacy URLs. */
export async function deleteStoredUploadByUrl(url?: string | null, opts: { onlyIfUnreferenced?: boolean } = {}) {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  await connectDB();
  if (opts.onlyIfUnreferenced) {
    const refs = await findUploadReferences(url!);
    if (refs.length) return false;
  }
  const res = await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
  return res.deletedCount > 0;
}

/** Collects every /api/uploads/ URL inside any value (used for nested content documents). */
export function collectUploadUrls(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    if (value.startsWith("/api/uploads/")) out.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectUploadUrls(v, out));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectUploadUrls(v, out));
  }
  return out;
}

/**
 * Call only AFTER the parent document has been saved successfully.
 * Removes images that were replaced or cleared, provided nothing else still references them.
 */
export async function cleanupReplacedImages(before: unknown, after: unknown) {
  const keep = new Set(collectUploadUrls(after));
  const stale = [...new Set(collectUploadUrls(before))].filter((u) => !keep.has(u));
  await Promise.all(stale.map((u) => deleteStoredUploadByUrl(u, { onlyIfUnreferenced: true }).catch(() => false)));
}
