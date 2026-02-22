import connectDb from '@/lib/db/connection';
import { HttpError } from '@/utils/server/errors';
import { handleError } from '@/lib/server/handleError';
import { tokenService } from '@/modules/tokens/token.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const searchParams = req.nextUrl.searchParams;
    const tokenParam = searchParams.get('token') as string;

    const token = await tokenService.getToken(tokenParam);
    if (!token) throw new HttpError('NOT_FOUND', 'No Token Found.');
    return NextResponse.json({ expiresCode: token.expiresCode, email: token.email });
  } catch (err) {
    return handleError(err);
  }
}
