import { NextRequest, NextResponse } from "next/server";

const ACCESS_CODE = "tcal";
const COOKIE_NAME = "tariff_access";

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const code = formData.get("code")?.toString().trim();
  const from = formData.get("from")?.toString() || "/";
  const base = getBaseUrl(request);

  if (code === ACCESS_CODE) {
    const response = NextResponse.redirect(new URL(from, base));
    response.cookies.set(COOKIE_NAME, ACCESS_CODE, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  const loginUrl = new URL("/login", base);
  loginUrl.searchParams.set("from", from);
  loginUrl.searchParams.set("error", "1");
  return NextResponse.redirect(loginUrl);
}
