import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/server/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { userController } from '@/modules/users/user.controller';

export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const res = await userController.onboard(body);
    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
