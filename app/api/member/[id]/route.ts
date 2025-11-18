import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { memberRepository } from '@/repositories/member';
import { MembersInvited } from '@/types';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    let updateMemberStatus: MembersInvited | null = null;
    if (body.status) updateMemberStatus = await memberRepository.updateStatus(id, body.status);
    if (!updateMemberStatus)
      return NextResponse.json(
        { success: false, message: 'No invitation to be updated.' },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'updated successfully',
        userId: updateMemberStatus.userId,
        email: updateMemberStatus.email,
        projectId: updateMemberStatus.projectId,
        invitedBy: updateMemberStatus.invitedBy,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectDb();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new HttpError('Unauthorized', 401);

    const deletedMember = await memberRepository.deleteMember(id, session.user._id as string);
    if (!deletedMember)
      return NextResponse.json(
        { success: false, message: 'No invitation to be updated.' },
        { status: 404 }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'updated successfully',
        userId: deletedMember.userId,
        email: deletedMember.email,
        projectId: deletedMember.projectId,
        invitedBy: deletedMember.invitedBy,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
