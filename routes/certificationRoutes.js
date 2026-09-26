import express from "express";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController.js";
import auth from "../middlewheres/auth.js";
import requireRole from "../middlewheres/requireRole.js";
import { certificationFile } from "../middlewheres/certificationUpload.js";
import {
  createCertificationValidators,
  updateCertificationValidators,
  requireFileOnCreate,
  handleValidationErrors,
} from "../middlewheres/certificationValidators.js";

const router = express.Router();

router.get("/", getCertifications);

router.post(
  "/",
  auth,
  requireRole("admin", "editor"),
  certificationFile,
  requireFileOnCreate,
  createCertificationValidators,
  handleValidationErrors,
  createCertification
);

router.put(
  "/:id",
  auth,
  requireRole("admin", "editor"),
  certificationFile,
  updateCertificationValidators,
  handleValidationErrors,
  updateCertification
);

router.delete("/:id", auth, requireRole("admin"), deleteCertification);

export default router;
