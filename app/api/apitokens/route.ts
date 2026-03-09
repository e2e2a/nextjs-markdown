import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import connectDb from '@/lib/db/connection';
import ApiToken from '@/modules/apitokens/apitoken.model';
import { handleError } from '@/lib/server/handleError';
import { ensureAuthenticated } from '@/lib/server/auth-utils';

export async function POST() {
  try {
    await connectDb();

    const session = await ensureAuthenticated();
    if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const rawToken = 'sk_' + randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await ApiToken.create({
      // userId: session.user._id,
      userId: '69aa2b94eb414f07412b66b2',
      tokenHash,
      revoked: false,
    });

    return NextResponse.json({
      token: rawToken,
    });
  } catch (err) {
    return handleError(err);
  }
}
