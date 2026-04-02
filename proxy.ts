import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_CODE = "tcal";
const COOKIE_NAME = "tariff_access";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and API route through
  if (pathname === "/login" || pathname === "/api/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === ACCESS_CODE) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
