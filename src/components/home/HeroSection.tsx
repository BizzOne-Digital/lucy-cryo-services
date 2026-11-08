import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, ShieldCheck } from "lucide-react";
import { AquaRibbon, LotusMark } from "@/components/site/icons";
import type { HomeContent } from "@/lib/defaults";
import { resolveImageUrl } from "@/lib/images";

/** Stagger delay for the entrance animation (added on top of the intro splash delay). */
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function HeroSection({ hero }: { hero: HomeContent["hero"] }) {
  const trust = [
    { Icon: LotusMark, label: hero.trust1 },
    { Icon: ShieldCheck, label: hero.trust2 },
    { Icon: Gem, label: hero.trust3 },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-ice via-white to-aqua-light/50">
      {/* Soft clinic atmosphere */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-aqua-light blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 bottom-0 h-72 w-72 rounded-full bg-aqua/15 blur-3xl" />

      <div className="relative grid lg:min-h-[560px] lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div className="relative z-10 flex items-center">
          <div className="w-full px-4 pt-12 pb-10 sm:px-6 lg:py-16 lg:pr-4 lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))]">
            <div className="mx-auto max-w-[560px] text-center lg:mx-0 lg:text-left">
              <h1 className="anim-up font-serif leading-[0.92] font-semibold text-navy" style={d(0)}>
                <span className="relative inline-block text-[64px] italic sm:text-[92px] xl:text-[104px]">
                  {hero.heading}
                  <svg
                    aria-hidden
                    viewBox="0 0 300 30"
                    className="absolute -right-6 -bottom-2 h-6 w-[62%] text-aqua sm:-right-10"
                    fill="none"
                  >
                    <path d="M2 22C80 6 170 2 298 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="mt-3 block text-[26px] font-medium italic sm:pl-24 sm:text-[36px] lg:text-right lg:pr-6">
                  {hero.subheading}
                </span>
              </h1>
              <p style={d(0.15)} className="anim-up mt-7 text-[13px] font-semibold tracking-[0.35em] text-navy uppercase sm:text-[15px] sm:tracking-[0.42em]">
                {hero.eyebrow}
              </p>
              <p style={d(0.25)} className="anim-up mt-4 text-[17px] leading-8 text-ink/85 sm:text-lg">{hero.description}</p>

              <div style={d(0.38)} className="anim-up mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/booking" className="btn-primary px-8">
                  {hero.primaryCta} <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/services" className="btn-outline px-10">
                  {hero.secondaryCta}
                </Link>
              </div>

              <ul className="mt-10 grid grid-cols-3 gap-2 sm:max-w-md lg:mx-0">
                {trust.map(({ Icon, label }, i) => (
                  <li key={label} style={d(0.5 + i * 0.12)} className="anim-up flex flex-col items-center gap-2 text-center">
                    <Icon size={34} className="text-teal" strokeWidth={1.3} />
                    <span className="text-sm leading-snug text-navy sm:text-[15px]">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-[380px] sm:h-[460px] lg:h-auto lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]">
          <div className="anim-zoom absolute inset-0" style={d(0)}>
          <Image
            src={resolveImageUrl(hero.image)}
            alt={hero.imageAlt}
            fill
            priority
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          </div>
          {/* Blend into the ice-blue background like the mockup */}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-white/70 via-transparent to-transparent lg:bg-linear-to-r lg:from-ice lg:via-ice/10 lg:to-transparent" />
          <div className="anim-ribbon pointer-events-none absolute inset-0" style={d(0.45)}>
            <AquaRibbon className="animate-float absolute -bottom-6 -left-10 h-[60%] w-[115%] lg:-left-40 lg:w-[140%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
