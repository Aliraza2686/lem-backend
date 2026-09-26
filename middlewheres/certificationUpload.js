import multer from "multer";

// Certifications accept documents as well as images, so they can't reuse the
// image-only `upload` middleware. Same memory storage — files go straight to Cloudinary.
export const ALLOWED_CERTIFICATION_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || ALLOWED_CERTIFICATION_MIMETYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Only image, PDF, or Word files are allowed"));
};

const certificationUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

// Wraps multer so a rejected/oversized file returns the usual JSON error shape
// instead of falling through to Express's default HTML error page.
export const certificationFile = (req, res, next) => {
  certificationUpload.single("file")(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "File must be 10MB or smaller" : err.message || "File upload failed";
    return res.status(400).json({ success: false, message });
  });
};

export default certificationUpload;
