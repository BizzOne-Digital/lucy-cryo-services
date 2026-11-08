import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/data";
import { IntroSplash } from "@/components/site/IntroSplash";
import { RevealObserver } from "@/components/site/RevealObserver";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <IntroSplash brand={s.brandName} business={s.businessName} />
      <RevealObserver />
      <a href="#main" className="sr-only z-50 rounded bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <Header
        phone={s.phone}
        email={s.email}
        topBarText={s.topBarText}
        ctaText={s.bookingCtaText}
        logo={s.logo}
        logoAlt={s.logoAlt}
      />
      <main id="main" className="pb-20 md:pb-0">
        {children}
      </main>
      <Footer settings={s} />

      {/* Sticky mobile booking CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <Link href="/booking" className="btn-primary w-full">
          <CalendarCheck size={18} aria-hidden /> {s.bookingCtaText}
        </Link>
      </div>
    </>
  );
}
