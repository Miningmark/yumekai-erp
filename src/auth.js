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

        const url = process.env.NEXTAUTH_URL || "http://localhost:3000";

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
  /*
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  */
});
