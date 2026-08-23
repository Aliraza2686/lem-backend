import Product from "../modals/Product.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// Fields a client is allowed to set directly — protects against mass assignment
// (previously `req.body` was passed straight into Product.create/findOneAndUpdate).
const ALLOWED_FIELDS = [
  "id",
  "name",
  "category",
  "origin",
  "desc",
  "heroNote",
  "applications",
  "packaging",
  "variants",
  "labReports",
];

const pickAllowedFields = (body) => {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

const collectVariantPublicIds = (variants = []) =>
  variants.flatMap((variant) => (variant.images || []).map((img) => img.publicId).filter(Boolean));

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, total: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id  (matches the product's slug `id` field, e.g. "salt")
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const data = pickAllowedFields(req.body);

    const existing = await Product.findOne({ id: data.id });
    if (existing) {
      return res.status(409).json({ success: false, message: "Product with this id already exists" });
    }

    const product = await Product.create(data);

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowedFields(req.body);

    const existingProduct = await Product.findOne({ id });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const oldPublicIds = collectVariantPublicIds(existingProduct.variants);

    const product = await Product.findOneAndUpdate({ id }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    // Clean up Cloudinary assets for any images that were removed/replaced in this update.
    if (data.variants !== undefined) {
      const newPublicIds = new Set(collectVariantPublicIds(product.variants));
      const orphaned = oldPublicIds.filter((pid) => !newPublicIds.has(pid));
      await Promise.all(orphaned.map((pid) => deleteFromCloudinary(pid).catch(() => {})));
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const publicIds = collectVariantPublicIds(product.variants);
    await Promise.all(publicIds.map((pid) => deleteFromCloudinary(pid).catch(() => {})));

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/:id/variants/:variantKey/images  (multipart, field name: "images")
// Uploads files to Cloudinary FIRST, then pushes only {src, publicId} into the DB —
// this is the proper replacement for ever accepting raw/base64 image data in the body.
export const uploadVariantImages = async (req, res) => {
  const uploaded = [];
  try {
    const { id, variantKey } = req.params;

    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: "At least one image file is required" });
    }

    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.find((v) => v.key === variantKey);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, { folder: `products/${id}/${variantKey}` });
      uploaded.push(result);
    }

    variant.images.push(...uploaded.map((img) => ({ src: img.url, publicId: img.publicId })));
    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    await Promise.all(uploaded.map((img) => deleteFromCloudinary(img.publicId).catch(() => {})));
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id/variants/:variantKey/images  (body: { publicId })
export const deleteVariantImage = async (req, res) => {
  try {
    const { id, variantKey } = req.params;
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.find((v) => v.key === variantKey);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    variant.images = variant.images.filter((img) => img.publicId !== publicId);
    await product.save();
    await deleteFromCloudinary(publicId).catch(() => {});

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
