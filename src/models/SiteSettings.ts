import mongoose, { Schema, model, models } from "mongoose";

/** Singleton document (key = "main"). Values are merged over defaults in lib/defaults.ts. */
const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);

export default (models.SiteSettings as mongoose.Model<{ key: string; data: Record<string, unknown> }>) ||
  model("SiteSettings", SiteSettingsSchema);
