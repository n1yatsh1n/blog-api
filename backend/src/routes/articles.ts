import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  listArticles,
  updateArticle,
} from "../controllers/articleController";
import {
  addComment,
  deleteComment,
  listComments,
} from "../controllers/commentController";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  articleCreateSchema,
  articleUpdateSchema,
  commentCreateSchema,
} from "../validation/schemas";

const router = Router();

// Articles
router.get("/articles", listArticles);
router.post(
  "/articles",
  requireAuth,
  validateBody(articleCreateSchema),
  createArticle
);
router.get("/articles/:slug", getArticle);
router.put(
  "/articles/:slug",
  requireAuth,
  validateBody(articleUpdateSchema),
  updateArticle
);
router.delete("/articles/:slug", requireAuth, deleteArticle);

// Comments
router.post(
  "/articles/:slug/comments",
  requireAuth,
  validateBody(commentCreateSchema),
  addComment
);
router.get("/articles/:slug/comments", listComments);
router.delete("/articles/:slug/comments/:id", requireAuth, deleteComment);

export default router;
