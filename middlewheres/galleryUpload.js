import upload from "./upload.js";

// Gallery entries are images only, so this reuses the shared image `upload` config.
// Wrapped so a rejected/oversized file returns the usual JSON error shape
// instead of falling through to Express's default HTML error page.
export const galleryImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Image must be 8MB or smaller" : err.message || "Image upload failed";
    return res.status(400).json({ success: false, message });
  });
};
