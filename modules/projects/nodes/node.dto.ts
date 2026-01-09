import { z } from 'zod';

/**
 * NodeDTO Namespace
 * Encapsulates all validation schemas (Input DTOs) for the Node entity.
 */
export const NodeDTO = {
  // DTO for creating a new node
  create: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()).optional(),
  }),

  // DTO for partial updates (your specific requirement)
  update: z
    .object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
    })
    .refine(data => data.title || data.content, {
      message: 'At least one field (title or content) must be provided',
    }),
};

// Type inference (Optional, but highly recommended for TS environments)
export type CreateNodeInput = z.infer<typeof NodeDTO.create>;
export type UpdateNodeInput = z.infer<typeof NodeDTO.update>;
