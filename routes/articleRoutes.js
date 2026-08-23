import express from "express";
import {
  createArticle,
  getArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesByTag,
  updateArticle,
  deleteArticle,
  likeArticle,
} from "../controllers/articleController.js";
import auth from "../middlewheres/auth.js";
import optionalAuth from "../middlewheres/optionalAuth.js";
import requireRole from "../middlewheres/requireRole.js";
import upload from "../middlewheres/upload.js";
import {
  createArticleValidators,
  updateArticleValidators,
  requireCoverImageOnCreate,
  handleValidationErrors,
} from "../middlewheres/articleValidators.js";

const router = express.Router();

const articleFiles = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

router.get("/", optionalAuth, getArticles);
router.get("/category/:category", optionalAuth, getArticlesByCategory);
router.get("/tag/:tag", optionalAuth, getArticlesByTag);
router.get("/:slug", optionalAuth, getArticleBySlug);

router.post(
  "/",
  auth,
  requireRole("admin", "editor"),
  articleFiles,
  requireCoverImageOnCreate,
  createArticleValidators,
  handleValidationErrors,
  createArticle
);

router.put(
  "/:id",
  auth,
  requireRole("admin", "editor"),
  articleFiles,
  updateArticleValidators,
  handleValidationErrors,
  updateArticle
);

router.delete("/:id", auth, requireRole("admin"), deleteArticle);

router.patch("/:id/like", likeArticle);

export default router;
