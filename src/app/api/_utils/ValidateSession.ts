import { auth } from "@/auth";
import { ApiError } from "./ApiError";

export const validateUserSession = async (): Promise<{ id: string; user: any }> => {
    const session = await auth(); 
    if (!session?.user || !session?.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }
    
    const user = session.user;
    return { id: user.id, user };
  };


export const validateAdminSession = async (): Promise<{ id: string; user: any }> => {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }
    
    const user = session.user;
    if (!user.roles.includes("ADMIN")) {
      throw new ApiError(403, "Forbidden");
    }
    return { id: user.id, user };
  };

  export const validateSellerSession = async (): Promise<{ id: string; user: any }> => {
    const session = await auth();
    if (!session?.user || !session?.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }
    
    const user = session.user;
    if (!user.roles.includes("SELLER")) {
      throw new ApiError(403, "Forbidden");
    }
    return { id: user.id, user };
  };