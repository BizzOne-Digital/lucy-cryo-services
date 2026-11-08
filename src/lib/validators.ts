import { z } from "zod";
import { BOOKING_STATUSES } from "@/models/Booking";
import { INQUIRY_STATUSES } from "@/models/ContactInquiry";
import { SERVICE_ICONS } from "@/models/Service";

const text = (max: number) => z.string().trim().max(max);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

/** Image fields accept uploaded URLs, site-relative paths, or https URLs. */
export const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Invalid image URL")
  .refine((v) => !v.startsWith("//"), "Invalid image URL");

const linkUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || /^https?:\/\//.test(v) || v.startsWith("#"), "Invalid link");

const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(40)
  .regex(/^[0-9+().\-\s]+$/, "Please enter a valid phone number");

/* -------------------------------- public ---------------------------------- */

export const bookingInput = z.object({
  name: text(120).min(2, "Please enter your full name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  phone,
  serviceId: z.string().trim().max(40).optional().default(""),
  serviceName: text(160).min(1, "Please choose a service"),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date")
    .refine((v) => {
      const d = new Date(`${v}T00:00:00Z`);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return !isNaN(d.getTime()) && d.getTime() >= today.getTime() - 86_400_000;
    }, "Please choose a future date"),
  preferredTime: text(40).min(1, "Please choose a time"),
  message: text(3000).optional().default(""),
  source: text(120).optional().default(""),
  website: z.string().max(0).optional(), // honeypot – must stay empty
});

export const contactInput = z.object({
  name: text(120).min(2, "Please enter your name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  phone: z.union([z.literal(""), phone]).optional().default(""),
  message: text(3000).min(10, "Please write a short message (10+ characters)"),
  website: z.string().max(0).optional(),
});

/* --------------------------------- admin ---------------------------------- */

export const serviceInput = z.object({
  title: text(120).min(2, "Title is required"),
  slug,
  shortDescription: text(400).default(""),
  description: text(6000).default(""),
  benefits: z.array(text(200)).max(20).default([]).transform((a) => a.filter(Boolean)),
  image: imageUrl.default(""),
  imageAlt: text(240).default(""),
  icon: z.enum(SERVICE_ICONS).default("sparkles"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const blogInput = z.object({
  title: text(200).min(2, "Title is required"),
  slug,
  excerpt: text(600).default(""),
  content: z.string().max(100_000).default(""),
  featuredImage: imageUrl.default(""),
  featuredImageAlt: text(240).default(""),
  category: text(60).default("Wellness"),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  seoTitle: text(120).optional().default(""),
  seoDescription: text(320).optional().default(""),
});

export const promotionInput = z.object({
  title: text(160).min(2, "Title is required"),
  subtitle: text(200).optional().default(""),
  description: text(2000).optional().default(""),
  image: imageUrl.optional().default(""),
  buttonText: text(60).optional().default(""),
  buttonUrl: linkUrl.optional().default(""),
  active: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const galleryInput = z.object({
  title: text(160).default(""),
  alt: text(240).default(""),
  image: imageUrl.refine((v) => v !== "", "Image is required"),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const bookingUpdate = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  adminNotes: text(5000).optional(),
});

export const inquiryUpdate = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  adminNotes: text(5000).optional(),
});

/**
 * Free-form content documents (settings/home/pages) are validated structurally:
 * plain objects, arrays and strings/booleans/numbers only, with size limits.
 */
export function sanitizeContent(value: unknown, depth = 0): unknown {
  if (depth > 6) throw new Error("Content is nested too deeply.");
  if (typeof value === "string") return value.slice(0, 10_000);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => sanitizeContent(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (!/^[a-zA-Z0-9_]{1,40}$/.test(k)) continue; // blocks $operators and dotted keys
      out[k] = sanitizeContent(v, depth + 1);
    }
    return out;
  }
  return "";
}
