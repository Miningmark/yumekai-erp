import { NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/cockieFunctions";
import {
  privateRoutes,
  authRoutes,
  DEFAULT_REDIRECT_LOGIN_URL,
  DEFAULT_REDIRECT_HOME_URL,
  DEFAULT_REDIRECT_FORBIDDEN_URL,
} from "@/routes";

export async function middleware(req) {
  const session = await getSession();

  //console.log("session from middleware", session);

  const url = req.nextUrl.clone();
  const route = url.pathname;

  const isLoggedIn = !!session;
  const userRoles = session?.user?.roles || [];

  //console.log("Route from middleware:", route);
  //console.log("Is Logged In from middleware:", isLoggedIn);
  //console.log("User Roles from middleware:", userRoles);

  function checkAuthRoute(authRoute) {
    return route.startsWith(authRoute);
  }

  // Handle authentication routes
  if (authRoutes.some(checkAuthRoute)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_HOME_URL, url));
    }
    return NextResponse.next();
  }

  const privateRoute = privateRoutes.find((r) => r.path === route);

  //console.log("Private Route from middleware:", privateRoute);

  // Handle private routes
  if (privateRoute) {
    if (!isLoggedIn) {
      //console.log("Redirecting to login because user is not logged in from middleware");
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_LOGIN_URL, url));
    }
    const hasAccess = privateRoute.roles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      //console.log("Redirecting to forbidden because user does not have the required role from middleware");
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_FORBIDDEN_URL, url));
    }
  }

  return await updateSession(req);
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
