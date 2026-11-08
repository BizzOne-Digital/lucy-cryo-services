import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const INQUIRY_STATUSES = ["new", "replied", "closed"] as const;

const ContactInquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40 },
    message: { type: String, required: true, maxlength: 3000 },
    status: { type: String, enum: INQUIRY_STATUSES, default: "new", index: true },
    adminNotes: { type: String, maxlength: 5000 },
  },
  { timestamps: true },
);

ContactInquirySchema.index({ createdAt: -1 });

export type ContactInquiryDoc = InferSchemaType<typeof ContactInquirySchema>;
export default (models.ContactInquiry as mongoose.Model<ContactInquiryDoc>) ||
  model("ContactInquiry", ContactInquirySchema);
