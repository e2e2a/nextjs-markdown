import connectDb from '@/lib/db/connection';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { userRepository } from '@/repositories/user';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    if (id !== session.user._id) throw new HttpError('Forbidden', 403);

    const user = await userRepository.findUser(id, true);
    if (!user) throw new HttpError('No User Found.', 404);

    return NextResponse.json(user);
  } catch (err) {
    return handleError(err);
  }
}
