import { z } from "zod";

export const createBookmarkSchema = z.object({
  url: z.url().trim(),
  collectionId: z
    .uuid()
    .nullish()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val))
});

export const updateBookmarkSchema = createBookmarkSchema.extend({
  id: z.uuid(),
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z.string().trim().min(2, "Description must be at least 2 characters.")
});

export const deleteBookmarkSchema = z.object({
  id: z.uuid()
});

export type CreateBookmarkSchema = typeof createBookmarkSchema;
export type UpdateBookmarkSchema = typeof updateBookmarkSchema;
export type DeleteBookmarkSchema = typeof deleteBookmarkSchema;
