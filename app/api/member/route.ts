import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { memberService } from '@/services/member';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get('projectId') as string;
    const email = searchParams.get('email') as string;
    const members = await memberService.findMembers(session, { projectId, email });

    return NextResponse.json(members);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDb();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);
    const member = await memberService.create(session, body);

    return NextResponse.json(
      {
        success: true,
        message: 'Created successfully',
        projectId: member.projectId,
        email: member.email,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
