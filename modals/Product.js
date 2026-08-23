import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
      // Cloudinary/CDN URLs only — blocks raw base64/data-URIs from being persisted.
      validate: {
        validator: (v) => /^https?:\/\//i.test(v),
        message: "image src must be an http(s) URL, not raw file/base64 data",
      },
    },
    publicId: { type: String }, // Cloudinary public_id, set when uploaded via this API
    is_video: { type: Boolean, default: false },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: String,
    swatch: String,
    desc: String,
    purity: String,
    quality: String,
    highlights: [String],
    images: [imageSchema],
  },
  { _id: false }
);

const labReportSchema = new mongoose.Schema(
  {
    name: String,
    file: String,
    size: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: String,
    origin: String,
    desc: String,
    heroNote: String,
    applications: [String],
    packaging: [String],
    variants: [variantSchema],
    labReports: [labReportSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
