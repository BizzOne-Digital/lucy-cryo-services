"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Adds "is-visible" to [data-reveal] elements as they scroll into view. One observer for the whole page. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add("is-visible");
            io.unobserve(el);
            // Clear the stagger delay afterwards so hover effects respond instantly.
            if (el.style.transitionDelay) setTimeout(() => (el.style.transitionDelay = ""), 1400);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
