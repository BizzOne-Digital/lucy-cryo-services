import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { AquaRibbon } from "@/components/site/icons";
import type { HomeContent } from "@/lib/defaults";
import { resolveImageUrl } from "@/lib/images";

export function PromoBanner({ promo }: { promo: HomeContent["promoBanner"] }) {
  return (
    <section className="container-lux py-6">
      <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-navy via-navy to-teal px-6 py-12 text-white shadow-card sm:px-12 lg:py-16">
        {promo.image && (
          <div className="absolute inset-y-0 right-0 hidden w-2/5 lg:block">
            <Image src={resolveImageUrl(promo.image)} alt="" fill sizes="40vw" className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/60 to-transparent" />
          </div>
        )}
        <AquaRibbon className="pointer-events-none absolute -bottom-12 left-0 h-40 w-full opacity-60" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-aqua-soft">
            <Gift size={16} aria-hidden /> Packages &amp; Promotions
          </span>
          <h2 className="mt-5 font-serif text-4xl leading-tight font-semibold italic sm:text-5xl">{promo.heading}</h2>
          <p className="mt-4 text-lg leading-8 text-white/85">{promo.text}</p>
          <Link href="/services#packages" className="btn-aqua mt-8">
            {promo.buttonText} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
