import path from "path";
import Certification from "../modals/Certification.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

const CERTIFICATION_FOLDER = "certifications";

const fileTypeFromMimetype = (mimetype = "") => (mimetype.startsWith("image/") ? "image" : "file");

// destroy() only works with the asset's matching resource type, which is encoded in
// the delivery URL (.../<type>/upload/...), so read it back from there.
const resourceTypeFromUrl = (url = "") => url.match(/\/(image|raw|video)\/upload\//)?.[1] || "image";

// Images go up as "auto". Documents are forced to "raw" WITHOUT a file extension in the
// public_id: this Cloudinary account blocks delivery of any URL ending in .pdf (401
// "deny or ACL failure" — the "Allow delivery of PDF and ZIP files" security setting),
// whether stored as "image" (what "auto" picks for PDFs) or "raw". The extension is
// kept as a "-pdf"/"-docx" token in the name instead, so clients can label the format
// and name the downloaded file (e.g. certifications/ISO_9001-pdf_ab12cd).
const uploadCertificationFile = (file) => {
  if (fileTypeFromMimetype(file.mimetype) === "image") {
    return uploadBufferToCloudinary(file.buffer, { folder: CERTIFICATION_FOLDER, resourceType: "auto" });
  }
  const { name, ext } = path.parse(file.originalname);
  return uploadBufferToCloudinary(file.buffer, {
    folder: CERTIFICATION_FOLDER,
    resourceType: "raw",
    use_filename: true,
    unique_filename: true,
    filename_override: ext ? `${name}-${ext.slice(1).toLowerCase()}` : name,
  });
};

const deleteCertificationAsset = (url, publicId) =>
  deleteFromCloudinary(publicId, { resourceType: resourceTypeFromUrl(url) });

// GET /api/certifications
export const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.json({ success: true, total: certifications.length, certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/certifications
export const createCertification = async (req, res) => {
  let uploaded;

  try {
    uploaded = await uploadCertificationFile(req.file);

    const certification = await Certification.create({
      title: req.body.title,
      description: req.body.description,
      fileUrl: uploaded.url,
      filePublicId: uploaded.publicId,
      fileType: fileTypeFromMimetype(req.file.mimetype),
    });

    res.status(201).json({ success: true, certification });
  } catch (error) {
    // Roll back the Cloudinary upload if the DB write failed, to avoid an orphaned asset.
    if (uploaded?.publicId) await deleteCertificationAsset(uploaded.url, uploaded.publicId).catch(() => {});
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/certifications/:id
export const updateCertification = async (req, res) => {
  let uploaded;

  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    if (req.body.title !== undefined) certification.title = req.body.title;
    if (req.body.description !== undefined) certification.description = req.body.description;

    const oldFileUrl = certification.fileUrl;
    const oldPublicId = certification.filePublicId;
    if (req.file) {
      uploaded = await uploadCertificationFile(req.file);
      certification.fileUrl = uploaded.url;
      certification.filePublicId = uploaded.publicId;
      certification.fileType = fileTypeFromMimetype(req.file.mimetype);
    }

    await certification.save();

    // Only remove the old asset once the new document has saved successfully.
    if (uploaded && oldPublicId) {
      await deleteCertificationAsset(oldFileUrl, oldPublicId).catch(() => {});
    }

    res.json({ success: true, certification });
  } catch (error) {
    if (uploaded?.publicId) await deleteCertificationAsset(uploaded.url, uploaded.publicId).catch(() => {});
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/certifications/:id
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ success: false, message: "Certification not found" });
    }

    await deleteCertificationAsset(certification.fileUrl, certification.filePublicId).catch(() => {});
    await certification.deleteOne();

    res.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
