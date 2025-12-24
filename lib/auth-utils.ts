import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HttpError } from '../utils/errors';

/**
 * Basic Guard: Just ensures the user is logged in.
 */
export async function ensureAuthenticated() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new HttpError('UNAUTHORIZED', 'Unauthorized');
  return session;
}

/**
 * Role Guard: Ensures user is logged in AND has a specific role.
 * You can use this for Global roles (e.g., App Admin).
 */
export async function ensureHasRole(requiredRole: 'ADMIN' | 'USER') {
  const session = await ensureAuthenticated();

  // Assuming your session includes the role from the JWT/Database
  if (session.user.role !== requiredRole) {
    throw new HttpError('FORBIDDEN', 'Forbidden: Insufficient permissions');
  }

  return session;
}
