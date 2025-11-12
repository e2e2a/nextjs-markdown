import z from 'zod';

export const kbaSchema = z.object({
  kbaQuestion: z
    .string()
    .min(3, 'Answer must be at least 3 characters')
    .max(100, 'Answer cannot exceed 100 characters'),
  kbaAnswer: z
    .string()
    .min(3, 'Answer must be at least 3 characters')
    .max(100, 'Answer cannot exceed 100 characters'),
});
