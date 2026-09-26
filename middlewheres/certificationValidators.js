import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const requireFileOnCreate = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "file is required" });
  }
  next();
};

export const createCertificationValidators = [
  body("title").trim().notEmpty().withMessage("title is required").isLength({ max: 200 }),
  body("description").optional().isString().isLength({ max: 1000 }).withMessage("description must be at most 1000 characters"),
];

export const updateCertificationValidators = [
  body("title").optional().trim().notEmpty().withMessage("title cannot be empty").isLength({ max: 200 }),
  body("description").optional().isString().isLength({ max: 1000 }).withMessage("description must be at most 1000 characters"),
];
