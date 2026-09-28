import Gallery from "../modals/Gallery.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

const GALLERY_FOLDER = "gallery";

const uploadGalleryImage = (file) => uploadBufferToCloudinary(file.buffer, { folder: GALLERY_FOLDER });

// Seeded entries can share one Cloudinary asset (the original hardcoded gallery reused an
// image), so only destroy an asset once no other gallery entry still points at it.
const deleteImageIfUnused = async (publicId, excludeId) => {
  const stillUsed = await Gallery.exists({ imagePublicId: publicId, _id: { $ne: excludeId } });
  if (!stillUsed) await deleteFromCloudinary(publicId);
};

// GET /api/gallery
export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, total: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/gallery
export const createGalleryItem = async (req, res) => {
  let uploaded;

  try {
    uploaded = await uploadGalleryImage(req.file);

    // New entries go to the end of the gallery.
    const last = await Gallery.findOne().sort({ displayOrder: -1 }).select("displayOrder");

    const item = await Gallery.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
      displayOrder: last ? last.displayOrder + 1 : 0,
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    // Roll back the Cloudinary upload if the DB write failed, to avoid an orphaned asset.
    if (uploaded?.publicId) await deleteFromCloudinary(uploaded.publicId).catch(() => {});
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/gallery/:id
export const updateGalleryItem = async (req, res) => {
  let uploaded;

  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.description !== undefined) item.description = req.body.description;

    const oldPublicId = item.imagePublicId;
    if (req.file) {
      uploaded = await uploadGalleryImage(req.file);
      item.imageUrl = uploaded.url;
      item.imagePublicId = uploaded.publicId;
    }

    await item.save();

    // Only remove the old asset once the new document has saved successfully.
    if (uploaded && oldPublicId) {
      await deleteImageIfUnused(oldPublicId, item._id).catch(() => {});
    }

    res.json({ success: true, item });
  } catch (error) {
    if (uploaded?.publicId) await deleteFromCloudinary(uploaded.publicId).catch(() => {});
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/gallery/:id
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    await deleteImageIfUnused(item.imagePublicId, item._id).catch(() => {});
    await item.deleteOne();
    // Close the gap so positions stay contiguous (0..n-1).
    await Gallery.updateMany({ displayOrder: { $gt: item.displayOrder } }, { $inc: { displayOrder: -1 } });

    res.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/gallery/reorder  body: { items: [{ id, displayOrder }] }
export const reorderGallery = async (req, res) => {
  try {
    const { items } = req.body;

    const result = await Gallery.bulkWrite(
      items.map(({ id, displayOrder }) => ({
        updateOne: { filter: { _id: id }, update: { $set: { displayOrder } } },
      }))
    );

    if (result.matchedCount !== items.length) {
      return res.status(404).json({
        success: false,
        message: `${items.length - result.matchedCount} of ${items.length} gallery items were not found`,
      });
    }

    const updated = await Gallery.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, total: updated.length, items: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
