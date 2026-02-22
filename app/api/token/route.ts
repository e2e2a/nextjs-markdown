import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/server/handleError';
import { NextRequest, NextResponse } from 'next/server';
import { tokenController } from '@/modules/tokens/token.controller';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const searchParams = req.nextUrl.searchParams;
    const tokenParam = searchParams.get('token') as string;

    const res = await tokenController.getToken(tokenParam);
    return NextResponse.json(res ?? null, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
