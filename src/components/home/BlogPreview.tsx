import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/site/BlogCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { BlogItem } from "@/lib/data";
import type { HomeContent } from "@/lib/defaults";

export function BlogPreview({ content, posts }: { content: HomeContent["blog"]; posts: BlogItem[] }) {
  if (!posts.length) return null;
  return (
    <section className="bg-ice py-20 sm:py-24">
      <div className="container-lux">
        <SectionHeading eyebrow={content.eyebrow} title={content.heading} subtitle={content.subheading} />
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <div key={p._id} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <BlogCard post={p} />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/blogs" className="btn-outline">
            {content.buttonText} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
