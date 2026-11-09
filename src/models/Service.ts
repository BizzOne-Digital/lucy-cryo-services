import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const SERVICE_ICONS = ["snowflake", "droplet", "activity", "waves", "face", "sparkles", "leaf", "lotus"] as const;

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: "", maxlength: 400 },
    description: { type: String, default: "", maxlength: 6000 },
    benefits: { type: [String], default: [] },
    image: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    price: { type: String, default: "", maxlength: 40 },
    priceNote: { type: String, default: "", maxlength: 80 },
    icon: { type: String, enum: SERVICE_ICONS, default: "sparkles" },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ServiceSchema.index({ active: 1, order: 1 });

export type ServiceDoc = InferSchemaType<typeof ServiceSchema>;
export default (models.Service as mongoose.Model<ServiceDoc>) || model("Service", ServiceSchema);
