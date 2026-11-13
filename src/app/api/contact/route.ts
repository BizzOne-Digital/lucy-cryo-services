import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { contactInput } from "@/lib/validators";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyNewSubmission } from "@/lib/notifications";
import ContactInquiry from "@/models/ContactInquiry";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`contact:${clientIp(req)}`, 5)) {
      return fail("Too many requests. Please try again later or call us directly.", 429);
    }
    const input = contactInput.parse(await readJson(req));
    if (input.website) return ok({ message: "Thank you." });

    await connectDB();
    const doc = await ContactInquiry.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    });
    await notifyNewSubmission("inquiry", {
      id: String(doc._id),
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    });
    revalidatePath("/admin", "layout");

    return ok({ message: "Thank you. Your message has been sent." }, 201);
  } catch (err) {
    return handleError(err);
  }
}
