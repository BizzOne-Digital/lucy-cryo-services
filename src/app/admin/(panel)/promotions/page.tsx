"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function AdminPromotionsPage() {
  return (
    <ResourceManager
      resource="promotions"
      title="Promotions"
      singular="Promotion"
      description="Packages shown in the Special Offers strip (first active promotion) and on Services → Packages & Promotions."
      listTitle="title"
      listSubtitle="subtitle"
      listImage="image"
      orderable
      badges={[{ field: "active", on: "Active", off: "Inactive" }]}
      publicUrl={() => "/services#packages"}
      defaults={{ title: "", subtitle: "", description: "", image: "", buttonText: "Book a Consultation", buttonUrl: "/booking", active: true, order: 0 }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "subtitle", label: "Subtitle", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 4, help: "Describe the package. Avoid guaranteed-result claims." },
        { name: "image", label: "Promotion image", type: "image", folder: "pages" },
        { name: "buttonText", label: "Button text", type: "text" },
        { name: "buttonUrl", label: "Button link", type: "text", help: "E.g. /booking, /contact or a full https:// link." },
        { name: "order", label: "Display order", type: "number" },
        { name: "active", label: "Active", type: "boolean" },
      ]}
    />
  );
}
