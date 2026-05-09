import { z } from "zod";

export const startupSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  opportunity: z.string().optional(),
  industryType: z.enum(['SAAS', 'GREENTECH', 'FINTECH', 'HEALTH', 'WEALTH', 'TECH', 'FMCG', 'AI', 'EDTECH']).optional(),
  fundingGoal: z.number().positive(),
  equityOffered: z.number().min(0).max(100),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  pitchPdf: z.string().optional().or(z.literal("")),
  pitchVideo: z.string().optional().or(z.literal("")),
});

export const updateImageSchema = z.object({
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});