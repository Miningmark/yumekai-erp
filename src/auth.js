import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import userData from "@/dummy.json";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        const username = credentials.username;
        const password = credentials.password;

        console.log(username);
        console.log(password);

        for (var index in userData.users) {
          let record = userData.users[index];
          var user = {};
          var flag = false;

          if (record.username == username) {
            if (record.password == password) {
              user = {
                id: record.id,
                name: record.username,
              };
              flag = true;
              break;
            }
          }
        }

        if (flag) {
          return user;
        }

        return null;
      },
    }),
  ],
});
