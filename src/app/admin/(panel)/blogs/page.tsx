"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";

export default function AdminBlogsPage() {
  return (
    <ResourceManager
      resource="blogs"
      title="Blogs"
      singular="Article"
      description="Create, edit and publish articles. Click a status badge to publish or unpublish."
      listTitle="title"
      listSubtitle="category"
      listImage="featuredImage"
      badges={[{ field: "published", on: "Published", off: "Draft" }]}
      publicUrl={(i) => (i.published ? `/blogs/${i.slug}` : null)}
      defaults={{
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        featuredImageAlt: "",
        category: "Wellness",
        published: false,
        publishedAt: null,
        seoTitle: "",
        seoDescription: "",
      }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, full: true },
        { name: "slug", label: "Slug", type: "slug", required: true, slugFrom: "title" },
        { name: "category", label: "Category", type: "text" },
        { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, maxLength: 600, help: "Short summary shown on blog cards." },
        {
          name: "content",
          label: "Content",
          type: "textarea",
          rows: 14,
          help: "Separate paragraphs with a blank line. Use “## ” for headings, “### ” for sub-headings, “- ” for bullet points and **bold** text.",
        },
        { name: "featuredImage", label: "Featured image", type: "image", folder: "pages" },
        { name: "featuredImageAlt", label: "Featured image alt text", type: "text" },
        { name: "publishedAt", label: "Publish date", type: "date", help: "Leave empty to use today when publishing." },
        { name: "published", label: "Published", type: "boolean" },
        { name: "seoTitle", label: "SEO meta title", type: "text", maxLength: 120, help: "Optional. Defaults to the article title (aim for under 60 characters)." },
        { name: "seoDescription", label: "SEO meta description", type: "textarea", rows: 2, maxLength: 320, help: "Optional. Defaults to the excerpt (aim for 140–160 characters)." },
      ]}
    />
  );
}
