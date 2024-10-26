import { UserRole } from "@prisma/client"; 

declare module "next-auth" {
  interface User {
    id: string;
    roles: UserRole[];
    profilePicture?: string | null;
  }

  interface Session {
    user: {
      id: string;
      roles: UserRole[];
      profilePicture?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: UserRole[];
  }
}
