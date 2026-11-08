import mongoose, { Schema, model, models } from "mongoose";

/** Page content keyed by page (e.g. "home"). Values are merged over defaults in lib/defaults.ts. */
const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);

export default (models.SiteContent as mongoose.Model<{ key: string; data: Record<string, unknown> }>) ||
  model("SiteContent", SiteContentSchema);
