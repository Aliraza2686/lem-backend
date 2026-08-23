import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Recursively rejects any string value that looks like a base64/data URI —
// the concrete guard against raw image data being smuggled into MongoDB via
// a JSON field (e.g. variants[].images[].src) instead of going through Cloudinary.
const containsDataUri = (value) => {
  if (typeof value === "string") return /^data:[a-z]+\/[a-z0-9.+-]+;base64,/i.test(value.trim());
  if (Array.isArray(value)) return value.some(containsDataUri);
  if (value && typeof value === "object") return Object.values(value).some(containsDataUri);
  return false;
};

export const rejectDataUris = (req, res, next) => {
  if (containsDataUri(req.body)) {
    return res.status(400).json({
      success: false,
      message: "Raw base64/data-URI image data is not allowed — upload images via the image upload endpoint and reference the returned URL instead.",
    });
  }
  next();
};

const slugPattern = /^[a-z0-9-]+$/;

export const createProductValidators = [
  body("id")
    .trim()
    .notEmpty()
    .withMessage("id is required")
    .matches(slugPattern)
    .withMessage("id must be lowercase letters, numbers, and hyphens only"),
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 200 }),
  body("category").optional().isString().isLength({ max: 100 }),
  body("origin").optional().isString().isLength({ max: 200 }),
  body("desc").optional().isString().isLength({ max: 5000 }),
  body("heroNote").optional().isString().isLength({ max: 300 }),
  body("applications").optional().isArray().withMessage("applications must be an array"),
  body("packaging").optional().isArray().withMessage("packaging must be an array"),
  body("variants").optional().isArray().withMessage("variants must be an array"),
  body("variants.*.key").if(body("variants").exists()).notEmpty().withMessage("each variant needs a key"),
  body("labReports").optional().isArray().withMessage("labReports must be an array"),
];

export const updateProductValidators = [
  body("id").optional().trim().matches(slugPattern).withMessage("id must be lowercase letters, numbers, and hyphens only"),
  body("name").optional().trim().notEmpty().withMessage("name cannot be empty").isLength({ max: 200 }),
  body("category").optional().isString().isLength({ max: 100 }),
  body("origin").optional().isString().isLength({ max: 200 }),
  body("desc").optional().isString().isLength({ max: 5000 }),
  body("heroNote").optional().isString().isLength({ max: 300 }),
  body("applications").optional().isArray().withMessage("applications must be an array"),
  body("packaging").optional().isArray().withMessage("packaging must be an array"),
  body("variants").optional().isArray().withMessage("variants must be an array"),
  body("variants.*.key").if(body("variants").exists()).notEmpty().withMessage("each variant needs a key"),
  body("labReports").optional().isArray().withMessage("labReports must be an array"),
];
