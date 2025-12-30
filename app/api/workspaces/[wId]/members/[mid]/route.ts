import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { workspaceMemberController } from '@/modules/workspaces/members/member.controller';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ wid: string; mid: string }> }
) {
  try {
    const { wid, mid } = await context.params;
    const body = await req.json();
    const res = await workspaceMemberController.update(mid, wid, body);

    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ wid: string; mid: string }> }
) {
  try {
    const { wid, mid } = await context.params;
    const res = await workspaceMemberController.delete(mid, wid);

    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
