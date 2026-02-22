import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { authController } from '@/modules/auth/auth.controller';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();

    const res = await authController.verifyEmail(body);

    return NextResponse.json(res ?? null, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
