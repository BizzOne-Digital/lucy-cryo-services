import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "lc_admin_session";

async function isValid(token?: string) {
  const s = process.env.AUTH_SECRET;
  if (!token || !s || s.length < 32) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(s), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

/**
 * First line of defence for the admin area. Every admin page and API also re-checks
 * the session server-side (requireAdmin / getSession), so this is not the only guard.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await isValid(req.cookies.get(COOKIE)?.value);

  if (pathname.startsWith("/api/admin") || pathname === "/api/upload") {
    if (!authed) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (authed) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!authed) {
      const url = new URL("/admin/login", req.url);
      if (pathname !== "/admin") url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload"],
};
