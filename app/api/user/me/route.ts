import connectDb from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/handleError';
import { userRepository } from '@/modules/users/user.repository';

export async function GET() {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('UNAUTHORIZED');

    const user = await userRepository.findUser(session.user._id, true);
    if (!user) throw new HttpError('NOT_FOUND', 'No User Found');

    return NextResponse.json(user);
  } catch (err) {
    return handleError(err);
  }
}
