import { handleError } from '@/lib/handleError';
import { NextRequest } from 'next/server';
import { workspaceController } from '@/modules/workspaces/workspace.controller';
import { NextResponse } from 'next/server';
import { workspaceService } from '@/modules/workspaces/workspace.service';

export async function POST(req: NextRequest) {
  try {
    const res = await workspaceController.create(req);
    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}

export async function GET() {
  try {
    const res = await workspaceService.getUserWorkspaces();
    return NextResponse.json(res ?? null, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
