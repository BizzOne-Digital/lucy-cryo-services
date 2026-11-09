"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

const ICONS = ["snowflake", "droplet", "activity", "waves", "face", "sparkles", "leaf", "lotus"].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

export default function AdminServicesPage() {
  return (
    <ResourceManager
      resource="services"
      title="Services"
      singular="Service"
      description="Treatments shown on the homepage and Services page. Use the arrows to change the display order."
      listTitle="title"
      listSubtitle="price"
      listImage="image"
      orderable
      badges={[
        { field: "active", on: "Active", off: "Hidden" },
        { field: "featured", on: "Featured", off: "Not featured" },
      ]}
      publicUrl={(i) => `/services#${i.slug}`}
      defaults={{ title: "", slug: "", shortDescription: "", description: "", benefits: [], image: "", imageAlt: "", price: "", priceNote: "", icon: "sparkles", featured: false, active: true, order: 0 }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", required: true, slugFrom: "title" },
        { name: "shortDescription", label: "Short description", type: "textarea", rows: 2, maxLength: 400, help: "Shown on cards (1–2 sentences)." },
        { name: "description", label: "Full description", type: "textarea", rows: 6, help: "Avoid guaranteed-result claims. Use wording like “designed to support” or “may help”." },
        { name: "benefits", label: "Benefits", type: "list" },
        { name: "price", label: "Price", type: "text", help: "E.g. $99. Leave empty to hide the price." },
        { name: "priceNote", label: "Price note", type: "text", help: "E.g. per applicator, for 4 sessions, per treatment." },
        { name: "image", label: "Service image", type: "image", folder: "pages" },
        { name: "imageAlt", label: "Image alt text", type: "text", help: "Describe the image for screen readers and SEO." },
        { name: "icon", label: "Icon", type: "select", options: ICONS },
        { name: "order", label: "Display order", type: "number" },
        { name: "active", label: "Active (visible on website)", type: "boolean" },
        { name: "featured", label: "Featured on homepage", type: "boolean" },
      ]}
    />
  );
}
