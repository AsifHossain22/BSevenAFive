import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JwtPayload } from 'jsonwebtoken';
import { jwtUtils } from './utils/jwt';
import { cookies } from 'next/headers';

const AUTH_ROUTES = ['/register', '/login'];
const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/technicians',
  '/payment-success',
  '/payment-failed',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = request.cookies.get('accessToken')?.value;

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  let userRole = null;

  // TokenExpiredClearCookies
  if (!decodedAccessToken?.success) {
    cookieStore.delete('accessToken');
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken?.data as JwtPayload).role;
  }

  const isAuthRoute = AUTH_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (accessToken && isAuthRoute) {
    if (userRole === 'CUSTOMER') {
      return NextResponse.redirect(
        new URL('/dashboard/customer-dashboard', request.url),
      );
    } else if (userRole === 'TECHNICIAN') {
      return NextResponse.redirect(
        new URL('/dashboard/technician-dashboard', request.url),
      );
    } else if (userRole === 'ADMIN') {
      return NextResponse.redirect(
        new URL('/dashboard/admin-dashboard', request.url),
      );
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // AuthenticatedProtectedRoutes
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // AuthorizedProtectedRoutes
  if (
    pathname.startsWith('/dashboard/customer-dashboard') &&
    userRole !== 'CUSTOMER'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  } else if (
    pathname.startsWith('/dashboard/technician-dashboard') &&
    userRole !== 'TECHNICIAN'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  } else if (
    pathname.startsWith('/dashboard/admin-dashboard') &&
    userRole !== 'ADMIN'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
