import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/handleError';
import { tokenService } from '@/modules/tokens/token.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const searchParams = req.nextUrl.searchParams;
    const tokenParam = searchParams.get('token') as string;

    const token = await tokenService.getToken(tokenParam);
    if (!token) throw new HttpError('No Token Found.', 404);
    return NextResponse.json({ expiresCode: token.expiresCode, email: token.email });
  } catch (err) {
    return handleError(err);
  }
}
