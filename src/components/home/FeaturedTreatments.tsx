import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/site/icons";
import { PriceTag } from "@/components/site/PriceTag";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { HomeContent } from "@/lib/defaults";
import type { ServiceItem } from "@/lib/data";
import { resolveImageUrl } from "@/lib/images";

export function FeaturedTreatments({ content, services }: { content: HomeContent["featured"]; services: ServiceItem[] }) {
  if (!services.length) return null;
  return (
    <section className="bg-linear-to-b from-ice to-white py-20 sm:py-24">
      <div className="container-lux">
        <SectionHeading eyebrow={content.eyebrow} title={content.heading} subtitle={content.subheading} />
        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s._id}
              data-reveal style={{ transitionDelay: `${i * 90}ms` }}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={resolveImageUrl(s.image)}
                  alt={s.imageAlt || s.title}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy/50 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-soft">
                  <ServiceIcon name={s.icon} className="text-teal" size={24} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-serif text-3xl font-semibold text-navy">{s.title}</h3>
                <PriceTag price={s.price} note={s.priceNote} className="mt-1" />
                <p className="mt-3 flex-1 leading-7 text-muted">{s.shortDescription}</p>
                <Link
                  href={`/services#${s.slug}`}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-teal hover:text-navy"
                  aria-label={`Learn more about ${s.title}`}
                >
                  Learn More <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
