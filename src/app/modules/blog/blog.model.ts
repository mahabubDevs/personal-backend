import mongoose, { Schema, Document } from "mongoose";
import { IBlog } from "./blog.interface";

export interface IBlogDocument extends Omit<IBlog, "_id">, Document {}

const BlogSchema = new Schema<IBlogDocument>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    readTime: { type: String, required: true },
    tags: [{ type: String, required: true }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const Blog = mongoose.model<IBlogDocument>("Blog", BlogSchema);
