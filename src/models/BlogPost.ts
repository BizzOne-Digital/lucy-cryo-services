import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "", maxlength: 600 },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    featuredImageAlt: { type: String, default: "" },
    category: { type: String, default: "Wellness", trim: true, maxlength: 60 },
    published: { type: Boolean, default: false, index: true },
    publishedAt: Date,
    seoTitle: { type: String, maxlength: 120 },
    seoDescription: { type: String, maxlength: 320 },
  },
  { timestamps: true },
);

BlogPostSchema.index({ published: 1, publishedAt: -1 });

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;
export default (models.BlogPost as mongoose.Model<BlogPostDoc>) || model("BlogPost", BlogPostSchema);
