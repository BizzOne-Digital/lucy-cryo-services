import "server-only";

/**
 * Notification hook for new bookings and enquiries.
 * Currently logs only. To enable email, plug a provider (e.g. Resend, SendGrid, Postmark) in here
 * and add its API key as a server-only environment variable. Failures must never block the form submission.
 */
export async function notifyNewSubmission(kind: "booking" | "inquiry", summary: { id: string; name: string; service?: string }) {
  try {
    console.info(`[notify] new ${kind}`, { id: summary.id, service: summary.service });
  } catch {
    /* never throw */
  }
}
