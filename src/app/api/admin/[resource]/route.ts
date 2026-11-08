import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { getResource } from "@/lib/resources";
import { escapeRegex, plain } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { resource } = await ctx.params;
    const cfg = getResource(resource);
    if (!cfg) return fail("Not found.", 404);

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
    const status = (url.searchParams.get("status") || "").trim();
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 50));

    const filter: Record<string, unknown> = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = cfg.search.map((f) => ({ [f]: rx }));
    }
    if (status && cfg.statusField && /^[a-z]{1,20}$/.test(status)) filter[cfg.statusField] = status;

    await connectDB();
    const [items, total] = await Promise.all([
      cfg.model.find(filter).sort(cfg.sort).skip((page - 1) * limit).limit(limit).lean(),
      cfg.model.countDocuments(filter),
    ]);
    return ok({ items: plain(items), total, page, limit });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { resource } = await ctx.params;
    const cfg = getResource(resource);
    if (!cfg || !cfg.create) return fail("Not found.", 404);

    let data = cfg.create.parse(await readJson(req)) as Record<string, unknown>;
    if (cfg.prepare) data = cfg.prepare(data, null);

    await connectDB();
    const doc = await cfg.model.create(data);
    revalidatePath("/", "layout");
    return ok({ item: plain(doc.toObject()) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
