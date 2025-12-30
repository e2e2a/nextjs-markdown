import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/handleError';
import { workspaceMemberController } from '@/modules/workspaces/members/member.controller';

export async function POST(req: NextRequest, context: { params: Promise<{ wid: string }> }) {
  try {
    const { wid } = await context.params;
    const res = await workspaceMemberController.leave(wid);

    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
