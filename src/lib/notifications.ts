import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Emails the business owner when a booking or contact enquiry is submitted.
 * Uses SMTP (e.g. the business mailbox with an app password). If SMTP is not configured,
 * it only logs. Failures never block the form submission.
 *
 * Env: SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER, SMTP_PASS, NOTIFY_EMAIL (defaults to SMTP_USER)
 */
export type SubmissionDetails = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
};

let transporter: Transporter | null = null;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    const port = Number(SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s = "") => s.replace(/[\r\n]+/g, " ").slice(0, 120);

export async function notifyNewSubmission(kind: "booking" | "inquiry", d: SubmissionDetails) {
  try {
    const t = getTransporter();
    if (!t) {
      console.info(`[notify] new ${kind} (email not configured)`, { id: d.id });
      return;
    }
    const label = kind === "booking" ? "New Booking Request" : "New Contact Enquiry";
    const rows: [string, string | undefined][] = [
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Service", d.service],
      ["Preferred date", d.preferredDate],
      ["Preferred time", d.preferredTime],
      ["Message", d.message],
    ];
    const filled = rows.filter(([, v]) => v);
    const text = `${label}\n\n${filled.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nView it in your admin panel.`;
    const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0f2a44">
<h2 style="margin:0 0 16px">${label}</h2>
<table cellpadding="6" style="border-collapse:collapse">${filled
      .map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top">${k}</td><td style="white-space:pre-line">${esc(v)}</td></tr>`)
      .join("")}</table>
<p style="margin-top:20px;color:#5b6b7b">Reply to this email to respond to ${esc(d.name)} directly. All requests are also saved in your admin panel.</p></div>`;

    await t.sendMail({
      from: `"Lucy CRYO Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      replyTo: { name: oneLine(d.name), address: d.email },
      subject: `${label}: ${oneLine(d.name)}${d.service ? " – " + oneLine(d.service) : ""}`,
      text,
      html,
    });
  } catch (err) {
    console.error(`[notify] email failed for ${kind}`, err instanceof Error ? err.message : err);
  }
}
