import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { authServices } from '@/modules/auth/auth.service';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();

    const token = await authServices.verifyEmailByCodeAndToken(body);
    if (!token) throw new HttpError('NOT_FOUND');

    return NextResponse.json(
      {
        success: true,
        message: 'Verification Completed.',
        token: body?.token,
        email: token?.email,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
