import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, isObjectId, ok, readJson } from "@/lib/api";
import { getResource } from "@/lib/resources";
import { cleanupReplacedImages } from "@/lib/uploads";
import { plain } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function resolve(ctx: Ctx) {
  const { resource, id } = await ctx.params;
  const cfg = getResource(resource);
  if (!cfg || !isObjectId(id)) return null;
  return { cfg, id };
}

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const r = await resolve(ctx);
    if (!r) return fail("Not found.", 404);
    await connectDB();
    const doc = await r.cfg.model.findById(r.id).lean();
    if (!doc) return fail("Not found.", 404);
    return ok({ item: plain(doc) });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const r = await resolve(ctx);
    if (!r) return fail("Not found.", 404);
    const { cfg, id } = r;

    await connectDB();
    const existing = (await cfg.model.findById(id).lean()) as Record<string, unknown> | null;
    if (!existing) return fail("Not found.", 404);

    let data = cfg.update.parse(await readJson(req)) as Record<string, unknown>;
    if (cfg.prepare) data = cfg.prepare(data, existing);

    const updated = (await cfg.model
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .lean()) as Record<string, unknown> | null;
    if (!updated) return fail("Not found.", 404);

    // Only after a successful save: remove images that were replaced or cleared.
    if (cfg.imageFields.length) {
      await cleanupReplacedImages(
        cfg.imageFields.map((f) => existing[f]),
        cfg.imageFields.map((f) => updated[f]),
      );
    }

    revalidatePath("/", "layout");
    return ok({ item: plain(updated) });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const r = await resolve(ctx);
    if (!r) return fail("Not found.", 404);
    const { cfg, id } = r;

    await connectDB();
    const doc = (await cfg.model.findByIdAndDelete(id).lean()) as Record<string, unknown> | null;
    if (!doc) return fail("Not found.", 404);

    if (cfg.imageFields.length) {
      await cleanupReplacedImages(cfg.imageFields.map((f) => doc[f]), []);
    }

    revalidatePath("/", "layout");
    return ok({ message: "Deleted." });
  } catch (err) {
    return handleError(err);
  }
}
