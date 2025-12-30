import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { workspaceMemberController } from '@/modules/workspaces/members/member.controller';

export async function GET(req: NextRequest, context: { params: Promise<{ wid: string }> }) {
  try {
    const { wid } = await context.params;
    const res = await workspaceMemberController.getWorkspaceMembers(wid);

    return NextResponse.json(res ?? null, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
