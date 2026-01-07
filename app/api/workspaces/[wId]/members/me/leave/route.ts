import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '@/lib/handleError';
import { workspaceMemberController } from '@/modules/workspaces/members/member.controller';
import connectDb from '@/lib/db/connection';

export async function POST(req: NextRequest, context: { params: Promise<{ wid: string }> }) {
  try {
    await connectDb();
    const { wid } = await context.params;
    const res = await workspaceMemberController.leave(wid);

    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
