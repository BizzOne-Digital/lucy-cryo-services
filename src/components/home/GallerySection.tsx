import Image from "next/image";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { GalleryEntry } from "@/lib/data";
import type { HomeContent } from "@/lib/defaults";
import { resolveImageUrl } from "@/lib/images";

/** Only renders when the admin has added visible gallery images. */
export function GallerySection({ content, items }: { content: HomeContent["gallery"]; items: GalleryEntry[] }) {
  if (!items.length) return null;
  return (
    <section className="py-20 sm:py-24">
      <div className="container-lux">
        <SectionHeading title={content.heading} subtitle={content.subheading} />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((g, i) => (
            <li
              key={g._id}
              className={`group relative overflow-hidden rounded-2xl bg-ice ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
            >
              <Image
                src={resolveImageUrl(g.image)}
                alt={g.alt || g.title || "Lucy CRYO Services gallery image"}
                fill
                sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {g.title && (
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy/80 to-transparent px-4 pt-8 pb-3 text-sm font-medium text-white">
                  {g.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
