import prisma from "@/db/connectPrismaDb";
import handleDatabaseOperation from "../_utils/handelDatabaseOperation";
import { Seller, Prisma, RequestStatus } from "@prisma/client";

export const SellerRepository = {


  getSellerById: async (id: string): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.findUnique({ where: { id } });
    });
  },


  getSellerByEmail: async (email: string): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.findUnique({ where: { email } });
    });
  },

  getSellerByUserId : async (userId: string): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.findUnique({ where: { userId } });
    });
  },


  createSeller: async (userData: Prisma.SellerCreateInput): Promise<Seller> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.create({
        data: userData, 
      });
    });
  },
  
  

  updateSeller: async (id: string, sellerData: Partial<Prisma.SellerUpdateInput>): Promise<Seller> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.update({ where: { id }, data: sellerData });
    });
  },

  getAllSellers: async (page: number, limit: number) => {
    return await handleDatabaseOperation(async () => {
      const sellers = await prisma.seller.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
              roles: true,
              isVerified: true,
              createdAt: true,
              updatedAt: true
            }
          }
        },
      });
  
      const totalPosts = await prisma.seller.count({
        where: { requestStatus: RequestStatus.Pending },
      });
  
      const totalPages = Math.ceil(totalPosts / limit);
  
      return { sellers, totalPosts, totalPages };
    });
  },
  


  deleteSeller: async (id: string): Promise<Seller> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.delete({ where: { id } });
    });
  }
};
