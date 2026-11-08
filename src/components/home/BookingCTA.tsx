import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { LotusMark } from "@/components/site/icons";
import { resolveImageUrl } from "@/lib/images";
import { telHref } from "@/lib/utils";

export function BookingCTA({
  heading,
  text,
  buttonText,
  image,
  phone,
}: {
  heading: string;
  text: string;
  buttonText: string;
  image?: string;
  phone: string;
}) {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-28">
      {image && (
        <Image src={resolveImageUrl(image)} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-white via-white/92 to-ice/80" />
      <div className="container-lux text-center">
        <LotusMark size={56} className="mx-auto text-teal" />
        <h2 className="heading-serif mx-auto mt-5 max-w-3xl text-4xl leading-tight sm:text-6xl">{heading}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/85">{text}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/booking" className="btn-primary px-9">
            {buttonText} <ArrowRight size={18} aria-hidden />
          </Link>
          <a href={telHref(phone)} className="btn-outline">
            <Phone size={17} aria-hidden /> Call {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
