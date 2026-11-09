import type { Metadata } from "next";
import { CalendarCheck, Clock, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/site/BookingForm";
import { PageHero } from "@/components/site/PageHero";
import { getPagesContent, getServices, getSettings } from "@/lib/data";
import { DISCLAIMER } from "@/lib/defaults";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Request a personalized consultation for body contouring, skincare and aesthetic treatments at Lucy CRYO Services.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const [services, pages, settings] = await Promise.all([getServices(), getPagesContent(), getSettings()]);

  const steps = [
    { Icon: MessageCircle, title: "Share your goals", text: "Tell us what you would like to focus on." },
    { Icon: CalendarCheck, title: "We confirm your time", text: "We reach out personally to confirm your appointment." },
    { Icon: ShieldCheck, title: "Personalized plan", text: "Your consultation determines the right next step." },
  ];

  return (
    <>
      <PageHero eyebrow="Booking" title={pages.booking.heading} text={pages.booking.text} />
      <div className="container-lux grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.6fr_1fr]">
        <BookingForm services={services.map((s) => ({ _id: s._id, title: s.price ? `${s.title} – ${s.price}${s.priceNote ? " " + s.priceNote : ""}` : s.title }))} initialServiceId={service} />

        <aside className="space-y-6">
          <div className="rounded-3xl bg-ice p-7">
            <h2 className="font-serif text-3xl font-semibold text-navy">What happens next</h2>
            <ol className="mt-6 space-y-6">
              {steps.map(({ Icon, title, text }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-teal shadow-soft">
                    <Icon size={20} aria-hidden />
                  </span>
                  <div>
                    <p className="font-bold text-navy">
                      {i + 1}. {title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl bg-linear-to-br from-navy to-teal p-7 text-white">
            <h2 className="font-serif text-2xl font-semibold">Prefer to talk?</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={telHref(settings.phone)} className="flex items-center gap-3 hover:text-aqua">
                  <Phone size={18} className="text-aqua" aria-hidden /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all hover:text-aqua">
                  <Mail size={18} className="shrink-0 text-aqua" aria-hidden /> {settings.email}
                </a>
              </li>
              <li className="flex gap-3 text-white/85">
                <Clock size={18} className="mt-0.5 shrink-0 text-aqua" aria-hidden />
                <span className="whitespace-pre-line">{settings.businessHours}</span>
              </li>
            </ul>
          </div>
          <p className="px-2 text-sm text-muted">{DISCLAIMER}</p>
        </aside>
      </div>
    </>
  );
}
