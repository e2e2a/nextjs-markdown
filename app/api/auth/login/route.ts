import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { authController } from '@/modules/auth/auth.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const res = await authController.login(body);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
