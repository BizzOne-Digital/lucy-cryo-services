import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { BlogItem } from "@/lib/data";
import { resolveImageUrl } from "@/lib/images";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post, priority = false }: { post: BlogItem; priority?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <Link href={`/blogs/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden>
        <Image
          src={resolveImageUrl(post.featuredImage)}
          alt={post.featuredImageAlt || post.title}
          fill
          priority={priority}
          sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-teal uppercase">
          {post.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-sm text-muted">
          <CalendarDays size={15} className="text-teal" aria-hidden />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-snug font-semibold text-navy">
          <Link href={`/blogs/${post.slug}`} className="hover:text-teal">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 leading-7 text-muted">{post.excerpt}</p>
        <Link
          href={`/blogs/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-teal hover:text-navy"
          aria-label={`Read more: ${post.title}`}
        >
          Read More <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
