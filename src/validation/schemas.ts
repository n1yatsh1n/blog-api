import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  bio: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  bio: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional()
});

export const articleCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  tagList: z.array(z.string()).optional()
});

export const articleUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  tagList: z.array(z.string()).optional()
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });

export const commentCreateSchema = z.object({
  body: z.string().min(1)
});
