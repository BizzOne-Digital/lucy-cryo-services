import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Administrator" },
    passwordHash: { type: String, required: true, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>;
export default (models.AdminUser as mongoose.Model<AdminUserDoc>) || model("AdminUser", AdminUserSchema);
