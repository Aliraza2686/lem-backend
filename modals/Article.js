import mongoose from "mongoose";
import slugify from "slugify";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: String,
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      url: String,
      publicId: String,
    },
    gallery: [imageSchema],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      index: true,
    },
    tags: {
      type: [String],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    readTime: Number,
    wordCount: Number,
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    publishedAt: Date,
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

articleSchema.pre("save", async function () {
  if (this.isModified("title") && !this.slug) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let candidate = baseSlug;
    let counter = 1;

    const Article = this.constructor;
    while (
      await Article.exists({ slug: candidate, _id: { $ne: this._id } })
    ) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }

    this.slug = candidate;
  }

  if (this.isModified("content")) {
    const plainText = this.content.replace(/<[^>]*>/g, " ");
    const words = plainText.trim().split(/\s+/).filter(Boolean);
    this.wordCount = words.length;
    this.readTime = Math.max(1, Math.ceil(words.length / 200));
  }

  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.model("Article", articleSchema);
