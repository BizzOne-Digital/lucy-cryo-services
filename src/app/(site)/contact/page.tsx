import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Globe, House, Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/PageHero";
import { getPagesContent, getSettings } from "@/lib/data";
import { telHref } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Lucy CRYO Services by phone, email or our online form.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [s, pages] = await Promise.all([getSettings(), getPagesContent()]);
  const websiteHref = s.website.startsWith("http") ? s.website : `https://${s.website}`;
  const details = [
    { Icon: Phone, label: "Phone", value: s.phone, href: telHref(s.phone) },
    { Icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { Icon: Globe, label: "Website", value: s.website, href: websiteHref },
    { Icon: House, label: "Setting", value: s.topBarText },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title={pages.contact.heading} text={pages.contact.text} />
      <div className="container-lux grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {details.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua-light text-teal">
                  <Icon size={22} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-wide text-muted uppercase">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block font-semibold break-all text-navy hover:text-teal">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold text-navy">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-ice p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
              <Clock size={19} className="text-teal" aria-hidden /> Operating Hours
            </h2>
            <p className="mt-3 leading-7 whitespace-pre-line text-ink/85">{s.businessHours}</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-navy to-teal p-7 text-white">
            <h2 className="font-serif text-3xl font-semibold italic">Ready to book?</h2>
            <p className="mt-2 text-white/85">Request your personalized consultation online in under two minutes.</p>
            <Link href="/booking" className="btn-aqua mt-5">
              {s.bookingCtaText} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
