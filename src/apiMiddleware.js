import { NextResponse } from "next/server";
import { getSession } from "@/lib/cockieFunctions";
import { privateAPIRoutes } from "@/routes";

export async function apiAuthMiddleware(req) {
  const session = await getSession(req);

  const url = req.nextUrl.clone();
  const route = url.pathname;

  const isLoggedIn = !!session;
  const userRole = session?.user?.role;

  if (!isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const privateRoute = privateAPIRoutes.find((r) => r.path === route);

  if (privateRoute && !privateRoute.roles.includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

/*
 
    import { apiAuthMiddleware } from "@/apiMiddleware";
 
    const middlewareResponse = await apiAuthMiddleware(req);
    if (middlewareResponse) return middlewareResponse;
  
 */
