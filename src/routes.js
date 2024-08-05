export const privateRoutes = [
  { path: "/dashboard", roles: ["user", "orga", "admin"] },
  { path: "/profile", roles: ["user", "orga", "admin"] },
  { path: "/adminPage", roles: ["admin"] },
  { path: "/kanban", roles: ["user", "orga", "admin"] },
  { path: "/changelog", roles: ["user", "orga", "admin"] },
  { path: "/commingSoon", roles: ["user", "orga", "admin"] },
  { path: "/bugReport", roles: ["user", "orga", "admin"] },
  { path: "/survey", roles: ["orga", "admin"] },
  { path: "/conStand", roles: ["orga", "admin"] },
  { path: "/contacts", roles: ["user", "orga", "admin"] },
  { path: "/spcialMedia", roles: ["socialmedia", "orga", "admin"] },
];

export const privateAPIRoutes = [
  { path: "/api/bugReport", roles: ["user", "orga", "admin"] },
  { path: "/api/columns", roles: ["user", "orga", "admin"] },
  { path: "/api/contacts", roles: ["user", "orga", "admin"] },
  { path: "/api/email/send", roles: ["user", "orga", "admin"] },
  { path: "/api/email/show", roles: ["admin"] },
  { path: "/api/survey", roles: ["orga", "admin"] },
  { path: "/api/tasks", roles: ["user", "orga", "admin"] },
  { path: "/api/users/addUser", roles: ["admin"] },
  { path: "/api/users/editUser", roles: ["admin"] },
  { path: "/api/users/updateEmail", roles: ["user", "orga", "admin"] },
  { path: "/api/users/updatePassword", roles: ["user", "orga", "admin"] },
  { path: "/api/users/userList", roles: ["user", "orga", "admin"] },
  { path: "/api/users/userListFull", roles: ["admin"] },
  { path: "/api/conStand/stand", roles: ["user", "orga", "admin"] },
  { path: "/api/conStand/helpers", roles: ["user", "orga", "admin"] },
  { path: "/api/posts/tasks", roles: ["socialmedia", "orga", "admin"] },
  { path: "/api/posts/columns", roles: ["socialmedia", "orga", "admin"] },
];

export const authRoutes = ["/login", "/test/auth/signin", "/reset-password"];

// When user is not logged in and tries to access protected routes redirect to login page
export const DEFAULT_REDIRECT_LOGIN_URL = "/login";

// When user is logged in and tries to access login page redirect to dashboard
export const DEFAULT_REDIRECT_HOME_URL = "/dashboard";

// When user is logged in and has no access to page redirect to forbidden
export const DEFAULT_REDIRECT_FORBIDDEN_URL = "/forbidden";
