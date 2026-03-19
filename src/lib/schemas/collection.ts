import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters for the name."),
  description: z.string().trim().optional()
});

export const updateCollectionSchema = createCollectionSchema.extend({
  id: z.uuid()
});

export const deleteCollectionSchema = z.object({
  id: z.uuid()
});

export type CreateCollectionSchema = typeof createCollectionSchema;
export type UpdateCollectionSchema = typeof updateCollectionSchema;
export type DeleteCollectionSchema = typeof deleteCollectionSchema;
