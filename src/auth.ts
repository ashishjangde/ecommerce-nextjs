import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { userRepository } from "./app/api/_repositoriy/UserRepository";
import bcryptjs from "bcryptjs";
import { UserRole } from "@prisma/client";
import { CredentialsSignin } from "next-auth"



export class CustomError extends CredentialsSignin {
  code: string;

  constructor(code: string) {
    super("CredentialsSignin"); 
    this.code = code; 
  
  }
}


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
      
        if (!email || !password) {
          throw new CustomError( "Email and password are required" );
        }
        const user = await userRepository.getUserByEmail(email);
      
        if (!user) {
         throw new CustomError( "email not found");
        }
      
        if (!user.isVerified) {
         throw new CustomError( "You are not verified !!");
        }
      
        if (!user.password) {
          throw new CustomError( "You have to login with credentials provider");
        }
        
        const isMatched = await bcryptjs.compare(password, user.password);
       
        if (!isMatched) {
          throw new CustomError( "Invalid password");
        }
      
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
        const existingUser = await userRepository.getUserByEmail(user.email!);
        
        if (!existingUser) {
          if(user.email === 'ashishjangde54@gmail.com'){
            {
              await userRepository.createUser({
                  email: user.email!,
                  name: user.name!,
                  profilePicture: user.image!,
                  isVerified: true,
                  roles: [UserRole.CUSTOMER , UserRole.ADMIN ],
              });
          }
        }else{
          {
            await userRepository.createUser({
                email: user.email!,
                name: user.name!,
                profilePicture: user.image!,
                isVerified: true,
                roles: [UserRole.CUSTOMER],
            });
        }
      }
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

  logger: {
    error(){

    }
  },
});
