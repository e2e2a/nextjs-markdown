import connectDb from '@/lib/db/connection';
import { handleError } from '@/lib/handleError';
import { authServices } from '@/services/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const data = await req.json();
    const res = await authServices.register(data as { email: string; password: string });

    return NextResponse.json({ token: res?.token || '', email: res.email });
  } catch (err) {
    return handleError(err);
  }
}
