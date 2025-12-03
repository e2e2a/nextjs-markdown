import { z } from 'zod';

export const verifySchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{6}$/, 'Invalid verification code.'),
});
