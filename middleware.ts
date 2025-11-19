import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parse } from 'cookie';
import clientPromise from './lib/db/adapter';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookiesHeader = request.headers.get('cookie') || '';
  const cookies = parse(cookiesHeader);
  // const sessionToken = cookies['next-auth.session-token'];
  const sessionToken =
    cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];

  if (
    pathname.startsWith('/invite') ||
    pathname.startsWith('/project') ||
    pathname.startsWith('/trash')
  ) {
    const client = await clientPromise;
    const db = client.db();
    const session = await db.collection('sessions').findOne({ sessionToken });

    if (!session) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.set('lastPath', request.nextUrl.pathname + request.nextUrl.search, { path: '/' });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/project/:path*', '/invite/:path*', '/trash/:path*'],
};
