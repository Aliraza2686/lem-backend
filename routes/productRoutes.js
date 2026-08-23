import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadVariantImages,
  deleteVariantImage,
} from "../controllers/productController.js";
import auth from "../middlewheres/auth.js";
import upload from "../middlewheres/upload.js";
import {
  createProductValidators,
  updateProductValidators,
  rejectDataUris,
  handleValidationErrors,
} from "../middlewheres/productValidators.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post(
  "/",
  auth,
  rejectDataUris,
  createProductValidators,
  handleValidationErrors,
  createProduct
);

router.put(
  "/:id",
  auth,
  rejectDataUris,
  updateProductValidators,
  handleValidationErrors,
  updateProduct
);

router.delete("/:id", auth, deleteProduct);

router.post("/:id/variants/:variantKey/images", auth, upload.array("images", 10), uploadVariantImages);
router.delete("/:id/variants/:variantKey/images", auth, deleteVariantImage);

export default router;
