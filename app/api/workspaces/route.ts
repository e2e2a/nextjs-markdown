import { handleError } from '@/lib/handleError';
import { NextRequest } from 'next/server';
import { workspaceController } from '@/modules/workspaces/workspace.controller';

export async function POST(req: NextRequest) {
  try {
    return await workspaceController.create(req);
  } catch (err) {
    return handleError(err);
  }
}
