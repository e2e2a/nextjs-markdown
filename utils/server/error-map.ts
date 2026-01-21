export const ERRORS = {
  BAD_INPUT: { status: 400, message: 'Invalid data provided' },
  UNAUTHORIZED: { status: 401, message: 'Unauthorized' },
  FORBIDDEN: { status: 403, message: 'You do not have permission' },
  NOT_FOUND: { status: 404, message: 'The requested resource was not found' },
  CONFLICT: { status: 409, message: 'This name is already in use' },
  GONE: { status: 410, message: 'This name is already in use' },
  TOO_MANY_REQUEST: { status: 429, message: 'Too many attempts' },
} as const;

export type ErrorKey = keyof typeof ERRORS;
