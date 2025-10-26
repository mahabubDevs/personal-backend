import express from "express";
import { ProjectController } from "./project.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";

const router = express.Router();

// Public Routes
router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getSingleProject);

// Admin Routes
router.post(
  "/create",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  ProjectController.createProject
);

router.patch(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  ProjectController.updateProject
);

router.delete(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
