import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";
import { UPLOAD_FOLDERS } from "@/lib/upload-rules";

const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true, enum: UPLOAD_FOLDERS, index: true },
    filename: { type: String, required: true },
    originalName: { type: String, maxlength: 200 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDoc = InferSchemaType<typeof StoredUploadSchema>;
export default (models.StoredUpload as mongoose.Model<StoredUploadDoc>) || model("StoredUpload", StoredUploadSchema);
