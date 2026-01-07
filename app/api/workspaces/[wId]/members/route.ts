import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { workspaceMemberController } from '@/modules/workspaces/members/member.controller';
import connectDb from '@/lib/db/connection';

export async function GET(req: NextRequest, context: { params: Promise<{ wid: string }> }) {
  try {
    await connectDb();
    const { wid } = await context.params;
    const res = await workspaceMemberController.getWorkspaceMembers(wid);

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
