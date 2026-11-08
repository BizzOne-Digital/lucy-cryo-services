import { ClipboardList, Cpu, Crown, HeartHandshake, House, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { HomeContent } from "@/lib/defaults";

const ICONS = [ClipboardList, Sparkles, House, Cpu, HeartHandshake, Crown];

export function WhyChooseUs({ why }: { why: HomeContent["why"] }) {
  const items = why.items.filter((i) => i?.title);
  return (
    <section className="py-20 sm:py-24">
      <div className="container-lux">
        <SectionHeading eyebrow={why.eyebrow} title={why.heading} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={item.title}
                data-reveal style={{ transitionDelay: `${i * 90}ms` }}
                className="group rounded-2xl border border-line bg-white p-7 transition hover:border-aqua hover:shadow-card"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-light text-teal transition group-hover:bg-teal group-hover:text-white">
                  <Icon size={26} strokeWidth={1.4} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-navy">{item.title}</h3>
                <p className="mt-2 leading-7 text-muted">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
