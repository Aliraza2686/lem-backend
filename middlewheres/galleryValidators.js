import { body } from "express-validator";

export { handleValidationErrors } from "./certificationValidators.js";

export const requireImageOnCreate = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "image is required" });
  }
  next();
};

export const createGalleryValidators = [
  body("title").trim().notEmpty().withMessage("title is required").isLength({ max: 200 }),
  body("description").optional().isString().isLength({ max: 1000 }).withMessage("description must be at most 1000 characters"),
];

export const updateGalleryValidators = [
  body("title").optional().trim().notEmpty().withMessage("title cannot be empty").isLength({ max: 200 }),
  body("description").optional().isString().isLength({ max: 1000 }).withMessage("description must be at most 1000 characters"),
];

export const reorderGalleryValidators = [
  body("items").isArray({ min: 1 }).withMessage("items must be a non-empty array"),
  body("items.*.id").isMongoId().withMessage("each item needs a valid id"),
  body("items.*.displayOrder").isInt({ min: 0 }).withMessage("displayOrder must be a non-negative integer").toInt(),
];
