import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters for the name.")
});

export type UpdateProfileSchema = typeof updateProfileSchema;
