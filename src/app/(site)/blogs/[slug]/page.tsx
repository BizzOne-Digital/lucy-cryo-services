import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Info } from "lucide-react";
import { BlogCard } from "@/components/site/BlogCard";
import { RichText } from "@/components/site/RichText";
import { getBlogBySlug, getRelatedBlogs, getSettings } from "@/lib/data";
import { DISCLAIMER } from "@/lib/defaults";
import { resolveImageUrl } from "@/lib/images";
import { formatDate, siteUrl } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlug((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = resolveImageUrl(post.featuredImage);
  return {
    title,
    description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      images: [{ url: image }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogBySlug((await params).slug);
  if (!post) notFound();
  const [related, settings] = await Promise.all([getRelatedBlogs(post), getSettings()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: post.featuredImage?.startsWith("http") ? post.featuredImage : `${siteUrl()}${resolveImageUrl(post.featuredImage)}`,
    author: { "@type": "Organization", name: settings.businessName },
    publisher: { "@type": "Organization", name: settings.businessName },
    mainEntityOfPage: `${siteUrl()}/blogs/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article>
        <header className="bg-linear-to-b from-ice to-white pt-12 pb-10 sm:pt-16">
          <div className="container-lux max-w-4xl">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-navy">
              <ArrowLeft size={16} aria-hidden /> All articles
            </Link>
            <p className="eyebrow mt-6">{post.category}</p>
            <h1 className="heading-serif mt-3 text-4xl leading-tight sm:text-6xl">{post.title}</h1>
            <p className="mt-5 flex items-center gap-2 text-muted">
              <CalendarDays size={16} className="text-teal" aria-hidden />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </p>
          </div>
        </header>

        <div className="container-lux max-w-5xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] shadow-card">
            <Image
              src={resolveImageUrl(post.featuredImage)}
              alt={post.featuredImageAlt || post.title}
              fill
              priority
              sizes="(min-width:1024px) 1000px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-lux max-w-3xl py-12 sm:py-16">
          {post.excerpt && <p className="mb-8 font-serif text-2xl leading-relaxed text-navy italic">{post.excerpt}</p>}
          <RichText content={post.content} />
          <p className="mt-10 flex items-start gap-2 rounded-xl bg-ice px-4 py-3 text-sm text-muted">
            <Info size={16} className="mt-0.5 shrink-0 text-teal" aria-hidden />
            This article is for general information only and is not medical advice. {DISCLAIMER}
          </p>

          <aside className="mt-12 rounded-3xl bg-linear-to-br from-navy to-teal p-8 text-white sm:p-10">
            <h2 className="font-serif text-3xl font-semibold italic">Curious if this treatment is right for you?</h2>
            <p className="mt-3 leading-7 text-white/85">
              Book a personalized consultation and we will walk you through your options.
            </p>
            <Link href="/booking" className="btn-aqua mt-6">
              {settings.bookingCtaText} <ArrowRight size={18} aria-hidden />
            </Link>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-ice py-16 sm:py-20" aria-labelledby="related-heading">
          <div className="container-lux">
            <h2 id="related-heading" className="heading-serif text-center text-4xl">
              Related Articles
            </h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
