import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/handleError';
import { authServices } from '@/services/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();

    const token = await authServices.verifyEmailByCodeAndToken(body);
    if (!token) throw new HttpError('Invalid Token.', 404);

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
