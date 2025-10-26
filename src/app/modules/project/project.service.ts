import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { Project } from "./project.model";
import { IProject } from "./project.interface";

const createProjectToDB = async (payload: IProject, files: any) => {
  if (files && files.image && files.image[0]) {
    payload.image = `/images/${files.image[0].filename}`;
  } else {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Image is required for project creation");
  }

  const newProject = await Project.create(payload);
  return newProject;
};

const updateProjectToDB = async (id: string, payload: Partial<IProject>, files: any) => {
  const project = await Project.findById(id);
  if (!project) throw new ApiError(StatusCodes.NOT_FOUND, "Project not found");

  if (files && files.image && files.image[0]) {
    payload.image = `/images/${files.image[0].filename}`;
  }

  const updatedProject = await Project.findByIdAndUpdate(id, payload, { new: true });
  return updatedProject;
};

const getAllProjectsFromDB = async () => {
  const projects = await Project.find().sort({ createdAt: -1 });
  return projects;
};

const getSingleProjectFromDB = async (id: string) => {
  const project = await Project.findById(id);
  if (!project) throw new ApiError(StatusCodes.NOT_FOUND, "Project not found!");
  return project;
};

const deleteProjectFromDB = async (id: string) => {
  const deletedProject = await Project.findByIdAndDelete(id);
  if (!deletedProject) throw new ApiError(StatusCodes.NOT_FOUND, "Project not found!");
  return deletedProject;
};

export const ProjectService = {
  createProjectToDB,
  updateProjectToDB,
  getAllProjectsFromDB,
  getSingleProjectFromDB,
  deleteProjectFromDB,
};
