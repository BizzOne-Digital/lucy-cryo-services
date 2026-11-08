"use client";

import { SingletonEditor } from "@/components/admin/SingletonEditor";

export default function AdminSettingsPage() {
  return (
    <SingletonEditor
      contentKey="settings"
      title="Settings"
      description="Business details, logo, footer and SEO defaults used across the whole website."
      sections={[
        {
          id: "business",
          title: "Business & Logo",
          description: "Upload the official Lucy CRYO logo to replace the temporary text logo everywhere.",
          fields: [
            { name: "businessName", label: "Business name", type: "text" },
            { name: "brandName", label: "Brand name", type: "text" },
            { name: "logo", label: "Logo", type: "image", folder: "misc", help: "Transparent PNG or WEBP recommended (approx. 440 × 128px)." },
            { name: "logoAlt", label: "Logo alt text", type: "text", full: true },
          ],
        },
        {
          id: "contact",
          title: "Contact details",
          fields: [
            { name: "phone", label: "Phone", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "website", label: "Website", type: "text" },
            { name: "topBarText", label: "Top bar text", type: "text" },
            { name: "bookingCtaText", label: "Booking button text", type: "text" },
            { name: "businessHours", label: "Business hours", type: "textarea", rows: 4, help: "One line per day or range." },
          ],
        },
        {
          id: "footer",
          title: "Footer & Social",
          description: "Leave a social link empty to show a muted placeholder icon.",
          fields: [
            { name: "footerDescription", label: "Footer description", type: "textarea", rows: 3 },
            { name: "social.facebook", label: "Facebook URL", type: "url" },
            { name: "social.instagram", label: "Instagram URL", type: "url" },
            { name: "social.tiktok", label: "TikTok URL", type: "url" },
            { name: "social.youtube", label: "YouTube URL", type: "url" },
          ],
        },
        {
          id: "seo",
          title: "SEO defaults",
          fields: [
            { name: "seoTitle", label: "Default SEO title", type: "text", full: true },
            { name: "seoDescription", label: "Default meta description", type: "textarea", rows: 3 },
            { name: "ogImage", label: "Social share image (Open Graph)", type: "image", folder: "misc", help: "1200 × 630px recommended." },
          ],
        },
      ]}
    />
  );
}
