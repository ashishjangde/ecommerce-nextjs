import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import prisma from "./db/connectDb";
import { UserRole } from "@prisma/client";




export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toString() },
          });

          if (!user) return null;

          const isValidPassword = await bcryptjs.compare(
            credentials.password.toString(),
            user.password!
          );

          if (!isValidPassword) return null;

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            roles: user.roles,
          };
        } catch (error) {
          console.error("Error during credentials authorization:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile}) {
      const email = user.email?.toString();

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name !,
              email: email !,
              roles: [UserRole.CUSTOMER],
              profilePicture: user.image
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.roles = user.roles;
;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id!.toString();
        session.user.email = token.email!;
        session.user.roles = Array.isArray(token.roles) ? token.roles : []; 
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  logger: {
    error: (message) => {
      console.error("NextAuth Error:", message);
    },
  },
});
