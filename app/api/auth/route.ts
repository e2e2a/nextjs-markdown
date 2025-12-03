import connectDb from '@/lib/db/connection';
import { HttpError } from '@/lib/error';
import { handleError } from '@/lib/handleError';
import { authServices } from '@/services/auth';
import { AuthUser } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    let res = null;
    await connectDb();
    const data = await req.json();
    if (!data) throw new HttpError('Invalid Fields.', 400);

    switch (data.authType) {
      case 'register':
        res = await authServices.register(data as AuthUser);
        break;
      case 'login':
        res = await authServices.login(data as AuthUser);
        break;
      default:
        throw new HttpError('Email already exists in this level.', 400);
    }

    return NextResponse.json({ token: res?.token || '', email: res.email });
  } catch (err) {
    return handleError(err);
  }
}
