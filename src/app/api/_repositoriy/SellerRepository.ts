import prisma from "@/db/connectPrismaDb";
import handleDatabaseOperation from "../_utils/handelDatabaseOperation";
import { Seller, Prisma, RequestStatus } from "@prisma/client";

export const SellerRepository = {

  // Get Seller by ID with error handling
  getSellerById: async (id: string): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.findUnique({ where: { id } });
    });
  },

  // Get Seller by Email with error handling
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
      return await prisma.seller.create({ data: userData });
    });
  },

  updateSeller: async (id: string, sellerData: Partial<Prisma.SellerUpdateInput>): Promise<Seller> => {
    return await handleDatabaseOperation(async () => {
      return await prisma.seller.update({ where: { id }, data: sellerData });
    });
  },

  getAllSellersWhereStatusPending: async (page: number, limit: number) => {
    return await handleDatabaseOperation(async () => {
      const sellers = await prisma.seller.findMany({
        where: { requestStatus: RequestStatus.PENDING },
        skip: (page - 1) * limit, 
        take: limit, 
      });

      const totalPosts = await prisma.seller.count({
        where: { requestStatus: RequestStatus.PENDING },
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
