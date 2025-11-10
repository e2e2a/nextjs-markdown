// lib/handleError.ts
import { NextResponse } from 'next/server';
import { HttpError } from './error';

export function handleError(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.status });
  }

  console.error(err);
  return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
