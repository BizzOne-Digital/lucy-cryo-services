import Link from "next/link";
import { Clock, Globe, Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/site/icons";
import type { SiteSettings } from "@/lib/defaults";
import { telHref } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blogs", label: "Blogs" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings: s }: { settings: SiteSettings }) {
  const socials = [
    { key: "facebook", label: "Facebook", Icon: FacebookIcon, href: s.social.facebook },
    { key: "instagram", label: "Instagram", Icon: InstagramIcon, href: s.social.instagram },
    { key: "tiktok", label: "TikTok", Icon: TikTokIcon, href: s.social.tiktok },
    { key: "youtube", label: "YouTube", Icon: YoutubeIcon, href: s.social.youtube },
  ];
  const websiteHref = s.website.startsWith("http") ? s.website : `https://${s.website}`;

  return (
    <footer className="relative overflow-hidden bg-linear-to-br from-navy-deep via-navy to-teal-dark text-white">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-aqua/10 blur-3xl" />
      <div className="container-lux relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
        <div>
          <Logo logo={s.logo} alt={s.logoAlt} light />
          <p className="mt-5 max-w-sm leading-7 text-white/75">{s.footerDescription}</p>
          <ul className="mt-6 flex gap-3" aria-label="Social media">
            {socials.map(({ key, label, Icon, href }) => (
              <li key={key}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-aqua transition hover:border-aqua hover:bg-white/10"
                  >
                    <Icon size={18} />
                  </a>
                ) : (
                  <span
                    title={`${label} coming soon`}
                    aria-label={`${label} (coming soon)`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/40"
                  >
                    <Icon size={18} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-aqua uppercase">Explore</h2>
          <ul className="mt-5 space-y-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/80 transition hover:text-aqua">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-aqua uppercase">Contact</h2>
          <ul className="mt-5 space-y-4 text-white/85">
            <li>
              <a href={telHref(s.phone)} className="flex items-center gap-3 hover:text-aqua">
                <Phone size={17} className="text-aqua" aria-hidden /> {s.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="flex items-center gap-3 break-all hover:text-aqua">
                <Mail size={17} className="shrink-0 text-aqua" aria-hidden /> {s.email}
              </a>
            </li>
            <li>
              <a href={websiteHref} className="flex items-center gap-3 hover:text-aqua">
                <Globe size={17} className="text-aqua" aria-hidden /> {s.website}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-aqua uppercase">Hours</h2>
          <div className="mt-5 flex gap-3 text-white/85">
            <Clock size={17} className="mt-1 shrink-0 text-aqua" aria-hidden />
            <p className="leading-7 whitespace-pre-line">{s.businessHours}</p>
          </div>
          <Link href="/booking" className="btn-aqua mt-6">
            {s.bookingCtaText}
          </Link>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-lux flex flex-col gap-2 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {s.businessName}. All rights reserved.
          </p>
          <p>Individual results vary. A consultation is recommended before any treatment.</p>
        </div>
      </div>
    </footer>
  );
}
