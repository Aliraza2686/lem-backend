import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
    // Derived server-side from the uploaded file's mimetype — never client-supplied.
    fileType: {
      type: String,
      enum: ["image", "file"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Certification", certificationSchema);
