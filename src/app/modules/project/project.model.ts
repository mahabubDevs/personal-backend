import mongoose, { Schema, Document } from "mongoose";
import { IProject } from "./project.interface";

export interface IProjectDocument extends IProject, Document {}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String, required: true }],
    demoUrl: { type: String, required: true },
    githubUrl: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    results: [{ type: String, required: true }],
    duration: { type: String, required: true },
    teamSize: { type: String, required: true },
    client: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProjectDocument>("Project", ProjectSchema);
