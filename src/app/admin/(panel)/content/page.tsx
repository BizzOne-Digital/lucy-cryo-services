"use client";

import { useState } from "react";
import { SingletonEditor, type Section } from "@/components/admin/SingletonEditor";
import { cn } from "@/lib/utils";

const HOME: Section[] = [
  {
    id: "hero",
    title: "Hero",
    description: "The first section visitors see.",
    fields: [
      { name: "hero.heading", label: "Heading", type: "text" },
      { name: "hero.subheading", label: "Subheading", type: "text" },
      { name: "hero.eyebrow", label: "Eyebrow (uppercase line)", type: "text", full: true },
      { name: "hero.description", label: "Description", type: "textarea", rows: 2 },
      { name: "hero.primaryCta", label: "Primary button text", type: "text" },
      { name: "hero.secondaryCta", label: "Secondary button text", type: "text" },
      { name: "hero.trust1", label: "Trust point 1", type: "text" },
      { name: "hero.trust2", label: "Trust point 2", type: "text" },
      { name: "hero.trust3", label: "Trust point 3", type: "text" },
      { name: "hero.image", label: "Hero image", type: "image", folder: "pages" },
      { name: "hero.imageAlt", label: "Hero image alt text", type: "text", full: true },
    ],
  },
  {
    id: "offers",
    title: "Services & Offers",
    description: "Services heading, the Special Offers strip and the benefits bar.",
    fields: [
      { name: "services.heading", label: "Services section heading", type: "text", full: true },
      { name: "offers.heading", label: "Special offers heading", type: "text" },
      { name: "offers.subheading", label: "Special offers subheading", type: "text", help: "Replaced by the first active promotion title when one exists." },
      { name: "offers.buttonText", label: "Offers button text", type: "text" },
      { name: "offers.ctaHeading", label: "Booking CTA heading", type: "text" },
      { name: "offers.ctaText", label: "Booking CTA text", type: "textarea", rows: 2 },
      { name: "offers.ctaButton", label: "Booking CTA button", type: "text" },
      { name: "benefits.item1", label: "Benefits bar item 1", type: "text" },
      { name: "benefits.item2", label: "Benefits bar item 2", type: "text" },
      { name: "benefits.item3", label: "Benefits bar item 3", type: "text" },
      { name: "benefits.item4", label: "Benefits bar item 4", type: "text" },
    ],
  },
  {
    id: "about",
    title: "About / Intro",
    fields: [
      { name: "about.eyebrow", label: "Eyebrow", type: "text" },
      { name: "about.heading", label: "Heading", type: "text" },
      { name: "about.body", label: "Body text", type: "textarea", rows: 7, help: "Separate paragraphs with a blank line." },
      { name: "about.bullets", label: "Highlights", type: "list" },
      { name: "about.cta", label: "Button text", type: "text" },
      { name: "about.image", label: "About image", type: "image", folder: "pages" },
      { name: "about.imageAlt", label: "About image alt text", type: "text", full: true },
    ],
  },
  {
    id: "featured",
    title: "Featured & Why Us",
    description: "Featured services are chosen in Admin → Services (toggle “Featured”).",
    fields: [
      { name: "featured.eyebrow", label: "Featured eyebrow", type: "text" },
      { name: "featured.heading", label: "Featured heading", type: "text" },
      { name: "featured.subheading", label: "Featured subheading", type: "textarea", rows: 2 },
      { name: "why.eyebrow", label: "Why Choose Us eyebrow", type: "text" },
      { name: "why.heading", label: "Why Choose Us heading", type: "text" },
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => [
        { name: `why.items.${i}.title`, label: `Benefit ${i + 1} title`, type: "text" as const },
        { name: `why.items.${i}.text`, label: `Benefit ${i + 1} text`, type: "text" as const },
      ]),
    ],
  },
  {
    id: "promo",
    title: "Promotion Banner",
    fields: [
      { name: "promoBanner.heading", label: "Heading", type: "text", full: true },
      { name: "promoBanner.text", label: "Text", type: "textarea", rows: 2 },
      { name: "promoBanner.buttonText", label: "Button text", type: "text" },
      { name: "promoBanner.image", label: "Banner image", type: "image", folder: "pages" },
    ],
  },
  {
    id: "blog",
    title: "Blog & Gallery",
    fields: [
      { name: "blog.eyebrow", label: "Blog eyebrow", type: "text" },
      { name: "blog.heading", label: "Blog heading", type: "text" },
      { name: "blog.subheading", label: "Blog subheading", type: "textarea", rows: 2 },
      { name: "blog.buttonText", label: "Blog button text", type: "text" },
      { name: "gallery.heading", label: "Gallery heading", type: "text" },
      { name: "gallery.subheading", label: "Gallery subheading", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "cta",
    title: "Final CTA",
    fields: [
      { name: "finalCta.heading", label: "Heading", type: "text", full: true },
      { name: "finalCta.text", label: "Text", type: "textarea", rows: 2 },
      { name: "finalCta.buttonText", label: "Button text", type: "text" },
      { name: "finalCta.image", label: "Background image", type: "image", folder: "pages" },
    ],
  },
];

const PAGES: Section[] = [
  {
    id: "services",
    title: "Services page",
    fields: [
      { name: "services.heading", label: "Hero heading", type: "text", full: true },
      { name: "services.text", label: "Hero text", type: "textarea", rows: 3 },
      { name: "services.image", label: "Hero image", type: "image", folder: "pages" },
    ],
  },
  {
    id: "blogs",
    title: "Blogs page",
    fields: [
      { name: "blogs.heading", label: "Hero heading", type: "text", full: true },
      { name: "blogs.text", label: "Hero text", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "booking",
    title: "Booking page",
    fields: [
      { name: "booking.heading", label: "Hero heading", type: "text", full: true },
      { name: "booking.text", label: "Hero text", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "contact",
    title: "Contact page",
    fields: [
      { name: "contact.heading", label: "Hero heading", type: "text", full: true },
      { name: "contact.text", label: "Hero text", type: "textarea", rows: 2 },
    ],
  },
];

export default function AdminContentPage() {
  const [doc, setDoc] = useState<"home" | "pages">("home");
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["home", "pages"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDoc(d)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold",
              d === doc ? "bg-navy text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-teal",
            )}
          >
            {d === "home" ? "Homepage" : "Other pages"}
          </button>
        ))}
      </div>
      {doc === "home" ? (
        <SingletonEditor
          key="home"
          contentKey="home"
          title="Website Content – Homepage"
          description="Edit homepage text and images. Empty text fields fall back to the original wording. Contact details and footer are in Settings."
          sections={HOME}
        />
      ) : (
        <SingletonEditor key="pages" contentKey="pages" title="Website Content – Other pages" description="Hero text for inner pages." sections={PAGES} />
      )}
    </div>
  );
}
