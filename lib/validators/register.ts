import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email').trim(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const validateRegisterSchema = z.object({
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
