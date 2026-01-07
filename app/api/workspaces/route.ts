import { handleError } from '@/lib/handleError';
import { NextRequest } from 'next/server';
import { workspaceController } from '@/modules/workspaces/workspace.controller';
import { NextResponse } from 'next/server';
import connectDb from '@/lib/db/connection';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const res = await workspaceController.create(req);
    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function GET() {
  try {
    await connectDb();
    const res = await workspaceController.getUserWorkspaces();
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
