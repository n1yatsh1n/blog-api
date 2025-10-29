import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { signToken } from "../middleware/auth";

export async function register(req: Request, res: Response) {
  const { email, username, password, bio, image_url } = req.body;
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: { message: "Email already in use" } });
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) return res.status(409).json({ error: { message: "Username already in use" } });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, passwordHash, bio: bio ?? null, image_url: image_url ?? null });
  const token = signToken({ id: user.id, email: user.email, username: user.username });
  res.status(201).json({
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image_url: user.image_url,
      token
    }
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: { message: "Invalid email or password" } });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: { message: "Invalid email or password" } });
  const token = signToken({ id: user.id, email: user.email, username: user.username });
  res.json({
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image_url: user.image_url,
      token
    }
  });
}

export async function getCurrent(req: Request, res: Response) {
  const user = await User.findByPk(req.user!.id);
  if (!user) return res.status(404).json({ error: { message: "User not found" } });
  res.json({
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image_url: user.image_url
    }
  });
}

export async function updateUser(req: Request, res: Response) {
  const user = await User.findByPk(req.user!.id);
  if (!user) return res.status(404).json({ error: { message: "User not found" } });

  const { email, username, password, bio, image_url } = req.body;
  if (email && email !== user.email) {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: { message: "Email already in use" } });
    user.email = email;
  }
  if (username && username !== user.username) {
    const existsU = await User.findOne({ where: { username } });
    if (existsU) return res.status(409).json({ error: { message: "Username already in use" } });
    user.username = username;
  }
  if (typeof bio !== "undefined") user.bio = bio;
  if (typeof image_url !== "undefined") user.image_url = image_url;
  if (password) user.passwordHash = await bcrypt.hash(password, 10);

  await user.save();
  res.json({
    user: {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image_url: user.image_url
    }
  });
}
