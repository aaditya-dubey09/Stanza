import { z } from 'zod';

export const generateRequestSchema = z.object({
  prompt: z
    .string()
    .min(3, { message: 'Prompt must be at least 3 characters long.' })
    .max(1000, { message: 'Prompt cannot exceed 1000 characters.' })
    .transform((val) => {
      // Structural sanitization to strip out injection patterns
      return val
        .trim()
        .replace(/system:/gi, '')
        .replace(/ignore previous instructions/gi, '')
        .replace(/override the prompt/gi, '');
    }),
  lifespanHours: z
    .number()
    .min(0.05, { message: 'Lifespan must be at least ~3 minutes (0.05 hours).' })
    .max(48, { message: 'Lifespan cannot exceed 48 hours.' })
    .default(24),
});

export type ValidatedGenerateInput = z.infer<typeof generateRequestSchema>;