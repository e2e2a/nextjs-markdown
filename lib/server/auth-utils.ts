import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HttpError } from '../../utils/server/errors';
import { headers } from 'next/headers';
import crypto from 'crypto';
// import connectDb from '../db/connection';
import User from '@/modules/users/user.model';
import ApiToken from '@/modules/apitokens/apitoken.model';

export async function validateAccessToken(token: string) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const apiToken = await ApiToken.findOne({
    tokenHash: hashed,
    revoked: { $ne: true },
  });

  if (!apiToken) return null;
  if (apiToken.expiresAt && new Date(apiToken.expiresAt) < new Date()) {
    return null;
  }

  const user = await User.findOne({
    _id: apiToken.userId,
  });

  if (!user) return null;

  await ApiToken.updateOne({ _id: apiToken._id }, { $set: { lastUsed: new Date() } });

  return { user };
}
/**
 * Basic Guard: Just ensures the user is logged in.
 */
export async function ensureAuthenticated() {
  const headerStore = await headers();
  const authHeader = headerStore.get('authorization');

  // 1️⃣ Bearer token authentication
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = await validateAccessToken(token);
    if (!session) throw new HttpError('UNAUTHORIZED', 'Invalid access token');

    return { ...session, type: 'token' };
  }

  // 2️⃣ Cookie session authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new HttpError('UNAUTHORIZED', 'Unauthorized');
  return { ...session, type: 'session' };
}

/**
 * Role Guard: Ensures user is logged in AND has a specific role.
 * You can use this for Global roles (e.g., App Admin).
 */
export async function ensureHasRole(requiredRole: 'ADMIN' | 'USER') {
  const session = await ensureAuthenticated();
  if (session.user.role !== requiredRole) throw new HttpError('FORBIDDEN', 'Forbidden: Insufficient permissions');

  return session;
}
