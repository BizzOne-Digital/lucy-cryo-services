import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Gift, Info } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceIcon } from "@/components/site/icons";
import { BookingCTA } from "@/components/home/BookingCTA";
import { getHomeContent, getPagesContent, getPromotions, getServices, getSettings } from "@/lib/data";
import { DISCLAIMER } from "@/lib/defaults";
import { resolveImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore CoolSculpting, Hydro Facial, Muscle Stimulation, CRYO Coolwave, Onda Pro and HIFU Facelift at Lucy CRYO Services. Consultation recommended.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, promotions, pages, home, settings] = await Promise.all([
    getServices(),
    getPromotions(),
    getPagesContent(),
    getHomeContent(),
    getSettings(),
  ]);

  return (
    <>
      <PageHero eyebrow="Our Treatments" title={pages.services.heading} text={pages.services.text} image={pages.services.image}>
        <nav aria-label="Jump to a service" className="mt-8 flex flex-wrap gap-2">
          {services.map((s) => (
            <a
              key={s._id}
              href={`#${s.slug}`}
              className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-navy transition hover:border-aqua hover:bg-aqua-light"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-lux space-y-20 py-20 sm:space-y-28 sm:py-24">
        {services.map((s, i) => (
          <section key={s._id} id={s.slug} className="scroll-mt-28" aria-labelledby={`${s.slug}-title`}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={cn("relative", i % 2 === 1 && "lg:order-2")}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-card">
                  <Image
                    src={resolveImageUrl(s.image)}
                    alt={s.imageAlt || s.title}
                    fill
                    sizes="(min-width:1024px) 600px, 100vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute -top-5 left-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
                  <ServiceIcon name={s.icon} className="text-aqua" size={32} />
                </span>
              </div>
              <div>
                <p className="eyebrow">Treatment {String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${s.slug}-title`} className="heading-serif mt-3 text-4xl sm:text-5xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-lg font-medium text-teal">{s.shortDescription}</p>
                <p className="mt-5 text-[17px] leading-8 whitespace-pre-line text-ink/85">{s.description}</p>
                {s.benefits.length > 0 && (
                  <>
                    <h3 className="mt-7 text-sm font-bold tracking-[0.2em] text-navy uppercase">Benefits overview</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-ink/90">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aqua-light text-teal">
                            <Check size={14} strokeWidth={2.5} aria-hidden />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-6 flex items-start gap-2 rounded-xl bg-ice px-4 py-3 text-sm text-muted">
                  <Info size={16} className="mt-0.5 shrink-0 text-teal" aria-hidden />
                  {DISCLAIMER}
                </p>
                <Link href={`/booking?service=${encodeURIComponent(s._id)}`} className="btn-primary mt-7">
                  Book Consultation <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Packages & promotions (managed in Admin → Promotions) */}
      <section id="packages" className="scroll-mt-28 bg-ice py-20 sm:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Special Offers" title="Packages & Promotions" subtitle={home.promoBanner.text} />
          {promotions.length ? (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {promotions.map((p) => (
                <article key={p._id} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line">
                  {p.image && (
                    <div className="relative aspect-[16/10]">
                      <Image src={resolveImageUrl(p.image)} alt={p.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <Gift size={26} className="text-aqua" aria-hidden />
                    <h3 className="mt-3 font-serif text-3xl font-semibold text-navy">{p.title}</h3>
                    {p.subtitle && <p className="mt-1 font-medium text-teal">{p.subtitle}</p>}
                    {p.description && <p className="mt-3 flex-1 leading-7 whitespace-pre-line text-muted">{p.description}</p>}
                    <Link href={p.buttonUrl || "/booking"} className="btn-primary mt-6 self-start">
                      {p.buttonText || "Ask About This Package"} <ArrowRight size={18} aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-lg text-muted">
              New packages are coming soon.{" "}
              <Link href="/contact" className="font-semibold text-teal underline-offset-4 hover:underline">
                Contact us
              </Link>{" "}
              to ask about personalized treatment combinations.
            </p>
          )}
        </div>
      </section>

      <BookingCTA
        heading={home.finalCta.heading}
        text={home.finalCta.text}
        buttonText={home.finalCta.buttonText}
        image={home.finalCta.image}
        phone={settings.phone}
      />
    </>
  );
}
