import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import AdminUser from "@/models/AdminUser";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(200),
});

// Used to keep response timing similar when the email does not exist.
let dummyHash: string | null = null;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync("timing-safe-placeholder", 12));

export async function POST(req: Request) {
  try {
    if (!rateLimit(`login:${clientIp(req)}`, 8, 15 * 60 * 1000)) {
      return fail("Too many login attempts. Please wait 15 minutes and try again.", 429);
    }
    const { email, password } = schema.parse(await readJson(req));
    await connectDB();

    let user = await AdminUser.findOne({ email }).select("+passwordHash");

    // Bootstrap: first login with ADMIN_EMAIL / ADMIN_PASSWORD_HASH creates the admin record.
    if (!user) {
      const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();
      if (envEmail && envHash && envEmail === email && (await bcrypt.compare(password, envHash))) {
        user = await AdminUser.create({ email, passwordHash: envHash, name: "Lucy CRYO Admin" });
        user = await AdminUser.findById(user._id).select("+passwordHash");
      } else {
        await bcrypt.compare(password, getDummyHash());
        return fail("Invalid email or password.", 401);
      }
    }

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return fail("Invalid email or password.", 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = await createSessionToken({ sub: String(user._id), email: user.email, name: user.name ?? undefined });
    await setSessionCookie(token);
    return ok({ message: "Signed in." });
  } catch (err) {
    return handleError(err);
  }
}
