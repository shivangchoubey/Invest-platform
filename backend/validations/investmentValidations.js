import { z } from "zod";

export const investmentSchema = z.object({
  startupId: z.string(),
  amount: z.number().positive(),
});