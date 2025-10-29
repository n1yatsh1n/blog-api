import { Request, Response } from "express";
import { Article, Tag, User, ArticleTag, Comment } from "../models";
import { makeSlug } from "../utils/slug";
import { Op } from "sequelize";

function articleToJSON(article: any) {
  const tagList = (article.tags || []).map((t: any) => t.name);
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    author: article.author ? {
      username: article.author.username,
      bio: article.author.bio,
      image_url: article.author.image_url
    } : undefined
  };
}

async function syncTags(articleId: number, tagList?: string[]) {
  if (!tagList) return;
  const normalized = [...new Set(tagList.map((t) => t.trim()).filter(Boolean))];
  const tags = await Promise.all(normalized.map(async (name) => {
    const [tag] = await Tag.findOrCreate({ where: { name }, defaults: { name } });
    return tag;
  }));
  // remove old relations and set new
  await ArticleTag.destroy({ where: { articleId } });
  const rows = tags.map((t) => ({ articleId, tagId: t.id }));
  if (rows.length) await ArticleTag.bulkCreate(rows);
}

export async function createArticle(req: Request, res: Response) {
  const { title, description, body, tagList } = req.body;
  const slug = makeSlug(title);
  const article = await Article.create({ title, description, body, slug, authorId: req.user!.id });
  await syncTags(article.id, tagList);
  const withAuthor = await Article.findByPk(article.id, {
    include: [
      { model: User, as: "author", attributes: ["username", "bio", "image_url"] },
      { model: Tag, as: "tags", through: { attributes: [] } }
    ]
  });
  res.status(201).json({ article: articleToJSON(withAuthor!) });
}

export async function listArticles(req: Request, res: Response) {
  const limit = Math.min(parseInt(String(req.query.limit || "20"), 10), 100);
  const offset = parseInt(String(req.query.offset || "0"), 10);
  const articles = await Article.findAll({
    order: [["createdAt", "DESC"]],
    limit, offset,
    include: [
      { model: User, as: "author", attributes: ["username", "bio", "image_url"] },
      { model: Tag, as: "tags", through: { attributes: [] } }
    ]
  });
  res.json({ articles: articles.map(articleToJSON), count: articles.length });
}

export async function getArticle(req: Request, res: Response) {
  const { slug } = req.params;
  const article = await Article.findOne({
    where: { slug },
    include: [
      { model: User, as: "author", attributes: ["username", "bio", "image_url"] },
      { model: Tag, as: "tags", through: { attributes: [] } }
    ]
  });
  if (!article) return res.status(404).json({ error: { message: "Article not found" } });
  res.json({ article: articleToJSON(article) });
}

export async function updateArticle(req: Request, res: Response) {
  const { slug } = req.params;
  const article = await Article.findOne({ where: { slug } });
  if (!article) return res.status(404).json({ error: { message: "Article not found" } });
  if (article.authorId !== req.user!.id) return res.status(403).json({ error: { message: "Forbidden" } });

  const { title, description, body, tagList } = req.body;
  if (title) {
    article.title = title;
    article.slug = makeSlug(title);
  }
  if (typeof description !== "undefined") article.description = description;
  if (typeof body !== "undefined") article.body = body;
  await article.save();

  await syncTags(article.id, tagList);

  const withRels = await Article.findByPk(article.id, {
    include: [
      { model: User, as: "author", attributes: ["username", "bio", "image_url"] },
      { model: Tag, as: "tags", through: { attributes: [] } }
    ]
  });
  res.json({ article: articleToJSON(withRels!) });
}

export async function deleteArticle(req: Request, res: Response) {
  const { slug } = req.params;
  const article = await Article.findOne({ where: { slug } });
  if (!article) return res.status(404).json({ error: { message: "Article not found" } });
  if (article.authorId !== req.user!.id) return res.status(403).json({ error: { message: "Forbidden" } });

  await article.destroy();
  res.status(204).send();
}
