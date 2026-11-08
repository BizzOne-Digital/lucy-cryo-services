import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const BookingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    serviceName: { type: String, required: true, maxlength: 160 },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true, maxlength: 40 },
    message: { type: String, maxlength: 3000 },
    source: { type: String, maxlength: 120 },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    adminNotes: { type: String, maxlength: 5000 },
    // Ready for future email integration (e.g. Resend / SendGrid).
    notificationSentAt: Date,
  },
  { timestamps: true },
);

BookingSchema.index({ createdAt: -1 });

export type BookingDoc = InferSchemaType<typeof BookingSchema>;
export default (models.Booking as mongoose.Model<BookingDoc>) || model("Booking", BookingSchema);
