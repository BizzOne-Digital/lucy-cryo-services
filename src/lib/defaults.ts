import { unsplash } from "./images";

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export const defaultSettings = {
  businessName: "Lucy CRYO Services",
  brandName: "Lucy Luxe",
  logo: "",
  logoAlt: "Lucy CRYO Services logo",
  phone: "613-709-8764",
  email: "lucy@lucycryoservices.org",
  website: "www.lucycryoservices.org",
  topBarText: "Medical Spa – Home Based Business",
  bookingCtaText: "Book Your Consultation",
  footerDescription:
    "Luxury body contouring, skincare and aesthetic treatments in a private home-based medical spa setting.",
  businessHours: "Monday – Friday: By appointment\nSaturday: By appointment\nSunday: Closed",
  social: { facebook: "", instagram: "", tiktok: "", youtube: "" },
  seoTitle: "Lucy Luxe | Lucy CRYO Services",
  seoDescription:
    "Discover luxury body contouring, skin rejuvenation and non-invasive aesthetic treatments at Lucy CRYO Services.",
  ogImage: "",
};
export type SiteSettings = typeof defaultSettings;

/* ------------------------------------------------------------------ */
/* Homepage content                                                    */
/* ------------------------------------------------------------------ */

// Brand images supplied by the client (optimised WEBP in /public/images/site).
// All of them can be replaced from the admin panel.
const site = (name: string) => `/images/site/${name}.webp`;

export const IMG = {
  hero: site("hero"),
  about: site("about"),
  coolsculpting: site("coolsculpting"),
  hydrofacial: site("hydro-facial"),
  muscle: site("muscle-stimulation"),
  coolwave: site("cryo-coolwave"),
  onda: site("onda-pro"),
  hifu: site("hifu-facelift"),
  blog1: site("coolsculpting"),
  blog2: site("hydro-facial"),
  blog3: unsplash("1598440947619-2c35fc9aa908"),
  promo: site("packages"),
  cta: site("spa-retreat"),
  pagesHero: site("spa-retreat"),
};

/** Stock images used before the client's images were added – replaced automatically in the database. */
export const LEGACY_IMAGE_PREFIX = "https://images.unsplash.com/";

export const defaultHomeContent = {
  hero: {
    heading: "Lucy Luxe",
    subheading: "by Lucy CRYO Services",
    eyebrow: "Advanced Body & Skin Solutions",
    description: "A luxury, results-driven medical spa experience in the comfort of a home-based setting.",
    image: IMG.hero,
    imageAlt: "Confident woman in white activewear relaxing in a bright spa setting",
    primaryCta: "Book Your Consultation",
    secondaryCta: "Explore Services",
    trust1: "Non-Invasive Treatments",
    trust2: "Safe & Effective",
    trust3: "Luxury Experience",
  },
  services: { heading: "Our Services" },
  offers: {
    heading: "Special Offers",
    subheading: "Packages Promotion",
    buttonText: "View Packages",
    ctaHeading: "Ready to Transform?",
    ctaText: "Book your personalized consultation today and discover the right treatment for your goals.",
    ctaButton: "Book Now",
  },
  benefits: {
    item1: "For Women 35–60",
    item2: "Body Contouring",
    item3: "Skin Rejuvenation",
    item4: "Confidence & Wellness",
  },
  about: {
    eyebrow: "About Lucy CRYO Services",
    heading: "Luxury Care. Personalized Results.",
    body:
      "Lucy CRYO Services is a home-based medical spa offering non-invasive body contouring and skincare treatments in a calm, private setting. Every visit begins with a conversation about your goals, so your treatment plan reflects you — not a one-size-fits-all package.\n\nWe combine modern aesthetic technologies with attentive, one-on-one care to create an experience that feels personal, comfortable and refined.",
    bullets: [
      "Personalized consultations",
      "Comfortable, private environment",
      "Modern aesthetic technologies",
      "Individual treatment planning",
    ],
    image: IMG.about,
    imageAlt: "Specialist providing a calming facial treatment in a bright spa room",
    cta: "Discover Our Services",
  },
  featured: {
    eyebrow: "Signature Treatments",
    heading: "Featured Treatments",
    subheading: "A closer look at some of our most requested non-invasive services.",
  },
  why: {
    eyebrow: "The Lucy CRYO Difference",
    heading: "Why Choose Lucy CRYO",
    items: [
      { title: "Personalized Treatment Plans", text: "Your plan is built around your goals, comfort level and schedule." },
      { title: "Non-Invasive Options", text: "Treatments with no surgery, designed to fit into everyday life." },
      { title: "Comfortable Private Setting", text: "A discreet, home-based studio — no crowded waiting rooms." },
      { title: "Modern Aesthetic Technology", text: "Current body and skin technologies selected for quality and care." },
      { title: "Consultation-Based Care", text: "We assess suitability first and recommend only what makes sense for you." },
      { title: "Premium Client Experience", text: "Unhurried appointments with attention to every detail." },
    ],
  },
  promoBanner: {
    heading: "Discover Our Current Treatment Packages",
    text: "Ask about current packages and personalized treatment combinations.",
    buttonText: "View Promotions",
    image: IMG.promo,
  },
  gallery: {
    heading: "Inside the Experience",
    subheading: "A glimpse of the calm, private setting where your treatments take place.",
  },
  blog: {
    eyebrow: "Journal",
    heading: "Beauty & Wellness Insights",
    subheading: "Practical guidance on body contouring, skincare and feeling your best.",
    buttonText: "View All Blogs",
  },
  finalCta: {
    heading: "Your Next Step Starts With a Consultation",
    text: "Tell us about your goals and we'll help you explore the services that may be right for you.",
    buttonText: "Book Your Consultation",
    image: IMG.cta,
  },
  disclaimer: "Results and suitability vary by individual. Consultation is recommended.",
};
export type HomeContent = typeof defaultHomeContent;

/* ------------------------------------------------------------------ */
/* Pages content (services / blogs / booking / contact heroes)         */
/* ------------------------------------------------------------------ */

export const defaultPagesContent = {
  services: {
    heading: "Advanced Body & Skin Treatments",
    text:
      "Personalized, non-invasive aesthetic services delivered in a private, comfortable setting. Every treatment begins with a consultation so we can understand your goals and recommend options that suit you.",
    image: IMG.pagesHero,
  },
  blogs: {
    heading: "Beauty & Wellness Insights",
    text: "Helpful articles on body contouring, skin health and confident living.",
  },
  booking: {
    heading: "Book Your Consultation",
    text: "Share a few details and your preferred time. We will confirm your appointment personally.",
  },
  contact: {
    heading: "We'd Love to Hear From You",
    text: "Questions about a treatment, pricing or availability? Send us a message and we will respond as soon as possible.",
  },
};
export type PagesContent = typeof defaultPagesContent;

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

export const DISCLAIMER = "Results and suitability vary by individual. Consultation is recommended.";

export const seedServices = [
  {
    title: "CoolSculpting",
    slug: "coolsculpting",
    price: "$99",
    priceNote: "per applicator",
    icon: "snowflake",
    image: IMG.coolsculpting,
    imageAlt: "Woman receiving a cooling body contouring treatment on the abdomen",
    featured: true,
    shortDescription: "A non-invasive cooling treatment designed to target stubborn areas of fat.",
    description:
      "CoolSculpting uses controlled cooling to target stubborn areas of fat that may not respond to diet and exercise alone. It is a non-surgical option for people looking to refine specific areas of the body. During your consultation we review your goals and the areas you would like to address to determine whether this treatment is suitable for you.",
    benefits: ["Non-surgical and non-invasive", "Designed to target specific problem areas", "No incisions or needles", "Typically little to no downtime"],
  },
  {
    title: "Hydro Facial",
    slug: "hydro-facial",
    price: "$99",
    priceNote: "",
    icon: "droplet",
    image: IMG.hydrofacial,
    imageAlt: "Woman relaxing during a Hydro Facial treatment",
    featured: false,
    shortDescription: "A multi-step facial to cleanse, exfoliate and hydrate the skin.",
    description:
      "The Hydro Facial is a multi-step treatment that cleanses, gently exfoliates and hydrates the skin. It is designed to leave skin feeling refreshed and looking more radiant, and can be tailored to different skin types and concerns.",
    benefits: ["Deep cleansing and gentle exfoliation", "Intensive hydration", "May help skin look brighter and smoother", "Suitable as a regular skincare treatment"],
  },
  {
    title: "Muscle Stimulation",
    slug: "muscle-stimulation",
    price: "$99",
    priceNote: "for 4 sessions",
    icon: "activity",
    image: IMG.muscle,
    imageAlt: "Muscle stimulation pads placed on the abdomen",
    featured: false,
    shortDescription: "Non-invasive muscle stimulation designed to support tone and definition.",
    description:
      "Muscle stimulation treatments use electromagnetic or electrical energy to cause muscle contractions while you relax. The treatment is designed to support muscle tone and definition in areas such as the abdomen and buttocks, and can complement an active lifestyle.",
    benefits: ["Relaxing, non-invasive sessions", "Designed to support muscle tone", "Can complement fitness routines", "No recovery period for most clients"],
  },
  {
    title: "CRYO Coolwave",
    slug: "cryo-coolwave",
    price: "$150",
    priceNote: "per treatment",
    icon: "snowflake",
    image: IMG.coolwave,
    imageAlt: "Specialist performing a CRYO cooling body treatment",
    featured: false,
    shortDescription: "A cooling body treatment designed to support contouring and skin appearance.",
    description:
      "CRYO Coolwave combines cooling technology with targeted treatment of the body. It is designed to support body contouring goals and the appearance of the skin in treated areas. Your consultation will help determine whether CRYO Coolwave is the right fit for you.",
    benefits: ["Non-invasive cooling treatment", "Designed to support contouring goals", "Comfortable treatment experience", "Can be combined with other services"],
  },
  {
    title: "Onda Pro Treatment",
    slug: "onda-pro-treatment",
    price: "",
    priceNote: "",
    icon: "waves",
    image: IMG.onda,
    imageAlt: "Onda Pro body contouring treatment on the thigh",
    featured: true,
    shortDescription: "Advanced microwave technology designed for body contouring and skin texture.",
    description:
      "Onda Pro uses microwave-based technology designed to address localized fat and the appearance of skin texture, including cellulite. It is a non-surgical option for clients looking to refine body contours. Suitability and treatment plans are discussed during your consultation.",
    benefits: ["Non-surgical body contouring option", "Designed to address localized areas", "May help improve the appearance of skin texture", "Personalized treatment plans"],
  },
  {
    title: "HIFU Facelift",
    slug: "hifu-facelift",
    price: "$99",
    priceNote: "HIFU 7D",
    icon: "face",
    image: IMG.hifu,
    imageAlt: "Non-surgical HIFU facial lift treatment along the jawline",
    featured: true,
    shortDescription: "A non-surgical treatment using focused ultrasound to support firmer-looking skin.",
    description:
      "HIFU (High-Intensity Focused Ultrasound) is a non-surgical aesthetic treatment that delivers focused ultrasound energy beneath the skin's surface. It is designed to support the appearance of firmer, more lifted-looking skin on the face and neck, without incisions.",
    benefits: ["Non-surgical facial treatment", "No incisions", "Designed to support firmer-looking skin", "Typically minimal downtime"],
  },
].map((s, i) => ({ ...s, order: i + 1, active: true }));

export const seedBlogs = [
  {
    title: "What to Expect at Your First Body Contouring Consultation",
    slug: "what-to-expect-first-body-contouring-consultation",
    category: "Body Contouring",
    featuredImage: IMG.blog1,
    featuredImageAlt: "Body contouring treatment in a bright spa room",
    excerpt:
      "Feeling unsure about your first visit? Here is how a consultation works, what we will ask and how we help you choose the right treatment.",
    content:
      "A consultation is the most important part of any treatment plan. It gives us time to understand your goals and gives you time to ask questions.\n\n## Before your visit\n\nThink about the areas you would like to focus on and what you hope to achieve. There are no wrong answers.\n\n## During the consultation\n\n- We discuss your goals and any concerns\n- We review your health history to check suitability\n- We explain the treatment options that may suit you\n- We outline a realistic plan and timeline\n\n## After the consultation\n\nThere is no pressure to book on the spot. Take the time you need. Results and suitability vary by individual, which is why a personalized approach matters.",
  },
  {
    title: "Hydro Facial: A Simple Way to Refresh Your Skin",
    slug: "hydro-facial-refresh-your-skin",
    category: "Skincare",
    featuredImage: IMG.blog2,
    featuredImageAlt: "Woman enjoying a Hydro Facial treatment",
    excerpt:
      "Learn how a Hydro Facial cleanses, exfoliates and hydrates — and why many clients include it in their regular skincare routine.",
    content:
      "The Hydro Facial is one of the most popular skincare treatments because it is gentle, relaxing and suitable for many skin types.\n\n## How it works\n\nThe treatment follows several steps: cleansing, gentle exfoliation, extraction and hydration. Each step is designed to prepare the skin for the next.\n\n## Who it may suit\n\nMany clients choose it before special events or as part of a regular routine. Your provider will tailor the treatment to your skin.\n\n## Aftercare tips\n\n- Keep skin hydrated\n- Use sunscreen daily\n- Avoid harsh exfoliants for a few days",
  },
  {
    title: "Non-Invasive Treatments and Confidence After 35",
    slug: "non-invasive-treatments-confidence-after-35",
    category: "Wellness",
    featuredImage: IMG.blog3,
    featuredImageAlt: "Minimal skincare product on soft fabric",
    excerpt:
      "Our bodies and skin change over time. Here is a balanced look at how non-invasive treatments can fit into a healthy self-care routine.",
    content:
      "Feeling confident is personal. For many women, non-invasive treatments are one part of a broader self-care routine that also includes sleep, nutrition and movement.\n\n## Realistic expectations\n\nNon-invasive treatments are designed to support your goals, not replace healthy habits. Individual results vary.\n\n## Choosing the right option\n\nBody contouring, skin rejuvenation and muscle toning each address different goals. A consultation helps you understand which option, if any, may suit you.\n\n## Taking the first step\n\nIf you are curious, start with a conversation. You will leave with clear information and no obligation.",
  },
].map((b, i) => ({
  ...b,
  published: true,
  publishedAt: new Date(Date.UTC(2026, 9, 20 - i * 9)),
}));

export const seedPromotions = [
  {
    title: "Packages Promotion",
    subtitle: "Personalized treatment combinations",
    description:
      "Ask about current treatment packages that combine body contouring and skin rejuvenation services at special package pricing.",
    image: IMG.promo,
    buttonText: "Book a Consultation",
    buttonUrl: "/booking",
    active: true,
    order: 1,
  },
];
