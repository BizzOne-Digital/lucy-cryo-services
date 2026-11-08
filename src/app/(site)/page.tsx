import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { SpecialOffers } from "@/components/home/SpecialOffers";
import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedTreatments } from "@/components/home/FeaturedTreatments";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PromoBanner } from "@/components/home/PromoBanner";
import { GallerySection } from "@/components/home/GallerySection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { BookingCTA } from "@/components/home/BookingCTA";
import {
  getBlogs,
  getFeaturedServices,
  getGallery,
  getHomeContent,
  getPromotions,
  getServices,
  getSettings,
} from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: { absolute: s.seoTitle }, description: s.seoDescription, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  const [content, settings, services, featured, promotions, blogs, gallery] = await Promise.all([
    getHomeContent(),
    getSettings(),
    getServices(),
    getFeaturedServices(3),
    getPromotions(),
    getBlogs(1, 3),
    getGallery(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: settings.businessName,
    alternateName: settings.brandName,
    description: settings.seoDescription,
    telephone: settings.phone,
    email: settings.email,
    url: settings.website.startsWith("http") ? settings.website : `https://${settings.website}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <HeroSection hero={content.hero} />
      <ServicesPreview heading={content.services.heading} services={services} />
      <div data-reveal>
        <SpecialOffers offers={content.offers} promotion={promotions[0]} />
      </div>
      <BenefitsStrip benefits={content.benefits} />
      <div data-reveal>
        <AboutSection about={content.about} />
      </div>
      <FeaturedTreatments content={content.featured} services={featured} />
      <WhyChooseUs why={content.why} />
      <div data-reveal>
        <PromoBanner promo={content.promoBanner} />
      </div>
      <div data-reveal>
        <GallerySection content={content.gallery} items={gallery} />
      </div>
      <BlogPreview content={content.blog} posts={blogs.items} />
      <BookingCTA
        heading={content.finalCta.heading}
        text={content.finalCta.text}
        buttonText={content.finalCta.buttonText}
        image={content.finalCta.image}
        phone={settings.phone}
      />
    </>
  );
}
