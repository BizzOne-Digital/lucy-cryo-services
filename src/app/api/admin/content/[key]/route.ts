import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { sanitizeContent } from "@/lib/validators";
import { cleanupReplacedImages } from "@/lib/uploads";
import { deepMerge } from "@/lib/data";
import { defaultHomeContent, defaultPagesContent, defaultSettings } from "@/lib/defaults";
import { plain } from "@/lib/utils";
import SiteSettings from "@/models/SiteSettings";
import SiteContent from "@/models/SiteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Editable singleton documents. "settings" lives in SiteSettings, the rest in SiteContent. */
const KEYS = {
  settings: { model: SiteSettings, docKey: "main", defaults: defaultSettings },
  home: { model: SiteContent, docKey: "home", defaults: defaultHomeContent },
  pages: { model: SiteContent, docKey: "pages", defaults: defaultPagesContent },
} as const;

type Ctx = { params: Promise<{ key: string }> };

function cfgFor(key: string) {
  return Object.prototype.hasOwnProperty.call(KEYS, key) ? KEYS[key as keyof typeof KEYS] : null;
}

/** Keeps only keys that exist in the defaults so stray fields cannot be stored. */
function pickKnown(shape: unknown, value: unknown): unknown {
  if (shape && typeof shape === "object" && !Array.isArray(shape)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(shape)) {
      const v = pickKnown((shape as Record<string, unknown>)[k], (value as Record<string, unknown>)[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  if (Array.isArray(shape)) return Array.isArray(value) ? value : undefined;
  if (typeof shape === "string") return typeof value === "string" ? value : undefined;
  if (typeof shape === "boolean") return typeof value === "boolean" ? value : undefined;
  if (typeof shape === "number") return typeof value === "number" ? value : undefined;
  return undefined;
}

export async function GET(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const cfg = cfgFor((await ctx.params).key);
    if (!cfg) return fail("Not found.", 404);
    await connectDB();
    const doc = await cfg.model.findOne({ key: cfg.docKey }).lean();
    return ok({ data: plain(deepMerge(cfg.defaults, doc?.data)) });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const cfg = cfgFor((await ctx.params).key);
    if (!cfg) return fail("Not found.", 404);

    const body = await readJson(req);
    const clean = pickKnown(cfg.defaults, sanitizeContent(body?.data));
    if (!clean) return fail("Invalid content.", 400);

    await connectDB();
    const before = await cfg.model.findOne({ key: cfg.docKey }).lean();
    await cfg.model.updateOne({ key: cfg.docKey }, { $set: { data: clean } }, { upsert: true });

    // Saved successfully – now remove uploads that are no longer used.
    await cleanupReplacedImages(before?.data ?? {}, clean);

    revalidatePath("/", "layout");
    return ok({ data: plain(deepMerge(cfg.defaults, clean)) });
  } catch (err) {
    return handleError(err);
  }
}
