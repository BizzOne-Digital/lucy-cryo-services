import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { HomeContent } from "@/lib/defaults";
import type { PromotionItem } from "@/lib/data";

function ContourIllustration() {
  return (
    <svg viewBox="0 0 80 120" className="h-24 w-16 shrink-0 text-teal sm:h-28" fill="none" aria-hidden>
      <path d="M30 4c4 14 2 24-6 34s-10 26-2 40 6 30 2 38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 4c-3 12-1 22 6 30s9 20 3 32-5 26-1 50" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M54 62h16" stroke="#36D6CB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GiftIllustration() {
  return (
    <svg viewBox="0 0 140 120" className="h-28 w-32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="box" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E3F1F5" />
        </linearGradient>
      </defs>
      <rect x="22" y="52" width="96" height="60" rx="4" fill="url(#box)" stroke="#CFE3EA" />
      <rect x="16" y="40" width="108" height="16" rx="3" fill="#fff" stroke="#CFE3EA" />
      <rect x="62" y="40" width="16" height="72" fill="#36D6CB" />
      <rect x="16" y="44" width="108" height="8" fill="#36D6CB" opacity=".9" />
      <path d="M70 40C56 18 32 20 40 34c4 7 18 7 30 6zM70 40c14-22 38-20 30-6-4 7-18 7-30 6z" fill="#7FE3DC" stroke="#13A89E" strokeWidth="1.5" />
      <path d="M70 40 52 70M70 40l18 30" stroke="#13A89E" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function SpecialOffers({ offers, promotion }: { offers: HomeContent["offers"]; promotion?: PromotionItem }) {
  // An active promotion from the admin panel overrides the default heading/subheading.
  const heading = offers.heading;
  const sub = promotion?.title || offers.subheading;

  return (
    <section className="bg-linear-to-r from-aqua-light/70 via-ice to-aqua-light/60" aria-label="Special offers and booking">
      <div className="container-lux grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_auto_1fr] lg:gap-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <ContourIllustration />
          <div className="min-w-0 flex-1">
            <h2 className="heading-serif text-4xl sm:text-5xl">{heading}</h2>
            <p className="mt-1 text-xl text-navy/85">{sub}</p>
            <Link href="/services#packages" className="btn-primary mt-4 min-h-10 rounded-full px-6 py-2 text-sm">
              {promotion?.buttonText && promotion.buttonUrl === "/services#packages" ? promotion.buttonText : offers.buttonText}
            </Link>
          </div>
          <div className="hidden sm:block">
            <GiftIllustration />
          </div>
        </div>

        <span aria-hidden className="hidden h-28 w-px bg-teal/40 lg:block" />

        <div className="flex flex-col gap-5 rounded-2xl bg-white/60 p-6 sm:flex-row sm:items-center lg:bg-transparent lg:p-0">
          <CalendarDays size={48} strokeWidth={1.2} className="shrink-0 text-teal" aria-hidden />
          <div className="flex-1">
            <h2 className="font-serif text-3xl font-semibold text-navy">{offers.ctaHeading}</h2>
            <p className="mt-1 leading-7 text-ink/80">{offers.ctaText}</p>
          </div>
          <Link href="/booking" className="btn-primary shrink-0">
            {offers.ctaButton} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
