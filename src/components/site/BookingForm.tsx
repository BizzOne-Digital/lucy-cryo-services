"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { FormField } from "./FormField";

type ServiceOption = { _id: string; title: string };

const TIMES = ["Morning (9am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)", "Flexible"];
const SOURCES = ["Google search", "Facebook", "Instagram", "Friend or family referral", "Returning client", "Other"];

type Errors = Partial<Record<string, string>>;

export function BookingForm({ services, initialServiceId }: { services: ServiceOption[]; initialServiceId?: string }) {
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: services.some((s) => s._id === initialServiceId) ? initialServiceId! : "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    source: "",
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Please enter a valid email address.";
    if (!/^[0-9+().\-\s]{7,}$/.test(form.phone.trim())) e.phone = "Please enter a valid phone number.";
    if (!form.serviceId) e.serviceId = "Please choose a service.";
    if (!form.preferredDate) e.preferredDate = "Please choose a preferred date.";
    else if (form.preferredDate < minDate) e.preferredDate = "Please choose a future date.";
    if (!form.preferredTime) e.preferredTime = "Please choose a preferred time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("sending");
    try {
      const svc = services.find((s) => s._id === form.serviceId);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceId: form.serviceId === "not-sure" ? "" : form.serviceId,
          serviceName: svc?.title || "Not sure – please advise",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Unable to submit your request.");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError((err as Error).message || "Unable to submit your request. Please try again or call us.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-line sm:p-12" role="status">
        <CircleCheck size={56} strokeWidth={1.3} className="mx-auto text-teal" aria-hidden />
        <h2 className="heading-serif mt-5 text-4xl">Thank you, {form.name.split(" ")[0]}.</h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-muted">
          Your consultation request has been received. We will contact you shortly to confirm your appointment.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/services" className="btn-outline">
            Explore Services
          </Link>
          <Link href="/" className="btn-primary">
            Back to Home <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const invalid = (k: string) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-line sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="name" label="Full Name" required error={errors.name} className="sm:col-span-2">
          <input id="name" className="field-input" autoComplete="name" value={form.name} onChange={set("name")} {...invalid("name")} />
        </FormField>
        <FormField id="email" label="Email" required error={errors.email}>
          <input id="email" type="email" className="field-input" autoComplete="email" inputMode="email" value={form.email} onChange={set("email")} {...invalid("email")} />
        </FormField>
        <FormField id="phone" label="Phone" required error={errors.phone}>
          <input id="phone" type="tel" className="field-input" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} {...invalid("phone")} />
        </FormField>
        <FormField id="serviceId" label="Service" required error={errors.serviceId} className="sm:col-span-2">
          <select id="serviceId" className="field-input" value={form.serviceId} onChange={set("serviceId")} {...invalid("serviceId")}>
            <option value="">Select a treatment</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
            <option value="not-sure">Not sure – I would like advice</option>
          </select>
        </FormField>
        <FormField id="preferredDate" label="Preferred Date" required error={errors.preferredDate}>
          <input id="preferredDate" type="date" min={minDate} className="field-input" value={form.preferredDate} onChange={set("preferredDate")} {...invalid("preferredDate")} />
        </FormField>
        <FormField id="preferredTime" label="Preferred Time" required error={errors.preferredTime}>
          <select id="preferredTime" className="field-input" value={form.preferredTime} onChange={set("preferredTime")} {...invalid("preferredTime")}>
            <option value="">Select a time</option>
            {TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </FormField>
        <FormField id="message" label="Message / Treatment Goals" className="sm:col-span-2" hint="Tell us what you would like to achieve or any questions you have.">
          <textarea id="message" rows={4} maxLength={3000} className="field-input resize-y" value={form.message} onChange={set("message")} />
        </FormField>
        <FormField id="source" label="How did you hear about us?" className="sm:col-span-2">
          <select id="source" className="field-input" value={form.source} onChange={set("source")}>
            <option value="">Select an option</option>
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </FormField>
        {/* Honeypot for bots */}
        <div className="hidden" aria-hidden>
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
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
            Request My Consultation <ArrowRight size={18} aria-hidden />
          </>
        )}
      </button>
      <p className="mt-4 text-sm text-muted">No payment is required to request a consultation.</p>
    </form>
  );
}
