export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(
  d?: string | Date | null,
  opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" },
) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-CA", { ...opts, timeZone: "UTC" });
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lucycryoservices.org").replace(/\/$/, "");

export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

/** Serialises Mongo documents (ObjectId, Date) into plain JSON-safe objects for client components. */
export function plain<T>(v: unknown): T {
  return JSON.parse(JSON.stringify(v)) as T;
}
