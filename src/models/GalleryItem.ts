import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    title: { type: String, default: "", maxlength: 160 },
    alt: { type: String, default: "", maxlength: 240 },
    image: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type GalleryItemDoc = InferSchemaType<typeof GalleryItemSchema>;
export default (models.GalleryItem as mongoose.Model<GalleryItemDoc>) || model("GalleryItem", GalleryItemSchema);
