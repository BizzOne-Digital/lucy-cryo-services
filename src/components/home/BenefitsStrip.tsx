import { Flower2, Leaf, Users } from "lucide-react";
import { BodyContour } from "@/components/site/icons";
import type { HomeContent } from "@/lib/defaults";

export function BenefitsStrip({ benefits }: { benefits: HomeContent["benefits"] }) {
  const items = [
    { Icon: Users, label: benefits.item1 },
    { Icon: BodyContour, label: benefits.item2 },
    { Icon: Leaf, label: benefits.item3 },
    { Icon: Flower2, label: benefits.item4 },
  ];
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-navy-deep via-navy to-teal text-white" aria-label="Who we help">
      <svg aria-hidden viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-20">
        <path d="M0 60C200 20 400 70 600 40s400-30 600 10v30H0z" fill="#36D6CB" />
      </svg>
      <ul className="container-lux relative grid grid-cols-2 gap-y-6 py-7 lg:grid-cols-4">
        {items.map(({ Icon, label }, i) => (
          <li
            key={label}
            className={`flex items-center justify-center gap-3 px-2 text-center text-[15px] font-medium sm:text-lg ${
              i > 0 ? "lg:border-l lg:border-white/30" : ""
            }`}
          >
            <Icon size={36} strokeWidth={1.2} className="shrink-0 text-aqua-soft" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
