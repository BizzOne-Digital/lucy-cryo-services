"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function AdminGalleryPage() {
  return (
    <ResourceManager
      resource="gallery"
      title="Gallery"
      singular="Image"
      description="Visible images appear in the “Inside the Experience” section on the homepage. Use the arrows to reorder."
      listTitle="title"
      listSubtitle="alt"
      listImage="image"
      orderable
      badges={[{ field: "visible", on: "Visible", off: "Hidden" }]}
      defaults={{ title: "", alt: "", image: "", visible: true, order: 0 }}
      fields={[
        { name: "image", label: "Gallery image", type: "image", folder: "gallery", required: true },
        { name: "title", label: "Title", type: "text" },
        { name: "alt", label: "Alt text", type: "text", required: true, help: "Describe the image for accessibility." },
        { name: "order", label: "Display order", type: "number" },
        { name: "visible", label: "Visible on website", type: "boolean" },
      ]}
    />
  );
}
