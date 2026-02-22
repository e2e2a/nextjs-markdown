import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/server/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { tokenController } from '@/modules/tokens/token.controller';

export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();

    const res = await tokenController.resendCode(body.token);
    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
