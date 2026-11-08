import { connectDB } from "@/lib/mongodb";
import { fail } from "@/lib/api";
import { isSafeFilename, isUploadFolder } from "@/lib/upload-rules";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await ctx.params;

  // Validate before touching the database; only whitelisted folders and our own filename format are accepted.
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) return fail("Not found.", 404);

  try {
    await connectDB();
    // folder/filename were whitelisted above, so they are safe primitive strings for the query.
    const doc = await StoredUpload.findOne({ folder, filename }).lean();
    if (!doc) return fail("Not found.", 404);

    const raw = doc.data as unknown as { buffer?: ArrayBuffer } | Buffer;
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from((raw as { buffer: ArrayBuffer }).buffer);

    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(buf.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[uploads] read failed", err);
    return fail("Unable to load image.", 500);
  }
}
