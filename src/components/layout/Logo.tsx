import Image from "next/image";
import Link from "next/link";
import { LotusMark } from "@/components/site/icons";
import { resolveImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Uses the uploaded logo from Settings when available; otherwise a tasteful text mark. */
export function Logo({ logo, alt, light = false }: { logo?: string; alt?: string; light?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Lucy CRYO Services – Home">
      {logo ? (
        <Image
          src={resolveImageUrl(logo)}
          alt={alt || "Lucy CRYO Services logo"}
          width={220}
          height={64}
          className="h-12 w-auto object-contain sm:h-14"
          priority
        />
      ) : (
        <>
          <LotusMark size={52} className={cn("shrink-0", light ? "text-aqua" : "text-aqua")} />
          <span className="leading-none">
            <span className={cn("font-serif text-[30px] font-semibold italic sm:text-[34px]", light ? "text-white" : "text-navy")}>
              Lucy
            </span>{" "}
            <span className={cn("text-[24px] font-semibold tracking-wide sm:text-[28px]", light ? "text-aqua" : "text-teal")}>
              CRYO
            </span>
            <span className={cn("block pl-14 text-[15px] tracking-[0.12em] sm:text-base", light ? "text-white/80" : "text-navy")}>
              Services
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
