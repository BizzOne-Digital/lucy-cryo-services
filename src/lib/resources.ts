import "server-only";
import type { Model } from "mongoose";
import type { ZodType } from "zod";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Promotion from "@/models/Promotion";
import GalleryItem from "@/models/GalleryItem";
import Booking from "@/models/Booking";
import ContactInquiry from "@/models/ContactInquiry";
import {
  blogInput,
  bookingUpdate,
  galleryInput,
  inquiryUpdate,
  promotionInput,
  serviceInput,
} from "./validators";

type ResourceConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  create?: ZodType;
  update: ZodType;
  /** Fields holding /api/uploads URLs – cleaned up when replaced or when the document is deleted. */
  imageFields: string[];
  sort: Record<string, 1 | -1>;
  search: string[];
  statusField?: string;
  /** Optional transform applied to validated data before saving. */
  prepare?: (data: Record<string, unknown>, existing?: Record<string, unknown> | null) => Record<string, unknown>;
};

export const RESOURCES: Record<string, ResourceConfig> = {
  services: {
    model: Service,
    create: serviceInput,
    update: serviceInput,
    imageFields: ["image"],
    sort: { order: 1, createdAt: 1 },
    search: ["title", "slug"],
  },
  blogs: {
    model: BlogPost,
    create: blogInput,
    update: blogInput,
    imageFields: ["featuredImage"],
    sort: { createdAt: -1 },
    search: ["title", "slug", "category"],
    prepare: (data, existing) => {
      const out = { ...data };
      const given = typeof data.publishedAt === "string" && data.publishedAt ? new Date(data.publishedAt) : null;
      if (given && !isNaN(given.getTime())) out.publishedAt = given;
      else if (data.published && !existing?.publishedAt) out.publishedAt = new Date();
      else delete out.publishedAt;
      return out;
    },
  },
  promotions: {
    model: Promotion,
    create: promotionInput,
    update: promotionInput,
    imageFields: ["image"],
    sort: { order: 1, createdAt: -1 },
    search: ["title"],
  },
  gallery: {
    model: GalleryItem,
    create: galleryInput,
    update: galleryInput,
    imageFields: ["image"],
    sort: { order: 1, createdAt: -1 },
    search: ["title", "alt"],
  },
  bookings: {
    model: Booking,
    update: bookingUpdate,
    imageFields: [],
    sort: { createdAt: -1 },
    search: ["name", "email", "phone", "serviceName"],
    statusField: "status",
  },
  inquiries: {
    model: ContactInquiry,
    update: inquiryUpdate,
    imageFields: [],
    sort: { createdAt: -1 },
    search: ["name", "email", "phone", "message"],
    statusField: "status",
  },
};

export function getResource(name: string) {
  return Object.prototype.hasOwnProperty.call(RESOURCES, name) ? RESOURCES[name] : null;
}
