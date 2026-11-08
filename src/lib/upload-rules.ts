// Shared by client and server so validation is identical on both sides.
export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const UPLOAD_MESSAGES = {
  type: "Only JPEG, PNG, WEBP and GIF files are allowed.",
  size: "Maximum image size is 8MB.",
  generic: "Unable to upload image. Please try again.",
  success: "Image uploaded successfully.",
  removed: "Image removed successfully.",
};

export function isUploadFolder(v: unknown): v is UploadFolder {
  return typeof v === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(v);
}

const FILENAME_RE = /^\d{10,16}-[a-f0-9]{8,32}\.(jpg|png|webp|gif)$/;

export function isSafeFilename(v: unknown): v is string {
  if (typeof v !== "string" || v.length > 80) return false;
  if (v.includes("..") || v.includes("/") || v.includes("\\")) return false;
  return FILENAME_RE.test(v);
}

/** Parses "/api/uploads/<folder>/<filename>" into validated parts, or returns null. */
export function parseUploadUrl(url?: string | null): { folder: UploadFolder; filename: string } | null {
  if (!url || typeof url !== "string" || !url.startsWith("/api/uploads/")) return null;
  const parts = url.split("?")[0].slice("/api/uploads/".length).split("/");
  if (parts.length !== 2) return null;
  const [folder, filename] = parts;
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) return null;
  return { folder, filename };
}
