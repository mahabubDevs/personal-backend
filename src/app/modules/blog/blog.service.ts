import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { Blog } from "./blog.model";
import { IBlog } from "./blog.interface";

const createBlogToDB = async (payload: IBlog, files: any) => {
  const isExist = await Blog.findOne({ _id: payload._id });
  if (isExist) throw new ApiError(StatusCodes.BAD_REQUEST, "Slug already exists!");

  // Handle uploaded image
  if (files && files.image && files.image[0]) {
    payload.image = `/images/${files.image[0].filename}`;
  } else {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Image is required for blog creation");
  }

  const newBlog = await Blog.create(payload);
  return newBlog;
};

const updateBlogToDB = async (_id: string, payload: Partial<IBlog>, files: any) => {
  const blog = await Blog.findOne({ _id });
  if (!blog) throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found");

  // Handle image update (replace only if new image uploaded)
  if (files && files.image && files.image[0]) {
    payload.image = `/images/${files.image[0].filename}`;
  }

  const updatedBlog = await Blog.findOneAndUpdate({ _id }, payload, { new: true });
  return updatedBlog;
};

// Get all blogs
const getAllBlogsFromDB = async () => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return blogs;
};

// Get single blog by slug
const getSingleBlogFromDB = async (_id: string) => {
  const blog = await Blog.findOne({ _id });
  console.log("test",blog);
  if (!blog) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found!");
  }
  return blog;
};


// Delete blog
const deleteBlogFromDB = async (_id: string) => {
  const deletedBlog = await Blog.findOneAndDelete({ _id });
  if (!deletedBlog) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found!");
  }
  return deletedBlog;
};

export const BlogService = {
  createBlogToDB,
  getAllBlogsFromDB,
  getSingleBlogFromDB,
  updateBlogToDB,
  deleteBlogFromDB,
};
