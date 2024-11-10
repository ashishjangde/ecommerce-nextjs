import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db/connectDb";
import { comparePassword } from "./helpers/PasswordHelper";
import { UserRole } from "@prisma/client";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isMatched = await comparePassword(password, user.password);
        if (!isMatched) return null;

        return { id: user.id, name: user.name, email: user.email, roles: user.roles, profilePicture: user.profilePicture };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.roles = token.roles as UserRole[]; 
        session.user.profilePicture = token.profilePicture as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email! } });
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              profilePicture: user.image!,
              isVerified: true,
              roles: [UserRole.CUSTOMER],
            },
          });
        } else {
          user.roles = existingUser.roles; 
        }
        return true;
      }

      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  },
});
