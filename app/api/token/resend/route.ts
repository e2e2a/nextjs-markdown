import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/handleError';
import { tokenService } from '@/modules/tokens/token.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();

    const token = await tokenService.resendCode(body.token);
    if (!token) throw new HttpError('Invalid Token.', 404);

    return NextResponse.json({ success: true, message: 'Email Resend successfully.', token: body.token }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
