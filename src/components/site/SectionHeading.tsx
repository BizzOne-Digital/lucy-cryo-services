import { cn } from "@/lib/utils";

/** Centered serif heading with aqua/navy decorative lines (matches "Our Services" in the mockup). */
export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  as: Tag = "h2",
  light = false,
  className,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  as?: "h1" | "h2";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-3", light && "text-aqua")}>{eyebrow}</p>}
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <span aria-hidden className="hidden h-px w-12 bg-linear-to-r from-transparent to-teal sm:block sm:w-20" />
        <Tag className={cn("heading-serif text-4xl leading-tight sm:text-5xl", light && "text-white")}>{title}</Tag>
        <span aria-hidden className="hidden h-px w-12 bg-linear-to-l from-transparent to-navy sm:block sm:w-20" />
      </div>
      {subtitle && <p className={cn("mt-4 text-lg leading-8", light ? "text-white/80" : "text-muted")}>{subtitle}</p>}
    </div>
  );
}
