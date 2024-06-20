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

  if (token) {
    //console.log("Token in auth middleware:", token); // Debugging-Log hinzufügen
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

  //console.log("Route from middleware:", route);
  //console.log("Is Logged In from middleware:", isLoggedIn);
  //console.log("User Role from middleware:", userRole);

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
