import { NextResponse } from 'next/server';
import { HttpError } from '../utils/server/errors';

export function handleError(err: unknown) {
  console.error(err);
  if (err instanceof HttpError) return NextResponse.json({ success: false, message: err.message }, { status: err.status });
  if (err instanceof Error) if (err.name === 'CastError') return NextResponse.json({ success: false, message: 'Invalid Fields' }, { status: 400 });

  return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
