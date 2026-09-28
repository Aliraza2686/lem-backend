import express from "express";
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGallery,
} from "../controllers/galleryController.js";
import auth from "../middlewheres/auth.js";
import requireRole from "../middlewheres/requireRole.js";
import { galleryImage } from "../middlewheres/galleryUpload.js";
import {
  createGalleryValidators,
  updateGalleryValidators,
  reorderGalleryValidators,
  requireImageOnCreate,
  handleValidationErrors,
} from "../middlewheres/galleryValidators.js";

const router = express.Router();

router.get("/", getGallery);

router.post(
  "/",
  auth,
  requireRole("admin", "editor"),
  galleryImage,
  requireImageOnCreate,
  createGalleryValidators,
  handleValidationErrors,
  createGalleryItem
);

// Declared before /:id so "reorder" is never treated as an id.
router.patch(
  "/reorder",
  auth,
  requireRole("admin", "editor"),
  reorderGalleryValidators,
  handleValidationErrors,
  reorderGallery
);

router.put(
  "/:id",
  auth,
  requireRole("admin", "editor"),
  galleryImage,
  updateGalleryValidators,
  handleValidationErrors,
  updateGalleryItem
);

router.delete("/:id", auth, requireRole("admin"), deleteGalleryItem);

export default router;
