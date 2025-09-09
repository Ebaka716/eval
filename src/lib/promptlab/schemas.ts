import { z } from "zod";

export const DimensionSchema = z.object({
  key: z.string(),
  label: z.string(),
  score: z.number().int().min(1).max(5),
  comments: z.string().min(1).max(500).optional(),
});

export const EvaluationSchema = z.object({
  overallScore: z.number().int().min(1).max(5),
  dimensions: z.array(DimensionSchema).min(1),
  evidence: z.array(z.string()).min(1).max(10),
  suggestions: z.array(z.string()).min(2).max(10),
  stretchIdea: z.string().min(1).max(300).optional(),
  meta: z
    .object({ model: z.string(), latencyMs: z.number().int().nonnegative() })
    .partial()
    .optional(),
});

export type Evaluation = z.infer<typeof EvaluationSchema>;


