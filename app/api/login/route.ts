import { NextRequest, NextResponse } from "next/server";

const ACCESS_CODE = "tcal";
const COOKIE_NAME = "tariff_access";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const code = formData.get("code")?.toString().trim();
  const from = formData.get("from")?.toString() || "/";

  if (code === ACCESS_CODE) {
    const response = NextResponse.redirect(new URL(from, request.url));
    response.cookies.set(COOKIE_NAME, ACCESS_CODE, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", from);
  loginUrl.searchParams.set("error", "1");
  return NextResponse.redirect(loginUrl);
}
