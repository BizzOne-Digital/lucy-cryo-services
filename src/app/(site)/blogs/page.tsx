import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { BlogCard } from "@/components/site/BlogCard";
import { PageHero } from "@/components/site/PageHero";
import { getBlogs, getPagesContent } from "@/lib/data";
import { resolveImageUrl } from "@/lib/images";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blogs",
  description: "Beauty, skincare, body contouring and wellness insights from Lucy CRYO Services.",
  alternates: { canonical: "/blogs" },
};

const PER_PAGE = 9;

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Math.min(500, Number(sp.page) || 1));
  const [{ items, total }, pages] = await Promise.all([getBlogs(page, PER_PAGE), getPagesContent()]);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const [featured, ...rest] = items;

  return (
    <>
      <PageHero eyebrow="Journal" title={pages.blogs.heading} text={pages.blogs.text} />

      <div className="container-lux py-16 sm:py-20">
        {!featured ? (
          <p className="py-16 text-center text-lg text-muted">New articles are coming soon. Please check back shortly.</p>
        ) : (
          <>
            {page === 1 && (
              <article className="group mb-14 grid overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-line lg:grid-cols-2">
                <Link href={`/blogs/${featured.slug}`} className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[380px]" tabIndex={-1} aria-hidden>
                  <Image
                    src={resolveImageUrl(featured.featuredImage)}
                    alt={featured.featuredImageAlt || featured.title}
                    fill
                    priority
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <p className="eyebrow">Featured · {featured.category}</p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight font-semibold text-navy">
                    <Link href={`/blogs/${featured.slug}`} className="hover:text-teal">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-4 leading-8 text-muted">{featured.excerpt}</p>
                  <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                    <CalendarDays size={15} className="text-teal" aria-hidden />
                    {formatDate(featured.publishedAt)}
                  </p>
                  <Link href={`/blogs/${featured.slug}`} className="btn-primary mt-7 self-start">
                    Read Article <ArrowRight size={18} aria-hidden />
                  </Link>
                </div>
              </article>
            )}

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {(page === 1 ? rest : items).map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Blog pagination" className="mt-14 flex items-center justify-center gap-3">
                {page > 1 ? (
                  <Link href={`/blogs?page=${page - 1}`} className="btn-outline">
                    <ArrowLeft size={17} aria-hidden /> Newer
                  </Link>
                ) : null}
                <span className="px-3 text-sm text-muted">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={`/blogs?page=${page + 1}`} className="btn-outline">
                    Older <ArrowRight size={17} aria-hidden />
                  </Link>
                ) : null}
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
