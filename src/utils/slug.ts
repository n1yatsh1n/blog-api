import slugify from "slugify";

export function makeSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true });
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
