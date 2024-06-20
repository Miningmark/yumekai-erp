import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  privateRoutes,
  authRoutes,
  DEFAULT_REDIRECT_LOGIN_URL,
  DEFAULT_REDIRECT_HOME_URL,
  DEFAULT_REDIRECT_FORBIDDEN_URL,
} from "@/routes";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });

  const cookies = req.cookies;
  console.log("cookies from middleware: ", cookies);

  console.log("req aus middleware: ", req);
  console.log("req.headers from middleware: ", req.headers);
  console.log("secret from middleware: ", secret);

  console.log("Token in auth middleware:", token); // Debugging-Log hinzufügen

  /*
  const token = await req.cookies.get("__Secure-next-auth.session-token");

  try {
    const decodedToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!decodedToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.error("Error decoding token", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
*/
  if (token) {
    req.auth = {
      role: token.role,
      email: token.email,
      name: token.name,
      id: token.id,
    };
  } else {
    req.auth = null;
  }

  const url = req.nextUrl.clone();
  const route = url.pathname;

  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.role;

  console.log("Route from middleware:", route);
  console.log("Is Logged In from middleware:", isLoggedIn);
  console.log("User Role from middleware:", userRole);
  /*
  function checkAuthRoute(authRoute) {
    return route.startsWith(authRoute);
  }

  if (authRoutes.some(checkAuthRoute)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_HOME_URL, url));
    }
    return NextResponse.next();
  }

  const privateRoute = privateRoutes.find((r) => r.path === route);

  //console.log("Private Route:", privateRoute);

  if (privateRoute) {
    if (!isLoggedIn) {
      //console.log("Redirecting to login because user is not logged in");
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_LOGIN_URL, url));
    }
    if (!privateRoute.roles.includes(userRole)) {
      //console.log("Redirecting to forbidden because user does not have the required role");
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_FORBIDDEN_URL, url));
    }
  }
    */

  return NextResponse.next();
}

export const config = {
  //matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
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
