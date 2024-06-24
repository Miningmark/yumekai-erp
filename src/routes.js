export const privateRoutes = [
  { path: "/dashboard", roles: ["user", "orga", "admin"] },
  { path: "/profile", roles: ["user", "orga", "admin"] },
  { path: "/adminPage", roles: ["admin"] },
  { path: "/kanban", roles: ["user", "orga", "admin"] },
  { path: "/changelog", roles: ["user", "orga", "admin"] },
  { path: "/commingSoon", roles: ["user", "orga", "admin"] },
  { path: "/bugReport", roles: ["user", "orga", "admin"] },
];

export const authRoutes = ["/login", "/test/auth/signin"];

// When user is not logged in and tries to access protected routes redirect to login page
export const DEFAULT_REDIRECT_LOGIN_URL = "/login";

// When user is logged in and tries to access login page redirect to dashboard
export const DEFAULT_REDIRECT_HOME_URL = "/dashboard";

// When user is logged in and has no access to page redirect to forbidden
export const DEFAULT_REDIRECT_FORBIDDEN_URL = "/forbidden";
