import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const requireCoverImageOnCreate = (req, res, next) => {
  const hasFile = req.files?.coverImage?.[0];
  const hasExistingUrl = req.body.coverImageUrl; // allow passing an already-hosted url
  if (!hasFile && !hasExistingUrl) {
    return res.status(400).json({ success: false, message: "coverImage file is required" });
  }
  next();
};

export const createArticleValidators = [
  body("title").trim().notEmpty().withMessage("title is required").isLength({ max: 200 }),
  body("content").trim().isLength({ min: 50 }).withMessage("content must be at least 50 characters"),
  body("excerpt").optional().isLength({ max: 300 }).withMessage("excerpt must be at most 300 characters"),
  body("status").optional().isIn(["draft", "published", "archived"]).withMessage("invalid status"),
  body("category").optional().isString().trim(),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
];

export const updateArticleValidators = [
  body("title").optional().trim().notEmpty().withMessage("title cannot be empty").isLength({ max: 200 }),
  body("content").optional().trim().isLength({ min: 50 }).withMessage("content must be at least 50 characters"),
  body("excerpt").optional().isLength({ max: 300 }).withMessage("excerpt must be at most 300 characters"),
  body("status").optional().isIn(["draft", "published", "archived"]).withMessage("invalid status"),
  body("category").optional().isString().trim(),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
];
