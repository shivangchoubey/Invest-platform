import { z } from "zod";

export const startupSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  fundingGoal: z.number().positive(),
});