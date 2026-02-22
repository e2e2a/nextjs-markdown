import { z } from 'zod';

/**
 * AuthDTO Namespace
 * Encapsulates all validation schemas (Input DTOs) for the Auth entity.
 */

export const AuthDTO = {
  // DTO for creating a new node
  login: z.object({
    email: z.string().email('Invalid email'),
    password: z.string(),
  }),
  register: z.object({
    email: z.string().email('Invalid email').trim(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};
