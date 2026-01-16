import { Request, Response } from "express";
import { Article, Comment } from "../models";

export async function addComment(req: Request, res: Response) {
  const { slug } = req.params;
  const article = await Article.findOne({ where: { slug } });
  if (!article) {
    return res.status(404).json({ error: { message: "Article not found" } });
  }

  const { body } = req.body;

  const comment = await Comment.create({
    body,
    articleId: article.id,
    authorId: req.user!.id,
  });

  res.status(201).json({
    comment: {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      author: req.user ? {
        username: req.user.username,
      } : undefined,
    },
  });
}

export async function listComments(req: Request, res: Response) {
  const { slug } = req.params;
  const article = await Article.findOne({ where: { slug } });
  if (!article) {
    return res.status(404).json({ error: { message: "Article not found" } });
  }

  const comments = await Comment.findAll({
    where: { articleId: article.id },
    order: [["createdAt", "DESC"]],
  });

  res.json({
    comments: comments.map((c: any) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      authorId: c.authorId,
    })),
  });
}

export async function deleteComment(req: Request, res: Response) {
  const { slug, id } = req.params;
  const article = await Article.findOne({ where: { slug } });
  if (!article) {
    return res.status(404).json({ error: { message: "Article not found" } });
  }

  const comment = await Comment.findByPk(Number(id));
  if (!comment || comment.articleId !== article.id) {
    return res.status(404).json({ error: { message: "Comment not found" } });
  }

  if (comment.authorId !== req.user!.id) {
    return res.status(403).json({ error: { message: "Forbidden" } });
  }

  await comment.destroy();
  res.status(204).send();
}
