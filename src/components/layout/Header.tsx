"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House, Mail, Menu, Phone, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { cn, telHref } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blogs", label: "Blogs" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  phone: string;
  email: string;
  topBarText: string;
  ctaText: string;
  logo?: string;
  logoAlt?: string;
};

export function Header({ phone, email, topBarText, ctaText, logo, logoAlt }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Top information bar */}
      <div className="bg-linear-to-r from-navy-deep via-navy to-teal text-white">
        <div className="container-lux flex h-10 items-center justify-between gap-4 text-[13px] sm:text-sm">
          <div className="flex min-w-0 items-center gap-5 lg:gap-14">
            <a href={telHref(phone)} className="flex items-center gap-2 hover:text-aqua">
              <Phone size={15} aria-hidden />
              <span>{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="hidden items-center gap-2 hover:text-aqua md:flex">
              <Mail size={15} aria-hidden />
              <span className="truncate">{email}</span>
            </a>
            <span className="hidden items-center gap-2 lg:flex">
              <House size={15} aria-hidden />
              {topBarText}
            </span>
          </div>
          <Link
            href="/booking"
            className="hidden rounded-full bg-aqua px-6 py-1.5 text-[13px] font-semibold text-navy transition hover:bg-aqua-soft sm:inline-flex"
          >
            {ctaText}
          </Link>
          <span className="truncate text-xs text-white/80 sm:hidden">{topBarText}</span>
        </div>
      </div>

      {/* Main navigation */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "border-line shadow-soft" : "border-transparent",
        )}
      >
        <div className={cn("container-lux flex items-center justify-between transition-all", scrolled ? "h-[72px]" : "h-[82px]")}>
          <Logo logo={logo} alt={logoAlt} />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-2 lg:gap-6">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className={cn(
                      "relative px-3 py-2 text-[17px] font-medium transition-colors lg:px-4",
                      isActive(n.href) ? "text-navy" : "text-navy/80 hover:text-teal",
                    )}
                  >
                    {n.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-navy transition-transform lg:inset-x-4",
                        isActive(n.href) ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-ice md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-nav"
          className={cn(
            "absolute inset-x-0 top-full z-40 h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-white transition-all md:hidden",
            open ? "visible opacity-100" : "invisible opacity-0",
          )}
        >
          <nav aria-label="Mobile" className="container-lux flex h-full flex-col py-6">
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-4 font-serif text-2xl font-semibold",
                      isActive(n.href) ? "bg-ice text-navy" : "text-navy/85",
                    )}
                  >
                    {n.label}
                    <ArrowRight size={20} className="text-aqua" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-3 border-t border-line pt-6">
              <a href={telHref(phone)} className="flex items-center gap-3 text-navy">
                <Phone size={18} className="text-teal" aria-hidden /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 break-all text-navy">
                <Mail size={18} className="shrink-0 text-teal" aria-hidden /> {email}
              </a>
              <Link href="/booking" className="btn-primary mt-3 w-full">
                {ctaText}
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
