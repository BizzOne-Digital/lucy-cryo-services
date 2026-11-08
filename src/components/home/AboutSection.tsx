import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { LotusMark } from "@/components/site/icons";
import type { HomeContent } from "@/lib/defaults";
import { resolveImageUrl } from "@/lib/images";

export function AboutSection({ about }: { about: HomeContent["about"] }) {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="about-heading">
      <div className="container-lux grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div aria-hidden className="absolute -top-5 -left-5 h-full w-full rounded-[28px] border-2 border-aqua/50" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={resolveImageUrl(about.image)}
              alt={about.imageAlt}
              fill
              sizes="(min-width:1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-2 -bottom-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-card sm:right-6">
            <LotusMark size={40} className="text-teal" />
            <p className="text-sm leading-tight font-semibold text-navy">
              Private, home-based
              <br />
              <span className="font-normal text-muted">medical spa</span>
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="about-heading" className="heading-serif mt-3 text-4xl leading-tight sm:text-5xl">
            {about.heading}
          </h2>
          <div className="mt-6 space-y-4 text-[17px] leading-8 text-ink/85">
            {about.body.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {about.bullets.filter(Boolean).map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl bg-ice px-4 py-3 text-navy">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aqua text-navy">
                  <Check size={14} strokeWidth={2.5} aria-hidden />
                </span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
          <Link href="/services" className="btn-primary mt-9">
            {about.cta} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
