import Image from "next/image";
import Link from "next/link";
import { ServiceIcon } from "@/components/site/icons";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { ServiceItem } from "@/lib/data";
import { resolveImageUrl } from "@/lib/images";

export function ServicesPreview({ heading, services }: { heading: string; services: ServiceItem[] }) {
  return (
    <section className="bg-white py-14 sm:py-16" aria-labelledby="services-heading">
      <div className="container-lux">
        <div id="services-heading" data-reveal>
          <SectionHeading title={heading} />
        </div>
        {/* Horizontal scroll on mobile, grid from tablet up */}
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {services.slice(0, 6).map((s, i) => (
            <li key={s._id} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <Link
                href={`/services#${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line/70 bg-linear-to-b from-ice to-white p-2.5 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-aqua hover:shadow-card"
              >
                <div className="flex min-h-[64px] items-center gap-3 px-2 py-2">
                  <ServiceIcon name={s.icon} className="shrink-0 text-aqua" size={30} />
                  <h3 className="text-[17px] leading-tight font-bold text-navy">{s.title}</h3>
                </div>
                <div className="relative mt-auto aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={resolveImageUrl(s.image)}
                    alt={s.imageAlt || s.title}
                    fill
                    sizes="(min-width:1024px) 200px, (min-width:640px) 33vw, 72vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
