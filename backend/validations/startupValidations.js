import { z } from "zod";

export const startupSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  opportunity: z.string().optional(),
  fundingGoal: z.number().positive(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const updateImageSchema = z.object({
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});