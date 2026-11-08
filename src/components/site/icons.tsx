import {
  Activity,
  Droplet,
  Flower2,
  Leaf,
  ScanFace,
  Snowflake,
  Sparkles,
  Waves,
  type LucideProps,
} from "lucide-react";

type P = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24, rest: P = {}) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

/** Lotus with snowflake – the brand mark. */
export function LotusMark({ size = 48, ...rest }: P) {
  return (
    <svg {...base(size, rest)} viewBox="0 0 64 64" strokeWidth={2}>
      <path d="M32 50c-6-4-9.5-9.5-9.5-16 0-4.5 2.5-9 9.5-15 7 6 9.5 10.5 9.5 15 0 6.5-3.5 12-9.5 16z" />
      <path d="M32 50c-9.5 0-18-4.5-21-13 5.5-2 12-1 16.5 3.5M32 50c9.5 0 18-4.5 21-13-5.5-2-12-1-16.5 3.5" />
      <path d="M32 50c-12 1-21-1-26-6M32 50c12 1 21-1 26-6" opacity=".7" />
      <path d="M32 4v14M26 8l12 6M38 8l-12 6M29.5 5.5 32 8l2.5-2.5M29.5 16.5 32 14l2.5 2.5" />
    </svg>
  );
}

/** Female body silhouette line used for "Body Contouring" accents. */
export function BodyContour({ size = 24, ...rest }: P) {
  return (
    <svg {...base(size, rest)}>
      <path d="M9 2c1 3 .5 5-1 7s-2 5-.5 8-1 5-1 5" />
      <path d="M15 2c-1 3-.5 5 1 7s2 5 .5 8 1 5 1 5" />
    </svg>
  );
}

export function FacebookIcon(p: P) {
  return (
    <svg {...base(p.size ?? 20, p)}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3h2v9h3v-9h2.5l.5-3h-3V7a1 1 0 0 1 1-1H15z" />
    </svg>
  );
}
export function InstagramIcon(p: P) {
  return (
    <svg {...base(p.size ?? 20, p)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </svg>
  );
}
export function TikTokIcon(p: P) {
  return (
    <svg {...base(p.size ?? 20, p)}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 3 2.5 5 5.5 5" />
    </svg>
  );
}
export function YoutubeIcon(p: P) {
  return (
    <svg {...base(p.size ?? 20, p)}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3z" />
    </svg>
  );
}

const SERVICE_ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  snowflake: Snowflake,
  droplet: Droplet,
  activity: Activity,
  waves: Waves,
  face: ScanFace,
  sparkles: Sparkles,
  leaf: Leaf,
  lotus: Flower2,
};

export function ServiceIcon({ name, className, size = 28 }: { name?: string; className?: string; size?: number }) {
  const Icon = SERVICE_ICON_MAP[name || ""] ?? Sparkles;
  return <Icon className={className} size={size} strokeWidth={1.4} aria-hidden />;
}

/** Flowing aqua ribbon used behind hero imagery and section dividers. */
export function AquaRibbon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 900 400" fill="none" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="rib-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#36D6CB" stopOpacity="0" />
          <stop offset=".35" stopColor="#36D6CB" stopOpacity=".55" />
          <stop offset=".75" stopColor="#7FE3DC" stopOpacity=".45" />
          <stop offset="1" stopColor="#36D6CB" stopOpacity=".1" />
        </linearGradient>
        <linearGradient id="rib-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9BE9E3" stopOpacity="0" />
          <stop offset=".5" stopColor="#9BE9E3" stopOpacity=".6" />
          <stop offset="1" stopColor="#DDF8F6" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <path d="M0 330C160 300 260 210 400 220s250 120 360 70 140-120 140-120v40c-20 30-60 110-160 140-120 36-220-60-350-60S90 340 0 360z" fill="url(#rib-a)" />
      <path d="M0 300c180-30 280-130 420-110s220 110 330 80 150-90 150-90v18c-30 30-70 80-160 100-120 26-200-70-330-80S120 300 0 320z" fill="url(#rib-b)" />
    </svg>
  );
}
