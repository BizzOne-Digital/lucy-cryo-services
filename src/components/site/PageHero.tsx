import Image from "next/image";
import { AquaRibbon } from "./icons";
import { resolveImageUrl } from "@/lib/images";

/** Inner-page hero in the same ice-blue / aqua ribbon language as the homepage. */
export function PageHero({
  eyebrow,
  title,
  text,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-ice via-white to-aqua-light/60">
      {image && (
        <div className="absolute inset-y-0 right-0 hidden w-[45%] lg:block">
          <Image src={resolveImageUrl(image)} alt="" fill priority sizes="45vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-ice via-ice/40 to-transparent" />
        </div>
      )}
      <AquaRibbon className="pointer-events-none absolute -bottom-10 left-0 h-40 w-full opacity-70" />
      <div className="container-lux relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="heading-serif text-5xl leading-[1.05] sm:text-6xl">{title}</h1>
          {text && <p className="mt-5 text-lg leading-8 text-ink/80">{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
