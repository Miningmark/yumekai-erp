import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials, req) {
        if (!credentials.username || !credentials.password) {
          throw new Error("Username and password are required");
        }

        const url = process.env.NEXTAUTH_URL;

        try {
          const response = await fetch(`${url}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const user = await response.json();
          console.log("User from auth: ", user);

          return user || null;
        } catch (error) {
          console.error("Error during authentication", error);
          throw new Error("Internal server error");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
        token.lastlogins = user.lastlogins;
      }
      console.log("JWT token from auth: ", token);
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.id = token.id;
      session.user.lastlogins = token.lastlogins;
      console.log("Session from auth: ", session);
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${true ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".vercel.app",
        secure: true,
      },
    },
  },
  /*
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: "yumekai-erp.vercel.app", // Stelle sicher, dass dies auf deine Domain angepasst ist
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: "yumekai-erp.vercel.app", // Stelle sicher, dass dies auf deine Domain angepasst ist
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 900,
      },
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 900,
      },
    },
    nonce: {
      name: `next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  */
});
