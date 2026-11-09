import { cn } from "@/lib/utils";

/** Displays a service price ("$99 per applicator"). Renders nothing when no price is set. */
export function PriceTag({
  price,
  note,
  size = "sm",
  className,
}: {
  price?: string;
  note?: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  if (!price) return null;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-1.5", className)}>
      <span className={cn("font-bold text-teal", size === "lg" ? "font-serif text-4xl" : "text-base")}>{price}</span>
      {note && <span className={cn("text-muted", size === "lg" ? "text-base" : "text-xs")}>{note}</span>}
    </p>
  );
}
