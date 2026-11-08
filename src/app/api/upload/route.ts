import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, ok } from "@/lib/api";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES, UPLOAD_MESSAGES, isUploadFolder } from "@/lib/upload-rules";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Checks the file's magic bytes so a renamed non-image cannot be stored. */
function sniffMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  const gif = buf.subarray(0, 6).toString("ascii");
  if (gif === "GIF87a" || gif === "GIF89a") return "image/gif";
  return null;
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const declared = Number(req.headers.get("content-length") || 0);
    if (declared > MAX_UPLOAD_BYTES + 512 * 1024) return fail(UPLOAD_MESSAGES.size, 413);

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return fail("Invalid upload request.", 400);
    }

    const folder = form.get("folder");
    if (!isUploadFolder(folder)) return fail("Invalid upload folder.", 400);

    const file = form.get("file");
    if (!file || typeof file === "string") return fail("No file was provided.", 400);

    if (!ALLOWED_MIME[file.type]) return fail(UPLOAD_MESSAGES.type, 400);
    if (file.size <= 0) return fail("The selected file is empty.", 400);
    if (file.size > MAX_UPLOAD_BYTES) return fail(UPLOAD_MESSAGES.size, 413);

    const buffer = Buffer.from(await file.arrayBuffer());
    const realMime = sniffMime(buffer);
    if (!realMime || !ALLOWED_MIME[realMime]) return fail(UPLOAD_MESSAGES.type, 400);

    const ext = ALLOWED_MIME[realMime];
    const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      originalName: (file.name || "").slice(0, 200),
      mimeType: realMime,
      size: buffer.length,
      data: buffer,
    });

    revalidatePath("/admin/uploads");

    return ok({ url: `/api/uploads/${folder}/${filename}`, filename, size: buffer.length, folder }, 201);
  } catch (err) {
    return handleError(err);
  }
}
