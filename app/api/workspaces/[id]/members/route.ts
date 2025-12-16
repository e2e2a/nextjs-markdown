import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { workspaceMemberServices } from '@/services/workspaceMember';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const workspaces = await workspaceMemberServices.getMemberships({
      workspaceId: id,
      email: session.user.email,
    });

    return NextResponse.json(workspaces, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
