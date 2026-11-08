import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, ok } from "@/lib/api";
import { isUploadFolder, parseUploadUrl } from "@/lib/upload-rules";
import { deleteStoredUploadByUrl, findUploadReferences } from "@/lib/uploads";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET: list uploads (metadata only, never binary data). ?refs=<url> returns where an image is used. */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);

    const refsFor = url.searchParams.get("refs");
    if (refsFor) {
      if (!parseUploadUrl(refsFor)) return fail("Invalid image URL.", 400);
      return ok({ references: await findUploadReferences(refsFor) });
    }

    const folder = url.searchParams.get("folder");
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = 48;
    const filter = isUploadFolder(folder) ? { folder } : {};

    await connectDB();
    const [items, total] = await Promise.all([
      StoredUpload.find(filter, "-data").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      StoredUpload.countDocuments(filter),
    ]);
    return ok({
      items: items.map((d) => ({
        id: String(d._id),
        folder: d.folder,
        filename: d.filename,
        originalName: d.originalName,
        mimeType: d.mimeType,
        size: d.size,
        createdAt: d.createdAt,
        url: `/api/uploads/${d.folder}/${d.filename}`,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE ?url=/api/uploads/<folder>/<filename> */
export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const target = new URL(req.url).searchParams.get("url");
    if (!parseUploadUrl(target)) return fail("Invalid image URL.", 400);
    const removed = await deleteStoredUploadByUrl(target);
    if (!removed) return fail("Image not found.", 404);
    revalidatePath("/", "layout");
    return ok({ message: "Image removed successfully." });
  } catch (err) {
    return handleError(err);
  }
}
