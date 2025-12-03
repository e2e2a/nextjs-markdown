import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/invite') ||
    pathname.startsWith('/project') ||
    pathname.startsWith('/preferences/') ||
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/trash')
  ) {
    const token = await getToken({ req: request, secret: SECRET });

    if (!token) {
      const res = NextResponse.redirect(new URL('/login', request.url));
      res.cookies.set('lastPath', request.nextUrl.pathname + request.nextUrl.search, { path: '/' });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/project/:path*',
    '/invite/:path*',
    '/trash/:path*',
    '/workspace/:path*',
    '/preferences/:path',
  ],
};
