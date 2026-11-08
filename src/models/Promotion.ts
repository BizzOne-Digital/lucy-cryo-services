import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const PromotionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    image: { type: String, default: "" },
    buttonText: { type: String, maxlength: 60 },
    buttonUrl: { type: String, maxlength: 300 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type PromotionDoc = InferSchemaType<typeof PromotionSchema>;
export default (models.Promotion as mongoose.Model<PromotionDoc>) || model("Promotion", PromotionSchema);
