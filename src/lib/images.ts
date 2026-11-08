export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/** Legacy /uploads/* paths cannot exist on a read-only serverless filesystem, so show a placeholder instead. */
export function resolveImageUrl(url?: string | null) {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith("/uploads/")) return PLACEHOLDER_IMAGE;
  return url;
}

export function unsplash(id: string, w = 1400) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}
