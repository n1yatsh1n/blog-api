import { Request, Response } from "express";
import { Article, Comment, User } from "../models";

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

  // Повторный запрос с include, чтобы получить автора
  const withAuthor = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["username", "bio", "image_url"],
      },
    ],
  });

  res.status(201).json({
    comment: {
      id: withAuthor!.id,
      body: withAuthor!.body,
      createdAt: withAuthor!.createdAt,
      author: (withAuthor as any).author, // 👈 добавлено "as any", чтобы убрать TS2551
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
    include: [
      {
        model: User,
        as: "author",
        attributes: ["username", "bio", "image_url"],
      },
    ],
  });

  res.json({
    comments: comments.map((c: any) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      author: c.author,
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
