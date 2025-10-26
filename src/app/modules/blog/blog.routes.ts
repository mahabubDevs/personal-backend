import express from "express";
import { BlogController } from "./blog.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";

const router = express.Router();

// Public Routes
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getSingleBlog);

// Admin Routes
router.post(
  "/create",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  BlogController.createBlog
);

router.patch(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  fileUploadHandler(),
  BlogController.updateBlog
);

router.delete(
  "/:id",
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BlogController.deleteBlog
);

export const BlogRoutes = router;
