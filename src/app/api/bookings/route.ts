import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { fail, handleError, isObjectId, ok, readJson } from "@/lib/api";
import { bookingInput } from "@/lib/validators";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { notifyNewSubmission } from "@/lib/notifications";
import Booking from "@/models/Booking";
import Service from "@/models/Service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!rateLimit(`booking:${clientIp(req)}`, 5)) {
      return fail("Too many requests. Please try again later or call us directly.", 429);
    }
    const input = bookingInput.parse(await readJson(req));
    if (input.website) return ok({ message: "Thank you." }); // honeypot: silently accept bots

    await connectDB();

    // Trust the service from the database, not the client-supplied name.
    let serviceId: string | undefined;
    let serviceName = input.serviceName;
    if (input.serviceId && isObjectId(input.serviceId)) {
      const svc = await Service.findOne({ _id: input.serviceId, active: true }, "title").lean();
      if (svc) {
        serviceId = String(svc._id);
        serviceName = svc.title;
      }
    }

    const booking = await Booking.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      serviceId,
      serviceName,
      preferredDate: new Date(`${input.preferredDate}T12:00:00Z`),
      preferredTime: input.preferredTime,
      message: input.message,
      source: input.source,
      status: "pending",
    });

    await notifyNewSubmission("booking", { id: String(booking._id), name: booking.name, service: serviceName });
    revalidatePath("/admin", "layout");

    return ok({ message: "Your consultation request has been received.", id: String(booking._id) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
