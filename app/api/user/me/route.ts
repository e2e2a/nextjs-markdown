import connectDb from '@/lib/db/connection';
import { NextResponse } from 'next/server';
import { handleError } from '@/lib/server/handleError';
import { userController } from '@/modules/users/user.controller';

export async function GET() {
  try {
    await connectDb();
    const res = await userController.getCurrentUser();

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
