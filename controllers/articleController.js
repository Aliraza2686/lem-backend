import Article from "../modals/Article.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { parseArrayField } from "../utils/parseArrayField.js";

const isStaff = (req) => req.user && ["admin", "editor"].includes(req.user.role);

// Fields a client is allowed to set directly — protects against mass assignment.
const ALLOWED_FIELDS = [
  "title",
  "excerpt",
  "content",
  "category",
  "status",
  "isFeatured",
];

const applyAllowedFields = (article, body) => {
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      article[field] = field === "isFeatured" ? body[field] === true || body[field] === "true" : body[field];
    }
  }

  const tags = parseArrayField(body.tags);
  if (tags !== undefined) article.tags = tags;

  if (body.metaTitle !== undefined || body.metaDescription !== undefined || body.keywords !== undefined) {
    article.seo = article.seo || {};
    if (body.metaTitle !== undefined) article.seo.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) article.seo.metaDescription = body.metaDescription;
    const keywords = parseArrayField(body.keywords);
    if (keywords !== undefined) article.seo.keywords = keywords;
  }
};

// POST /api/articles
export const createArticle = async (req, res) => {
  let uploadedCover;
  let uploadedGallery = [];

  try {
    const article = new Article();
    applyAllowedFields(article, req.body);
    article.author = req.user.id;

    if (req.files?.coverImage?.[0]) {
      uploadedCover = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
        folder: "articles/cover",
      });
      article.coverImage = uploadedCover;
    } else if (req.body.coverImageUrl) {
      article.coverImage = { url: req.body.coverImageUrl, publicId: req.body.coverImagePublicId || "" };
    }

    if (req.files?.gallery?.length) {
      uploadedGallery = await Promise.all(
        req.files.gallery.map((file) => uploadBufferToCloudinary(file.buffer, { folder: "articles/gallery" }))
      );
      article.gallery = uploadedGallery;
    }

    await article.save();
    await article.populate("author", "name email");

    res.status(201).json({ success: true, article });
  } catch (error) {
    // Roll back any Cloudinary uploads if the DB write failed, to avoid orphaned assets.
    if (uploadedCover?.publicId) await deleteFromCloudinary(uploadedCover.publicId).catch(() => {});
    await Promise.all(uploadedGallery.map((img) => deleteFromCloudinary(img.publicId).catch(() => {})));

    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/articles
export const getArticles = async (req, res) => {
  try {
    const { category, tag, status, sort } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    if (isStaff(req)) {
      if (status) filter.status = status;
    } else {
      filter.status = "published";
    }

    const sortMap = {
      oldest: { createdAt: 1 },
      popular: { views: -1 },
      liked: { likes: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate("author", "name email")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Article.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/articles/:slug
export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate("author", "name email");

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (article.status !== "published" && !isStaff(req)) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    await Article.updateOne({ _id: article._id }, { $inc: { views: 1 } });
    article.views += 1;

    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/articles/category/:category
export const getArticlesByCategory = async (req, res) => {
  req.query.category = req.params.category;
  return getArticles(req, res);
};

// GET /api/articles/tag/:tag
export const getArticlesByTag = async (req, res) => {
  req.query.tag = req.params.tag;
  return getArticles(req, res);
};

// PUT /api/articles/:id
export const updateArticle = async (req, res) => {
  let uploadedCover;
  let uploadedGallery = [];

  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    applyAllowedFields(article, req.body);

    const oldCoverPublicId = article.coverImage?.publicId;
    if (req.files?.coverImage?.[0]) {
      uploadedCover = await uploadBufferToCloudinary(req.files.coverImage[0].buffer, {
        folder: "articles/cover",
      });
      article.coverImage = uploadedCover;
    }

    const oldGalleryPublicIds = (article.gallery || []).map((img) => img.publicId).filter(Boolean);
    if (req.files?.gallery?.length) {
      uploadedGallery = await Promise.all(
        req.files.gallery.map((file) => uploadBufferToCloudinary(file.buffer, { folder: "articles/gallery" }))
      );
      article.gallery = uploadedGallery;
    }

    await article.save();
    await article.populate("author", "name email");

    // Only remove the old assets once the new document has saved successfully.
    if (uploadedCover && oldCoverPublicId) {
      await deleteFromCloudinary(oldCoverPublicId).catch(() => {});
    }
    if (uploadedGallery.length && oldGalleryPublicIds.length) {
      await Promise.all(oldGalleryPublicIds.map((id) => deleteFromCloudinary(id).catch(() => {})));
    }

    res.json({ success: true, article });
  } catch (error) {
    if (uploadedCover?.publicId) await deleteFromCloudinary(uploadedCover.publicId).catch(() => {});
    await Promise.all(uploadedGallery.map((img) => deleteFromCloudinary(img.publicId).catch(() => {})));

    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/articles/:id
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    const publicIds = [
      article.coverImage?.publicId,
      ...(article.gallery || []).map((img) => img.publicId),
    ].filter(Boolean);

    await Promise.all(publicIds.map((id) => deleteFromCloudinary(id).catch(() => {})));
    await article.deleteOne();

    res.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/articles/:id/like
export const likeArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    res.json({ success: true, likes: article.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
