import { z } from 'zod';
import { ObjectId } from 'mongodb';

/**
 * NodeDTO Namespace
 * Encapsulates all validation schemas (Input DTOs) for the Node entity.
 */
const objectIdSchema = (fieldName: string) =>
  z.string().refine(val => ObjectId.isValid(val), {
    message: `Invalid ${fieldName}`, // field-specific message
  });

export const NodeDTO = {
  // DTO for creating a new node
  create: z.object({
    projectId: objectIdSchema('Project id'),
    parentId: objectIdSchema('Parent id').nullable(),
    type: z.enum(['file', 'folder']),
    title: z.string().max(50, { message: 'Title must be at most 50 characters' }),
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
