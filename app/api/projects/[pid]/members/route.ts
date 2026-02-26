import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/server/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { projectMemberController } from '@/modules/projects/member/member.controller';

export async function GET(_req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;
    const res = await projectMemberController.getWorkspaceMembers(pid);
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ pid: string }> }) {
  try {
    await connectDb();
    const { pid } = await context.params;
    const res = await projectMemberController.create(req, pid);
    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
