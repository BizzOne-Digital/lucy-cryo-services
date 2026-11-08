"use client";

import { useState } from "react";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { FormField } from "./FormField";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Please enter a valid email address.";
    if (form.phone && !/^[0-9+().\-\s]{7,}$/.test(form.phone.trim())) e.phone = "Please enter a valid phone number.";
    if (form.message.trim().length < 10) e.message = "Please write a short message (10+ characters).";
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Unable to send your message.");
      setStatus("done");
    } catch (err) {
      setServerError((err as Error).message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-line" role="status">
        <CircleCheck size={52} strokeWidth={1.3} className="mx-auto text-teal" aria-hidden />
        <h2 className="heading-serif mt-4 text-4xl">Message sent</h2>
        <p className="mt-3 text-lg text-muted">Thank you for reaching out. We will reply as soon as possible.</p>
      </div>
    );
  }

  const inv = (k: string) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-line sm:p-10">
      <h2 className="font-serif text-3xl font-semibold text-navy">Send us a message</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField id="c-name" label="Name" required error={errors.name}>
          <input id="c-name" className="field-input" autoComplete="name" value={form.name} onChange={set("name")} {...inv("name")} aria-describedby={errors.name ? "c-name-error" : undefined} />
        </FormField>
        <FormField id="c-email" label="Email" required error={errors.email}>
          <input id="c-email" type="email" className="field-input" autoComplete="email" value={form.email} onChange={set("email")} {...inv("email")} aria-describedby={errors.email ? "c-email-error" : undefined} />
        </FormField>
        <FormField id="c-phone" label="Phone" error={errors.phone} className="sm:col-span-2">
          <input id="c-phone" type="tel" className="field-input" autoComplete="tel" value={form.phone} onChange={set("phone")} {...inv("phone")} aria-describedby={errors.phone ? "c-phone-error" : undefined} />
        </FormField>
        <FormField id="c-message" label="Message" required error={errors.message} className="sm:col-span-2">
          <textarea id="c-message" rows={5} maxLength={3000} className="field-input resize-y" value={form.message} onChange={set("message")} {...inv("message")} aria-describedby={errors.message ? "c-message-error" : undefined} />
        </FormField>
        <div className="hidden" aria-hidden>
          <label htmlFor="c-website">Website</label>
          <input id="c-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
        </div>
      </div>
      {serverError && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" className="btn-primary mt-7 w-full sm:w-auto sm:px-10" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <LoaderCircle size={18} className="animate-spin" aria-hidden /> Sending...
          </>
        ) : (
          <>
            <Send size={17} aria-hidden /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
