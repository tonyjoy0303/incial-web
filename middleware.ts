import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Protect all /admin/* routes except /admin/login.
 * Redirect unauthenticated users to the login page.
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoginPage = nextUrl.pathname === "/admin/login";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware only on /admin routes
  matcher: ["/admin/:path*"],
};
