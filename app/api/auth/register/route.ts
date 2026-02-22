import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/server/handleError';
import { authController } from '@/modules/auth/auth.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const data = await req.json();
    const res = await authController.register(data);

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
